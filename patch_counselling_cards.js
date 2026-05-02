const fs = require('fs');
let html = fs.readFileSync('frontend/web/index.html', 'utf8');

// Medical card: yellow → dark glassmorphic
html = html.replace(
  'background: linear-gradient(135deg, #fed700, #fed700);\r\n                  padding: 24px;\r\n                  border-radius: 16px;\r\n                  color: #000;',
  'background: rgba(255, 255, 255, 0.08);\r\n                  padding: 24px;\r\n                  border-radius: 16px;\r\n                  color: #fff;\r\n                  border: 1px solid rgba(244, 180, 0, 0.5);\r\n                  backdrop-filter: blur(12px);'
);

// AYUSH card: green → dark glassmorphic
html = html.replace(
  'background: linear-gradient(135deg, #a5d6a7, #66bb6a);\r\n                  padding: 24px;\r\n                  border-radius: 16px;\r\n                  color: #000;',
  'background: rgba(255, 255, 255, 0.08);\r\n                  padding: 24px;\r\n                  border-radius: 16px;\r\n                  color: #fff;\r\n                  border: 1px solid rgba(244, 180, 0, 0.5);\r\n                  backdrop-filter: blur(12px);'
);

// Veterinary card: blue → dark glassmorphic
html = html.replace(
  'background: linear-gradient(135deg, #90caf9, #42a5f5);\r\n                  padding: 24px;\r\n                  border-radius: 16px;\r\n                  color: #000;',
  'background: rgba(255, 255, 255, 0.08);\r\n                  padding: 24px;\r\n                  border-radius: 16px;\r\n                  color: #fff;\r\n                  border: 1px solid rgba(244, 180, 0, 0.5);\r\n                  backdrop-filter: blur(12px);'
);

// Combo card: orange → dark glassmorphic
html = html.replace(
  'background: linear-gradient(135deg, #ff8a65, #ff5722);\r\n                  padding: 24px;\r\n                  border-radius: 16px;\r\n                  color: #fff;',
  'background: rgba(255, 255, 255, 0.08);\r\n                  padding: 24px;\r\n                  border-radius: 16px;\r\n                  color: #fff;\r\n                  border: 1px solid rgba(244, 180, 0, 0.5);\r\n                  backdrop-filter: blur(12px);'
);

fs.writeFileSync('frontend/web/index.html', html, 'utf8');
console.log('Done: All 4 counselling cards updated to dark glassmorphic theme.');
