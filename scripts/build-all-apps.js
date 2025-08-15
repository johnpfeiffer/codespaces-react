const fs = require('fs');
const { execSync } = require('child_process');

const apps = fs.readdirSync('./apps');
apps.forEach(app => {
  console.log(`Building ${app}...`);
  execSync(`cd apps/${app} && npm install && npm run build`, { stdio: 'inherit' });
});