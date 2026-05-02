const fs = require('fs');
let html = fs.readFileSync('frontend/web/index.html', 'utf8');

// Add golden border to .cp-left (dark info panel)
html = html.replace(
  ".cp-left {\r\n          background: #0f172a;\r\n          color: #ffffff;\r\n          padding: 50px;\r\n          flex: 1;\r\n          min-width: 350px;\r\n          position: relative;\r\n          border-radius: 24px;\r\n          margin: 10px;\r\n          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.2);\r\n          overflow: hidden;\r\n        }",
  ".cp-left {\r\n          background: #0f172a;\r\n          color: #ffffff;\r\n          padding: 50px;\r\n          flex: 1;\r\n          min-width: 350px;\r\n          position: relative;\r\n          border-radius: 24px;\r\n          margin: 10px;\r\n          box-shadow: 0 0 15px rgba(244, 180, 0, 0.2);\r\n          overflow: hidden;\r\n          border: 1px solid rgba(244, 180, 0, 0.6);\r\n        }"
);

// Add golden border to .cp-right (white form panel)
html = html.replace(
  ".cp-right {\r\n          flex: 1.5;\r\n          padding: 50px;\r\n          min-width: 350px;\r\n          display: flex;\r\n          flex-direction: column;\r\n          justify-content: center;\r\n        }",
  ".cp-right {\r\n          flex: 1.5;\r\n          padding: 50px;\r\n          min-width: 350px;\r\n          display: flex;\r\n          flex-direction: column;\r\n          justify-content: center;\r\n          border: 1px solid rgba(244, 180, 0, 0.6);\r\n          border-radius: 24px;\r\n          box-shadow: 0 0 15px rgba(244, 180, 0, 0.2);\r\n          margin: 10px;\r\n        }"
);

fs.writeFileSync('frontend/web/index.html', html, 'utf8');
console.log('Done: Added golden borders to both contact panels.');
