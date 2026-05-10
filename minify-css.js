const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');

const cssDir = path.join(__dirname, 'frontend/web/css');
const filesToBundle = ['main.css', 'header.css', 'home.css'];

let bundledCSS = '';

for (const file of filesToBundle) {
  const filePath = path.join(cssDir, file);
  if (fs.existsSync(filePath)) {
    bundledCSS += fs.readFileSync(filePath, 'utf8') + '\n';
  } else {
    console.error('File not found:', filePath);
  }
}

// Minify the bundled CSS
const output = new CleanCSS({}).minify(bundledCSS);

if (output.errors.length) {
  console.error('Errors minifying:', output.errors);
}

// Write the minified bundle
const bundlePath = path.join(cssDir, 'bundle.min.css');
fs.writeFileSync(bundlePath, output.styles, 'utf8');

console.log(`Bundled and minified CSS created at ${bundlePath} (Size: ${output.styles.length} bytes)`);

// Also minify dashboard.css just to be complete
const dashboardPath = path.join(cssDir, 'dashboard.css');
if (fs.existsSync(dashboardPath)) {
  const dashOutput = new CleanCSS({}).minify(fs.readFileSync(dashboardPath, 'utf8'));
  fs.writeFileSync(path.join(cssDir, 'dashboard.min.css'), dashOutput.styles, 'utf8');
  console.log('Minified dashboard.css');
}
