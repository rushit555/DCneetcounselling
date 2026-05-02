const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/web/index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Remove the "Cutoff + Counselling + College Guide" paragraph
html = html.replace(/<p style="font-size: 11px; font-weight: 600; color: #1e293b !important; margin: 0 0 10px 0;">Cutoff \+ Counselling \+ College Guide<\/p>/g, '');

// 2. Change .ec-courses color to white
html = html.replace(/color: #64748b !important;\s*margin: 0 0 8px 0;/g, 'color: #ffffff !important;\n          margin: 0 0 8px 0;');

// 3. Change .mo-subtitle color to white
html = html.replace(/color: #64748b !important;\s*margin: 0 0 16px 0;/g, 'color: #ffffff !important;\n          margin: 0 0 16px 0;');


fs.writeFileSync(filePath, html, 'utf8');
console.log('Done removing text and changing stream names to white.');
