const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'frontend/web/header.html',
  'frontend/web/index.html',
  'frontend/web/affiliate/index.html',
  'frontend/web/reset-password/index.html',
  'frontend/web/thank-you/index.html',
];

for (const relPath of filesToUpdate) {
  const filePath = path.join(__dirname, '../', relPath);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/logo\.jpg/g, 'logo.webp');
    content = content.replace(/type="image\/jpeg"\s+href="([^"]+logo\.webp)"/g, 'type="image/webp" href="$1"');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${relPath}`);
  }
}
