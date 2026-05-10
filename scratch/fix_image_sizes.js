const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/web/index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Remove hardcoded width and height attributes that I added
html = html.replace(/\s+width="892"\s+height="1116"/g, '');
html = html.replace(/\s+width="1000"\s+height="1000"/g, '');
html = html.replace(/\s+width="960"\s+height="1036"/g, '');
html = html.replace(/\s+width="1280"\s+height="720"/g, '');
html = html.replace(/\s+width="1024"\s+height="1024"/g, '');

fs.writeFileSync(filePath, html, 'utf8');
console.log('Fixed image dimensions');
