const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function copySharedAssets(appPath) {
  const sharedPublicPath = './SHARED/public';
  const appPublicPath = path.join(appPath, 'public');

  if (!fs.existsSync(sharedPublicPath)) {
    console.log('No SHARED/public directory found, skipping shared asset copy');
    return;
  }

  if (!fs.existsSync(appPublicPath)) {
    fs.mkdirSync(appPublicPath, { recursive: true });
  }

  const sharedFiles = fs.readdirSync(sharedPublicPath);
  sharedFiles.forEach(file => {
    const srcPath = path.join(sharedPublicPath, file);
    const destPath = path.join(appPublicPath, file);

    if (fs.statSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`  Copied ${file} to ${appPath}/public/`);
    }
  });
}

const apps = fs.readdirSync('./apps');
apps.forEach(app => {
  const appPath = `./apps/${app}`;
  console.log(`Preparing ${app}...`);

  copySharedAssets(appPath);

  console.log(`Building ${app}...`);
  execSync(`cd apps/${app} && npm install && npm run build`, { stdio: 'inherit' });
});
