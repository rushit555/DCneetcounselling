const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/web/index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Fix .mo-title
html = html.replace(/\.mo-title \{\s*font-size: 18px;\s*font-weight: 700;\s*color: #0f172a;\s*margin: 0 0 6px 0;\s*\}/g, `#app-root .mo-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a !important;
          margin: 0 0 6px 0;
        }`);

// Fix .mo-subtitle
html = html.replace(/\.mo-subtitle \{\s*font-size: 14px;\s*color: #64748b;\s*margin: 0 0 16px 0;\s*\}/g, `#app-root .mo-subtitle {
          font-size: 14px;
          color: #64748b !important;
          margin: 0 0 16px 0;
        }`);

// Fix .ec-title
html = html.replace(/\.ec-title \{\s*font-size: 15px;\s*font-weight: 600;\s*color: #0f172a;\s*margin: 0 0 4px 0;\s*\}/g, `#app-root .ec-title {
          font-size: 15px;
          font-weight: 600;
          color: #0f172a !important;
          margin: 0 0 4px 0;
        }`);

// Fix .ec-courses
html = html.replace(/\.ec-courses \{\s*font-size: 12px;\s*color: #64748b;\s*margin: 0 0 8px 0;\s*\}/g, `#app-root .ec-courses {
          font-size: 12px;
          color: #64748b !important;
          margin: 0 0 8px 0;
        }`);

// Fix inline styles in the ebook patches
html = html.replace(/color: #1e293b;/g, 'color: #1e293b !important;');
html = html.replace(/color: #94a3b8;/g, 'color: #94a3b8 !important;');
html = html.replace(/color: #f59e0b;/g, 'color: #f59e0b !important;');
html = html.replace(/color: #16a34a;/g, 'color: #16a34a !important;');

fs.writeFileSync(filePath, html, 'utf8');
console.log('Fixed inline !important issues for ebooks.');
