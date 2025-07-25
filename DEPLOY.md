# 🚀 APK Distribution Site - Deployment Guide

This guide will walk you through setting up and deploying your APK distribution landing page to a web hosting server using FTP.

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js** (version 14.0.0 or higher) - [Download here](https://nodejs.org/)
- ✅ **Web hosting account** with FTP access
- ✅ **FTP credentials** from your hosting provider
- ✅ **Domain name** (optional but recommended)

## 🛠️ Initial Setup

### Step 1: Verify Node.js Installation

```bash
# Check Node.js version
node --version

# Check npm version
npm --version
```

### Step 2: Install Dependencies

```bash
# Navigate to your project directory
cd android-apk-distribution-page

# Install required packages
npm install
```

This will install:
- `basic-ftp` - For FTP file uploads
- `dotenv` - For environment variable management

## ⚙️ Configuration

### Step 3: Set Up Environment Variables

1. **Locate your `.env` file** in the project root
2. **Add your FTP credentials** using the template below:

```env
# Required FTP Configuration
FTP_HOST=ftp.yourdomain.com
FTP_USER=your-ftp-username
FTP_PASSWORD=your-secure-password

# Optional Configuration (with defaults)
FTP_PORT=21
FTP_SECURE=false
FTP_REMOTE_DIR=/public_html
```

#### Common FTP Settings by Hosting Provider:

**cPanel/Shared Hosting:**
```env
FTP_HOST=ftp.yourdomain.com
FTP_USER=username@yourdomain.com
FTP_REMOTE_DIR=/public_html
```

**Plesk Hosting:**
```env
FTP_HOST=your-server.com
FTP_USER=your-plesk-username
FTP_REMOTE_DIR=/httpdocs
```

**VPS/Dedicated Server:**
```env
FTP_HOST=your-server-ip
FTP_USER=your-username
FTP_REMOTE_DIR=/var/www/html
```

### Step 4: Configure Your APK Files

1. **Add your APK files** to the `apks/` folder:
   ```
   apks/
   ├── your-app-v1.apk
   ├── another-app-v2.apk
   └── game-app-v3.apk
   ```

2. **Update app metadata** in `script.js`:
   
   Find the `fetchAppsData()` function and replace the example data:

   ```javascript
   async fetchAppsData() {
       return [
           {
               id: 1,
               name: "Your App Name",
               description: "Your app description here",
               category: "games", // games, productivity, social, tools
               version: "1.0.0",
               size: "12.5 MB",
               icon: "fas fa-gamepad", // FontAwesome icon
               filename: "your-app-v1.apk", // Must match actual filename
               downloadCount: 0,
               lastUpdated: "2024-01-15"
           },
           // Add more apps here...
       ];
   }
   ```

### Step 5: Customize Your Site (Optional)

**Update Branding:**
- Edit `index.html` - Change site title and header text
- Modify `styles.css` - Update colors and styling
- Replace icons and logos as needed

**Add Categories:**
- Update filter buttons in `index.html`
- Modify `getCategoryLabel()` function in `script.js`

## 🚀 Deployment

### Step 6: Test Locally (Recommended)

Before deploying, test your site locally:

```bash
# Option 1: Use Python (if installed)
python -m http.server 8000

# Option 2: Use Node.js http-server (install globally)
npm install -g http-server
http-server

# Option 3: Use Live Server extension in VS Code
```

Visit `http://localhost:8000` to test your site.

### Step 7: Deploy to Server

Run the FTP upload script:

```bash
# Deploy using Node.js script
node ftp-upload.js

# Or use the npm script
npm run upload
```

#### Expected Output:
```
🚀 APK Distribution Site - FTP Uploader
==========================================

🔗 Connecting to FTP server...
✅ Connected successfully!
📁 Changing to directory: /public_html
📋 Scanning files...
📊 Found 6 files to upload
🚀 Starting upload...

📤 Uploading: index.html -> index.html (2.1 KB)
✅ Uploaded: index.html (1/6)
📤 Uploading: styles.css -> styles.css (8.0 KB)
✅ Uploaded: styles.css (2/6)
📤 Uploading: script.js -> script.js (14.0 KB)
✅ Uploaded: script.js (3/6)
📤 Uploading: apks/your-app.apk -> apks/your-app.apk (5.2 MB)
✅ Uploaded: apks/your-app.apk (4/6)

📈 Upload Summary:
✅ Successfully uploaded: 6 files
❌ Failed uploads: 0 files
⏱️  Total time: 15.23 seconds

🎉 Upload completed successfully!
🌐 Your APK distribution site is now live!
```

## 🔍 Verification

### Step 8: Test Your Live Site

1. **Visit your domain** in a web browser
2. **Test all functionality:**
   - ✅ Site loads correctly
   - ✅ Search functionality works
   - ✅ Category filtering works
   - ✅ App modals open correctly
   - ✅ Download buttons trigger downloads
   - ✅ Mobile responsiveness

3. **Test APK downloads:**
   - Click download buttons
   - Verify APK files download correctly
   - Test on different devices/browsers

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### FTP Connection Issues
```bash
❌ Failed to connect to FTP server: getaddrinfo ENOTFOUND
```
**Solution:** Check your `FTP_HOST` in `.env` file

#### Authentication Failed
```bash
❌ Failed to connect to FTP server: 530 Login incorrect
```
**Solution:** Verify `FTP_USER` and `FTP_PASSWORD` in `.env` file

#### Permission Denied
```bash
❌ Failed to upload: 550 Permission denied
```
**Solution:** Check `FTP_REMOTE_DIR` path and folder permissions

#### Missing Dependencies
```bash
Error: Cannot find module 'basic-ftp'
```
**Solution:** Run `npm install` to install dependencies

#### APK Downloads Not Working
**Solution:** 
- Verify APK files are in the `apks/` folder
- Check filename matches in `script.js`
- Ensure server allows APK file downloads

### Debug Mode

Add verbose logging to troubleshoot issues:

```javascript
// In ftp-upload.js, modify the FTP config:
const FTP_CONFIG = {
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    port: parseInt(process.env.FTP_PORT) || 21,
    secure: process.env.FTP_SECURE === 'true',
    remoteDir: process.env.FTP_REMOTE_DIR || '/public_html',
    // Add debug logging
    verbose: true
};
```

## 🔄 Updating Your Site

### When Adding New APK Files:

1. **Add APK file** to `apks/` folder
2. **Update metadata** in `script.js`
3. **Redeploy:** `npm run upload`

### When Updating Site Design:

1. **Modify HTML/CSS/JS** files
2. **Test locally** first
3. **Redeploy:** `npm run upload`

## 📁 File Structure Reference

```
android-apk-distribution-page/
├── index.html              # Main landing page
├── styles.css              # Site styling
├── script.js               # Site functionality
├── ftp-upload.js           # Deployment script
├── package.json            # Node.js dependencies
├── .env                    # FTP credentials (DO NOT COMMIT)
├── env-example.txt         # Environment template
├── DEPLOY.md              # This deployment guide
├── README.md              # Project documentation
└── apks/                  # APK files directory
    ├── README.md          # APK management guide
    └── *.apk             # Your APK files
```

## 🔒 Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use FTPS** if your host supports it (`FTP_SECURE=true`)
3. **Regular password updates** for FTP accounts
4. **Backup your APK files** before deployment
5. **Monitor download logs** on your hosting account

## 📞 Support

If you encounter issues:

1. **Check hosting provider documentation** for FTP settings
2. **Contact hosting support** for FTP access issues
3. **Review error messages** carefully
4. **Test with a single small file** first

## 🎉 Success!

Once deployed successfully, your APK distribution site will be live and accessible to users worldwide! 

**Your site features:**
- ✅ Professional, mobile-responsive design
- ✅ Real-time search and filtering
- ✅ Secure APK file downloads
- ✅ Easy content management
- ✅ SEO-friendly structure

---

**Next Steps:** Share your site URL and start distributing your Android apps! 📱 