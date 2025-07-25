// APK Store JavaScript
class APKStore {
    constructor() {
        this.apps = [];
        this.filteredApps = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        
        this.initializeElements();
        this.bindEvents();
        this.loadApps();
    }

    initializeElements() {
        this.searchInput = document.getElementById('searchInput');
        this.appsGrid = document.getElementById('appsGrid');
        this.appCount = document.getElementById('appCount');
        this.loading = document.getElementById('loading');
        this.noResults = document.getElementById('noResults');
        this.modal = document.getElementById('appModal');
        this.modalBody = document.getElementById('modalBody');
        this.closeModal = document.getElementById('closeModal');
        this.filterButtons = document.querySelectorAll('.filter-btn');
    }

    bindEvents() {
        // Search functionality
        this.searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.filterAndDisplayApps();
        });

        // Filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.category;
                this.filterAndDisplayApps();
            });
        });

        // Modal events
        this.closeModal.addEventListener('click', () => {
            this.hideModal();
        });

        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal();
            }
            if (e.key === '/' && !e.target.matches('input')) {
                e.preventDefault();
                this.searchInput.focus();
            }
        });
    }

    async loadApps() {
        try {
            // Simulate loading time
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // In a real implementation, this would fetch from your APK folder
            // For now, we'll use hardcoded data with example apps
            this.apps = await this.fetchAppsData();
            
            this.filteredApps = [...this.apps];
            this.displayApps();
            this.updateAppCount();
            this.hideLoading();
        } catch (error) {
            console.error('Error loading apps:', error);
            this.showError('Failed to load apps. Please try again later.');
        }
    }

    async fetchAppsData() {
        // In a real implementation, this would scan the APK folder
        // For now, returning example data
        return [
            /*{
                id: 1,
                name: "Example Game",
                description: "An exciting adventure game with stunning graphics and immersive gameplay.",
                category: "games",
                version: "2.1.0",
                size: "45.2 MB",
                icon: "fas fa-gamepad",
                filename: "example-game.apk",
                downloadCount: 1250,
                lastUpdated: "2024-01-15"
            },
            {
                id: 2,
                name: "Task Manager Pro",
                description: "Professional task management app to boost your productivity and organize your life.",
                category: "productivity",
                version: "1.5.3",
                size: "12.8 MB",
                icon: "fas fa-tasks",
                filename: "task-manager-pro.apk",
                downloadCount: 850,
                lastUpdated: "2024-01-10"
            },
            {
                id: 3,
                name: "Social Connect",
                description: "Connect with friends and family through this modern social networking application.",
                category: "social",
                version: "3.2.1",
                size: "28.5 MB",
                icon: "fas fa-users",
                filename: "social-connect.apk",
                downloadCount: 2100,
                lastUpdated: "2024-01-12"
            },
            {
                id: 4,
                name: "File Explorer Plus",
                description: "Advanced file management tool with powerful features and intuitive interface.",
                category: "tools",
                version: "4.0.2",
                size: "8.7 MB",
                icon: "fas fa-folder",
                filename: "file-explorer-plus.apk",
                downloadCount: 675,
                lastUpdated: "2024-01-08"
            },
            {
                id: 5,
                name: "Photo Editor Studio",
                description: "Professional photo editing with filters, effects, and advanced editing tools.",
                category: "tools",
                version: "2.8.1",
                size: "35.6 MB",
                icon: "fas fa-camera",
                filename: "photo-editor-studio.apk",
                downloadCount: 1420,
                lastUpdated: "2024-01-14"
            },*/
            {
                id: 6,
                name: "POS BETA",
                description: "Mobile application for point of sale",
                category: "productivity", // games, productivity, social, tools
                version: "1.0.0",
                size: "35.254 KB",
                icon: "fas fa-tasks", // FontAwesome icon class
                filename: "app-release.apk", // Must match actual APK filename
                downloadCount: 0,
                lastUpdated: "2025-07-24"
            }
        ];
    }

    filterAndDisplayApps() {
        this.filteredApps = this.apps.filter(app => {
            const matchesCategory = this.currentFilter === 'all' || app.category === this.currentFilter;
            const matchesSearch = app.name.toLowerCase().includes(this.searchTerm) || 
                                 app.description.toLowerCase().includes(this.searchTerm);
            return matchesCategory && matchesSearch;
        });

        this.displayApps();
        this.updateAppCount();
    }

    displayApps() {
        if (this.filteredApps.length === 0) {
            this.showNoResults();
            return;
        }

        this.hideNoResults();
        
        this.appsGrid.innerHTML = this.filteredApps.map(app => 
            this.createAppCard(app)
        ).join('');

        // Add event listeners to app cards and download buttons
        this.appsGrid.querySelectorAll('.app-card').forEach((card, index) => {
            const app = this.filteredApps[index];
            
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('download-btn')) {
                    this.showAppDetails(app);
                }
            });
        });

        this.appsGrid.querySelectorAll('.download-btn').forEach((btn, index) => {
            const app = this.filteredApps[index];
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.downloadApp(app);
            });
        });

        // Animate cards
        this.appsGrid.querySelectorAll('.app-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    }

    createAppCard(app) {
        return `
            <div class="app-card">
                <div class="app-icon">
                    <i class="${app.icon}"></i>
                </div>
                <h3 class="app-name">${app.name}</h3>
                <p class="app-description">${app.description}</p>
                <div class="app-meta">
                    <span class="app-version">v${app.version}</span>
                    <span class="app-size">${app.size}</span>
                </div>
                <div class="app-category">${this.getCategoryLabel(app.category)}</div>
                <button class="download-btn">
                    <i class="fas fa-download"></i>
                    Download APK
                </button>
            </div>
        `;
    }

    getCategoryLabel(category) {
        const labels = {
            'games': 'Games',
            'productivity': 'Productivity',
            'social': 'Social',
            'tools': 'Tools'
        };
        return labels[category] || category;
    }

    showAppDetails(app) {
        this.modalBody.innerHTML = `
            <div class="modal-app-info">
                <div class="modal-app-icon">
                    <i class="${app.icon}"></i>
                </div>
                <h3 class="modal-app-name">${app.name}</h3>
                <p class="modal-app-description">${app.description}</p>
            </div>
            <div class="app-details">
                <div class="detail-row">
                    <strong>Version:</strong> ${app.version}
                </div>
                <div class="detail-row">
                    <strong>Size:</strong> ${app.size}
                </div>
                <div class="detail-row">
                    <strong>Category:</strong> ${this.getCategoryLabel(app.category)}
                </div>
                <div class="detail-row">
                    <strong>Downloads:</strong> ${app.downloadCount.toLocaleString()}
                </div>
                <div class="detail-row">
                    <strong>Last Updated:</strong> ${new Date(app.lastUpdated).toLocaleDateString()}
                </div>
                <div class="detail-row">
                    <strong>File:</strong> ${app.filename}
                </div>
            </div>
            <button class="download-btn" onclick="apkStore.downloadApp(${JSON.stringify(app).replace(/"/g, '&quot;')})">
                <i class="fas fa-download"></i>
                Download ${app.name}
            </button>
        `;
        
        this.showModal();
    }

    downloadApp(app) {
        const originalBtn = event.target.closest('.download-btn');
        const originalText = originalBtn.innerHTML;
        
        // Show downloading state
        originalBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
        originalBtn.disabled = true;
        
        // Try different download approaches
        setTimeout(() => {
            const downloadUrl = `apks/${app.filename}`;
            
            // First, check if file exists
            fetch(downloadUrl, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        // File exists, proceed with download
                        const link = document.createElement('a');
                        link.href = downloadUrl;
                        link.download = app.filename;
                        link.setAttribute('target', '_blank');
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        this.showNotification(`${app.name} download started!`, 'success');
                    } else {
                        throw new Error(`File not found: ${response.status}`);
                    }
                })
                .catch(error => {
                    console.error('Download failed:', error);
                    
                    // Fallback: try direct navigation
                    try {
                        window.open(downloadUrl, '_blank');
                        this.showNotification(`Opening ${app.name} download...`, 'success');
                    } catch (fallbackError) {
                        console.error('Fallback download failed:', fallbackError);
                        this.showNotification(`Download failed. File may not exist: ${app.filename}`, 'error');
                    }
                })
                .finally(() => {
                    // Reset button
                    originalBtn.innerHTML = originalText;
                    originalBtn.disabled = false;
                });
            
        }, 1000);
    }

    showModal() {
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    hideModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    updateAppCount() {
        this.appCount.textContent = `${this.filteredApps.length} Apps`;
    }

    hideLoading() {
        this.loading.style.display = 'none';
    }

    showNoResults() {
        this.noResults.style.display = 'block';
    }

    hideNoResults() {
        this.noResults.style.display = 'none';
    }

    showError(message) {
        this.loading.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
        `;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Choose icon and color based on type
        let icon, backgroundColor;
        switch(type) {
            case 'success':
                icon = 'fas fa-check-circle';
                backgroundColor = '#48bb78';
                break;
            case 'error':
                icon = 'fas fa-exclamation-triangle';
                backgroundColor = '#e53e3e';
                break;
            default:
                icon = 'fas fa-info-circle';
                backgroundColor = '#667eea';
        }
        
        notification.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
        `;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: backgroundColor,
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'slideInRight 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, type === 'error' ? 5000 : 3000); // Show errors longer
    }
}

// Additional CSS for notifications (injected via JavaScript)
const notificationCSS = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f1f5f9;
    }
    
    .detail-row:last-child {
        border-bottom: none;
    }
`;

// Inject notification styles
const style = document.createElement('style');
style.textContent = notificationCSS;
document.head.appendChild(style);

// Initialize the APK Store when DOM is loaded
let apkStore;
document.addEventListener('DOMContentLoaded', () => {
    apkStore = new APKStore();
});

// Export for global access (useful for modal buttons)
window.apkStore = apkStore; 