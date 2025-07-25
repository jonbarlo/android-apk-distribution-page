# APK Files Directory

This directory contains the APK files that will be distributed through the landing page.

## How to Add APK Files

1. **Place your APK files** in this directory
2. **Update the app metadata** in `script.js` by modifying the `fetchAppsData()` function
3. **Ensure your APK files** match the filenames specified in the metadata

## Example APK Structure

```
apks/
├── example-game.apk
├── task-manager-pro.apk
├── social-connect.apk
├── file-explorer-plus.apk
└── photo-editor-studio.apk
```

## Metadata Format

For each APK file, you need to add an entry in the `fetchAppsData()` function in `script.js`:

```javascript
{
    id: 1,
    name: "Your App Name",
    description: "A brief description of your app",
    category: "games", // games, productivity, social, tools
    version: "1.0.0",
    size: "12.5 MB",
    icon: "fas fa-tasks", // FontAwesome icon class
    filename: "your-app.apk", // Must match actual APK filename
    downloadCount: 0,
    lastUpdated: "2024-01-15"
}
```

## Supported Categories

- `games` - Gaming applications
- `productivity` - Productivity and work-related apps
- `social` - Social networking and communication apps
- `tools` - Utility and tool applications

## Security Note

⚠️ **Important**: Only upload APK files from trusted sources. Users download files at their own risk.

## File Size Recommendations

- Keep APK files under 100MB for faster downloads
- Consider providing file size information in the metadata
- Test download links before publishing

## Icon Options

Use FontAwesome icons for app icons. Popular choices:
- `fas fa-gamepad` (Games)
- `fas fa-tasks` (Productivity)
- `fas fa-users` (Social)
- `fas fa-tools` (Tools)
- `fas fa-mobile-alt` (Mobile apps)
- `fas fa-camera` (Photo/Camera apps)
- `fas fa-music` (Music apps) 