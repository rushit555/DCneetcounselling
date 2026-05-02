const fs = require('fs');
let html = fs.readFileSync('frontend/web/index.html', 'utf8');

// 1. Fix "Back to eBooks" button text color → white
html = html.replace(
  'style="background: transparent; border: none; color: #64748b; font-size: 16px; cursor: pointer; font-family: inherit; font-weight: 600; display: inline-flex; align-items: center; gap: 8px;">\r\n            <i class="fas fa-arrow-left"></i> Back to eBooks',
  'style="background: transparent; border: none; color: #ffffff; font-size: 16px; cursor: pointer; font-family: inherit; font-weight: 600; display: inline-flex; align-items: center; gap: 8px;">\r\n            <i class="fas fa-arrow-left"></i> Back to eBooks'
);

// 2. Fix "Medical eBooks" heading → white
html = html.replace(
  'font-size: 32px; font-weight: 800; color: #1e293b !important; margin: 0 0 8px 0;">Medical eBooks',
  'font-size: 32px; font-weight: 800; color: #ffffff !important; margin: 0 0 8px 0;">Medical eBooks'
);

// 3. Fix "Select Quota Type" subtitle → soft white
html = html.replace(
  'font-size: 16px; color: #64748b; margin: 0; font-weight: 500;">Select Quota Type',
  'font-size: 16px; color: rgba(255,255,255,0.7); margin: 0; font-weight: 500;">Select Quota Type'
);

// 4. Fix .mo-card background: white → glassmorphic
html = html.replace(
  ".mo-card {\r\n          background: #ffffff;\r\n          border: 1px solid #e2e8f0;",
  ".mo-card {\r\n          background: rgba(255, 255, 255, 0.08);\r\n          border: 1px solid rgba(244, 180, 0, 0.5);"
);

// 5. Fix .mo-icon background
html = html.replace(
  ".mo-icon {\r\n          width: 60px;\r\n          height: 60px;\r\n          border-radius: 12px;\r\n          background: #f1f5f9;",
  ".mo-icon {\r\n          width: 60px;\r\n          height: 60px;\r\n          border-radius: 12px;\r\n          background: rgba(255, 255, 255, 0.1);"
);

// 6. Fix .mo-title color → white
html = html.replace(
  "color: #0f172a !important;\n",
  "color: #ffffff !important;\n"
);

fs.writeFileSync('frontend/web/index.html', html, 'utf8');
console.log('Done: Medical eBooks cards → glassmorphic, all text → white.');
