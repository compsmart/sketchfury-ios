// Prepare assets on any OS; compilation/signing still require macOS and Xcode.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const config = JSON.parse(fs.readFileSync(path.join(root, 'capacitor.config.json'), 'utf8'));
if (config.appId !== 'com.sketchfury.app' || config.server.url !== 'https://sketchfury.com/app') {
  throw new Error('Check the production bundle ID and server URL before preparing iOS.');
}
const logo = 'data:image/webp;base64,' + fs.readFileSync(path.join(root, 'tools/offline-logo.webp')).toString('base64');
const offline = fs.readFileSync(path.join(root, 'tools/offline.template.html'), 'utf8')
  .replace('__APP_URL__', config.server.url).replace('__LOGO__', logo);
fs.mkdirSync(path.join(root, 'www'), { recursive: true });
fs.writeFileSync(path.join(root, 'www/offline.html'), offline);
fs.copyFileSync(path.join(root, 'assets/icon-1024.png'),
  path.join(root, 'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png'));
fs.copyFileSync(path.join(root, 'assets/splash-icon.png'),
  path.join(root, 'ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732.png'));
const result = spawnSync(process.execPath, ['node_modules/@capacitor/cli/bin/capacitor', 'sync', 'ios'], {
  cwd: root, stdio: 'inherit',
});
if (result.status !== 0) process.exit(result.status || 1);
console.log('iOS assets and plugins prepared. Open ios/App/App.xcodeproj on a Mac to build.');
console.log('Push remains unavailable until Firebase/APNs is configured; see IOS.md.');
