const fs = require('fs');
let html = fs.readFileSync('frontend/web/index.html', 'utf8');

// Medical card: black text → white
html = html.replace(
  "background: linear-gradient(135deg, #fed700, #fed700);\r\n                  padding: 24px;\r\n                  border-radius: 16px;\r\n                  color: #000;",
  "background: linear-gradient(135deg, #fed700, #fed700);\r\n                  padding: 24px;\r\n                  border-radius: 16px;\r\n                  color: #fff;"
);

// AYUSH card: black text → white
html = html.replace(
  "background: linear-gradient(135deg, #a5d6a7, #66bb6a);\r\n                  padding: 24px;\r\n                  border-radius: 16px;\r\n                  color: #000;",
  "background: linear-gradient(135deg, #a5d6a7, #66bb6a);\r\n                  padding: 24px;\r\n                  border-radius: 16px;\r\n                  color: #fff;"
);

// Veterinary card: black text → white
html = html.replace(
  "background: linear-gradient(135deg, #90caf9, #42a5f5);\r\n                  padding: 24px;\r\n                  border-radius: 16px;\r\n                  color: #000;",
  "background: linear-gradient(135deg, #90caf9, #42a5f5);\r\n                  padding: 24px;\r\n                  border-radius: 16px;\r\n                  color: #fff;"
);

fs.writeFileSync('frontend/web/index.html', html, 'utf8');
console.log('Done: All counselling card text changed to white.');
