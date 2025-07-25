# APK Distribution Landing Page

A modern, responsive landing page for distributing Android APK files. This is essentially a public Android app store with hardcoded APK files.

## Features

- **Modern UI/UX Design** - Beautiful, responsive interface with glassmorphism effects
- **Search Functionality** - Real-time search through app names and descriptions
- **Category Filtering** - Filter apps by Games, Productivity, Social, and Tools
- **App Details Modal** - Detailed view of each application
- **Download Management** - Direct APK file downloads with progress indicators
- **Mobile Responsive** - Optimized for desktop, tablet, and mobile devices
- **Keyboard Shortcuts** - Press `/` to focus search, `Esc` to close modals

## Quick Start

1. **Clone/Download** this repository
2. **Add your APK files** to the `apks/` folder
3. **Update app metadata** in `script.js` (see instructions below)
4. **Open `index.html`** in a web browser or deploy to a web server

## File Structure

```
android-apk-distribution-page/
├── index.html          # Main landing page
├── styles.css          # Styling and responsive design
├── script.js           # JavaScript functionality
├── apks/               # Directory for APK files
│   ├── README.md       # Instructions for adding APKs
│   └── [your-apk-files]
└── README.md           # This file
```

## Adding Your APK Files

### Step 1: Add APK Files
Place your APK files in the `apks/` directory:
```
apks/
├── my-awesome-game.apk
├── productivity-app.apk
└── photo-editor.apk
```

### Step 2: Update Metadata
Edit the `fetchAppsData()` function in `script.js` to include your app information:

```javascript
async fetchAppsData() {
    return [
        {
            id: 1,
            name: "My Awesome Game",
            description: "An incredible gaming experience with stunning graphics.",
            category: "games", // games, productivity, social, tools
            version: "2.1.0",
            size: "45.2 MB",
            icon: "fas fa-gamepad", // FontAwesome icon
            filename: "my-awesome-game.apk", // Must match actual filename
            downloadCount: 1250,
            lastUpdated: "2024-01-15"
        },
        // Add more apps here...
    ];
}
```

### Step 3: Test Your Setup
Open `index.html` in a web browser to test the landing page.

## Customization

### Branding
- Update the site title in `index.html` (`<title>` and `<h1>` elements)
- Modify colors in `styles.css` by changing CSS custom properties
- Replace the Android icon with your own logo

### Categories
Add new categories by:
1. Adding filter buttons in `index.html`
2. Updating the `getCategoryLabel()` function in `script.js`

### Styling
The design uses CSS custom properties for easy theming:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #48bb78;
    /* Modify these values to change the theme */
}
```

## Deployment

### Static Hosting
This is a static website that can be deployed to:
- **GitHub Pages**
- **Netlify**
- **Vercel**
- **Any web server** (Apache, Nginx, etc.)

### Example Deployment Commands
```bash
# For GitHub Pages
git add .
git commit -m "Add APK distribution page"
git push origin main

# Enable GitHub Pages in repository settings
```

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Dependencies

The page uses:
- **FontAwesome 6.0.0** (loaded via CDN)
- **Pure HTML/CSS/JavaScript** (no frameworks required)

## Security Considerations

⚠️ **Important Security Notes:**

1. **APK Verification**: Only host APK files from trusted sources
2. **HTTPS**: Use HTTPS in production to ensure secure downloads
3. **Content Security**: Consider implementing file scanning/verification
4. **User Warning**: The page includes disclaimers about download risks

## Advanced Features

### Real APK Scanning
To automatically scan APK files from the folder, you would need:
- A backend server (PHP, Node.js, Python, etc.)
- File system access to read APK metadata
- APK parsing libraries to extract app information

### Example PHP Implementation
```php
<?php
// scan-apks.php
$apkFolder = './apks/';
$apkFiles = glob($apkFolder . '*.apk');
$appsData = [];

foreach ($apkFiles as $apkFile) {
    // Extract APK metadata using APK parser
    $appsData[] = [
        'filename' => basename($apkFile),
        'size' => filesize($apkFile),
        // Add more metadata extraction here
    ];
}

header('Content-Type: application/json');
echo json_encode($appsData);
?>
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues:
1. Check the `apks/README.md` for APK-related instructions
2. Review the code comments in `script.js`
3. Open an issue in the repository

---

**Note**: This is an MVP (Minimum Viable Product) implementation. For production use, consider adding backend validation, user authentication, and enhanced security measures.
