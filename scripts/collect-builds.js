const fs = require('fs');
const path = require('path');

// Create root dist directory if it doesn't exist
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Create apps subdirectory
const appsDistDir = path.join(distDir, 'apps');
if (!fs.existsSync(appsDistDir)) {
  fs.mkdirSync(appsDistDir, { recursive: true });
}

// Auto-discover all apps
const appsDir = path.join(__dirname, '../apps');
const apps = fs.readdirSync(appsDir)
  .filter(dir => fs.statSync(path.join(appsDir, dir)).isDirectory());

apps.forEach(app => {
  const source = path.join(__dirname, `../apps/${app}/dist`);
  const dest = path.join(__dirname, `../dist/apps/${app}`);
  if (fs.existsSync(source)) {
    fs.cpSync(source, dest, { recursive: true });
    console.log(`✓ Copied ${app}`);
  } else {
    console.log(`⚠ No dist found for ${app}`);
  }
});

// Copy functions
const functionsSource = path.join(__dirname, '../functions');
const functionsDest = path.join(distDir, 'functions');
if (fs.existsSync(functionsSource)) {
  fs.cpSync(functionsSource, functionsDest, { recursive: true });
  console.log('✓ Copied functions');
}
