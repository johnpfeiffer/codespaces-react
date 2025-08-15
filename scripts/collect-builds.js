const fs = require('fs');
const path = require('path');

// Create final dist directory
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy each app's build
const apps = ['blog'];
apps.forEach(app => {
  const source = path.join(__dirname, `../apps/${app}/dist`);
  const dest = path.join(distDir, `apps/${app}`);
  fs.cpSync(source, dest, { recursive: true });
});

// Copy functions
fs.cpSync(
  path.join(__dirname, '../functions'), 
  path.join(distDir, 'functions'), 
  { recursive: true }
);