const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/web/index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Replace team background images
html = html.replace(/url\('assets\/Founder\.jpeg'\)/g, "url('assets/Founder.webp')");
html = html.replace(/url\('assets\/Co%20founder\.jpeg'\)/g, "url('assets/Co%20founder.webp')");
html = html.replace(/url\('assets\/Manager\.jpeg'\)/g, "url('assets/Manager.webp')");
html = html.replace(/url\('assets\/Senior%20Counsellor\.jpeg'\)/g, "url('assets/Senior%20Counsellor.webp')");
html = html.replace(/url\('assets\/Senior Counsellor\.jpeg'\)/g, "url('assets/Senior%20Counsellor.webp')");

fs.writeFileSync(filePath, html, 'utf8');
console.log('HTML team images updated successfully');
