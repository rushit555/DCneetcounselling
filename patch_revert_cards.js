const fs = require('fs');
let html = fs.readFileSync('frontend/web/index.html', 'utf8');

// Medical: restore yellow
html = html.replace(
  "class=\"counselling-card fade-up scale-up\" style=\"\r\n                  background: rgba(255, 255, 255, 0.08);\r\n                  padding: 24px;\r\n                  border-radius: 16px;\r\n                  color: #fff;\r\n                  border: 1px solid rgba(244, 180, 0, 0.5);\r\n                  backdrop-filter: blur(12px);\r\n                  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);\r\n                  cursor: pointer;\r\n                \" onclick=\"window.navigate('medical-pricing')\"",
  "class=\"counselling-card fade-up scale-up\" style=\"\r\n                  background: linear-gradient(135deg, #fed700, #fed700);\r\n                  padding: 24px;\r\n                  border-radius: 16px;\r\n                  color: #000;\r\n                  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);\r\n                  cursor: pointer;\r\n                \" onclick=\"window.navigate('medical-pricing')\""
);

// AYUSH: restore green
html = html.replace(
  "class=\"counselling-card fade-up stagger-1 scale-up\" style=\"\r\n                  background: rgba(255, 255, 255, 0.08);\r\n                  padding: 24px;\r\n                  border-radius: 16px;\r\n                  color: #fff;\r\n                  border: 1px solid rgba(244, 180, 0, 0.5);\r\n                  backdrop-filter: blur(12px);\r\n                  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);\r\n                  cursor: pointer;\r\n                \" onclick=\"window.navigate('ayush-pricing')\"",
  "class=\"counselling-card fade-up stagger-1 scale-up\" style=\"\r\n                  background: linear-gradient(135deg, #a5d6a7, #66bb6a);\r\n                  padding: 24px;\r\n                  border-radius: 16px;\r\n                  color: #000;\r\n                  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);\r\n                  cursor: pointer;\r\n                \" onclick=\"window.navigate('ayush-pricing')\""
);

// Veterinary: restore blue
html = html.replace(
  "class=\"counselling-card fade-up stagger-2 scale-up\" style=\"\r\n                  background: rgba(255, 255, 255, 0.08);\r\n                  padding: 24px;\r\n                  border-radius: 16px;\r\n                  color: #fff;\r\n                  border: 1px solid rgba(244, 180, 0, 0.5);\r\n                  backdrop-filter: blur(12px);\r\n                  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);\r\n                  cursor: pointer;\r\n                  position: relative;\r\n                \" onclick=\"window.navigate('veterinary-pricing')\"",
  "class=\"counselling-card fade-up stagger-2 scale-up\" style=\"\r\n                  background: linear-gradient(135deg, #90caf9, #42a5f5);\r\n                  padding: 24px;\r\n                  border-radius: 16px;\r\n                  color: #000;\r\n                  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);\r\n                  cursor: pointer;\r\n                  position: relative;\r\n                \" onclick=\"window.navigate('veterinary-pricing')\""
);

// Combo: restore orange
html = html.replace(
  "class=\"counselling-card fade-up stagger-3 scale-up\" style=\"\r\n                  background: rgba(255, 255, 255, 0.08);\r\n                  padding: 24px;\r\n                  border-radius: 16px;\r\n                  color: #fff;\r\n                  border: 1px solid rgba(244, 180, 0, 0.5);\r\n                  backdrop-filter: blur(12px);\r\n                  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);\r\n                  cursor: pointer;\r\n                  position: relative;\r\n                \" onclick=\"window.navigate('combo-pricing')\"",
  "class=\"counselling-card fade-up stagger-3 scale-up\" style=\"\r\n                  background: linear-gradient(135deg, #ff8a65, #ff5722);\r\n                  padding: 24px;\r\n                  border-radius: 16px;\r\n                  color: #fff;\r\n                  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);\r\n                  cursor: pointer;\r\n                  position: relative;\r\n                \" onclick=\"window.navigate('combo-pricing')\""
);

fs.writeFileSync('frontend/web/index.html', html, 'utf8');
console.log('Done: Restored original bright card colors (yellow, green, blue, orange).');
