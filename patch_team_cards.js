const fs = require('fs');
let html = fs.readFileSync('frontend/web/index.html', 'utf8');

// Replace .team-card white background + light border with glassmorphic + golden border
html = html.replace(
  ".team-card {\r\n          background: #ffffff;\r\n          border: 1px solid #f1f5f9;\r\n          border-radius: 20px;\r\n          padding: 20px;\r\n          display: flex;\r\n          gap: 25px;\r\n          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);\r\n          position: relative;\r\n        }",
  ".team-card {\r\n          background: rgba(255, 255, 255, 0.08);\r\n          border: 1px solid rgba(244, 180, 0, 0.6);\r\n          border-radius: 20px;\r\n          padding: 20px;\r\n          display: flex;\r\n          gap: 25px;\r\n          box-shadow: 0 0 15px rgba(244, 180, 0, 0.2);\r\n          position: relative;\r\n          backdrop-filter: blur(12px);\r\n        }"
);

fs.writeFileSync('frontend/web/index.html', html, 'utf8');
console.log('Done: Team cards now have golden borders + glassmorphic background.');
