const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// FTP Configuration - Read from .env file
const FTP_CONFIG = {
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    port: parseInt(process.env.FTP_PORT) || 21,
    secure: process.env.FTP_SECURE === 'true',
    remoteDir: process.env.FTP_REMOTE_DIR || '/public_html'
};

// Files and folders to exclude from upload
const EXCLUDE_PATTERNS = [
    'node_modules',
    '.git',
    'ftp-upload.js',
    'package.json',
    'package-lock.json',
    '.gitignore',
    'index2.html',           // Backup file, not needed on server
    '.env',                  // Environment variables
    '.env.example',          // Environment template
    'env-example.txt'        // Environment template
];

// File extensions to exclude
const EXCLUDE_EXTENSIONS = [
    '.md'                    // All markdown files (README.md, DEPLOY.md, etc.)
];

// Check if file should be excluded by extension
function shouldExcludeByExtension(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return EXCLUDE_EXTENSIONS.includes(ext);
}

class FTPUploader {
    constructor() {
        this.client = new ftp.Client();
        this.uploadedFiles = 0;
        this.totalFiles = 0;
        this.errors = [];
    }

    async connect() {
        try {
            console.log('🔗 Connecting to FTP server...');
            await this.client.access(FTP_CONFIG);
            console.log('✅ Connected successfully!');
            
            // Change to remote directory
            if (FTP_CONFIG.remoteDir) {
                console.log(`📁 Changing to directory: ${FTP_CONFIG.remoteDir}`);
                await this.client.ensureDir(FTP_CONFIG.remoteDir);
                await this.client.cd(FTP_CONFIG.remoteDir);
            }
        } catch (error) {
            console.error('❌ Failed to connect to FTP server:', error.message);
            throw error;
        }
    }

    async disconnect() {
        this.client.close();
        console.log('🔌 Disconnected from FTP server');
    }

    shouldExclude(filePath) {
        return EXCLUDE_PATTERNS.some(pattern => 
            filePath.includes(pattern) || path.basename(filePath) === pattern
        ) || shouldExcludeByExtension(filePath);
    }

    async getAllFiles(dir = '.', baseDir = '.') {
        const files = [];
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            const relativePath = path.relative(baseDir, fullPath);

            if (this.shouldExclude(relativePath)) {
                continue;
            }

            const stats = fs.statSync(fullPath);
            
            if (stats.isDirectory()) {
                const subFiles = await this.getAllFiles(fullPath, baseDir);
                files.push(...subFiles);
            } else {
                // For files in apks/ folder, put them in root apks/ on server
                // For other files, put them in root
                let remotePath;
                if (relativePath.startsWith('apks/') || relativePath.startsWith('apks\\')) {
                    remotePath = relativePath.replace(/\\/g, '/');
                } else {
                    // Put all other files directly in root
                    remotePath = path.basename(fullPath);
                }
                
                files.push({
                    localPath: fullPath,
                    remotePath: remotePath,
                    size: stats.size
                });
            }
        }

        return files;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

         async uploadFile(file) {
         try {
             // Ensure remote directory exists
             const remoteDir = path.dirname(file.remotePath);
             if (remoteDir !== '.' && remoteDir !== '') {
                 console.log(`📁 Ensuring directory exists: ${remoteDir}`);
                 
                 // Split path and create each directory level
                 const dirs = remoteDir.split('/').filter(d => d);
                 let currentPath = '';
                 
                 for (const dir of dirs) {
                     currentPath += (currentPath ? '/' : '') + dir;
                     try {
                         // Try to create directory
                         await this.client.send(`MKD ${currentPath}`);
                         console.log(`✅ Created directory: ${currentPath}`);
                     } catch (mkdError) {
                         // Directory might already exist, that's fine
                         if (!mkdError.message.includes('exists') && !mkdError.message.includes('550')) {
                             console.log(`⚠️  MKD warning for ${currentPath}: ${mkdError.message}`);
                         }
                     }
                 }
             }

            console.log(`📤 Uploading: ${file.localPath} -> ${file.remotePath} (${this.formatBytes(file.size)})`);
            
            await this.client.uploadFrom(file.localPath, file.remotePath);
            this.uploadedFiles++;
            
            console.log(`✅ Uploaded: ${file.remotePath} (${this.uploadedFiles}/${this.totalFiles})`);
        } catch (error) {
            this.errors.push({
                file: file.localPath,
                error: error.message
            });
            console.error(`❌ Failed to upload ${file.localPath}:`, error.message);
        }
    }

    async uploadAll() {
        try {
            console.log('📋 Scanning files...');
            const files = await this.getAllFiles();
            this.totalFiles = files.length;

            if (files.length === 0) {
                console.log('⚠️  No files found to upload');
                return;
            }

            console.log(`📊 Found ${files.length} files to upload`);
            console.log('🚀 Starting upload...\n');

            const startTime = Date.now();

            // Upload files sequentially to avoid overwhelming the server
            for (const file of files) {
                await this.uploadFile(file);
            }

            const endTime = Date.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);

            console.log('\n📈 Upload Summary:');
            console.log(`✅ Successfully uploaded: ${this.uploadedFiles} files`);
            console.log(`❌ Failed uploads: ${this.errors.length} files`);
            console.log(`⏱️  Total time: ${duration} seconds`);

            if (this.errors.length > 0) {
                console.log('\n❌ Failed uploads:');
                this.errors.forEach(error => {
                    console.log(`   ${error.file}: ${error.error}`);
                });
            }

        } catch (error) {
            console.error('❌ Upload process failed:', error.message);
            throw error;
        }
    }

    async run() {
        try {
            await this.connect();
            await this.uploadAll();
        } catch (error) {
            console.error('💥 Fatal error:', error.message);
            process.exit(1);
        } finally {
            await this.disconnect();
        }
    }
}

// Validation function
function validateConfig() {
    const requiredEnvVars = ['FTP_HOST', 'FTP_USER', 'FTP_PASSWORD'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables in .env file:');
        missingVars.forEach(varName => {
            console.log(`   - ${varName}`);
        });
        console.log('\n📝 Your .env file should contain:');
        console.log('   FTP_HOST=your-ftp-host.com');
        console.log('   FTP_USER=your-ftp-username');
        console.log('   FTP_PASSWORD=your-ftp-password');
        console.log('   FTP_PORT=21 (optional, defaults to 21)');
        console.log('   FTP_SECURE=false (optional, set to true for FTPS)');
        console.log('   FTP_REMOTE_DIR=/public_html (optional, defaults to /public_html)');
        process.exit(1);
    }
    
    if (!FTP_CONFIG.host || !FTP_CONFIG.user || !FTP_CONFIG.password) {
        console.error('❌ FTP credentials are empty. Please check your .env file.');
        process.exit(1);
    }
}

// Main execution
if (require.main === module) {
    console.log('🚀 APK Distribution Site - FTP Uploader');
    console.log('==========================================\n');
    
    validateConfig();
    
    const uploader = new FTPUploader();
    uploader.run().then(() => {
        console.log('\n🎉 Upload completed successfully!');
        console.log('🌐 Your APK distribution site is now live!');
    }).catch(error => {
        console.error('\n💥 Upload failed:', error.message);
        process.exit(1);
    });
}

module.exports = FTPUploader; 