const fs = require('fs');
let html = fs.readFileSync('frontend/web/index.html', 'utf8');

// Fix the outer div background
html = html.replace(
  'id="section-counselling" class="page-section" style="background: #ffffff"',
  'id="section-counselling" class="page-section" style="background: transparent"'
);

// Fix the inner section background
html = html.replace(
  "padding: 120px 16px 80px;\r\n            background: #ffffff;\r\n            min-height: 80vh;",
  "padding: 120px 16px 80px;\r\n            background: transparent;\r\n            min-height: 80vh;"
);

// Fix heading color
html = html.replace(
  "margin-bottom: 10px;\r\n                color: #222;\r\n              \">\r\n            Book Your Counselling",
  "margin-bottom: 10px;\r\n                color: #ffffff;\r\n              \">\r\n            Book Your Counselling"
);

// Fix subtitle color
html = html.replace(
  "font-size: 15px;\r\n                color: #666;\r\n                margin-bottom: 40px;\r\n              \">\r\n            Choose the right path for your career",
  "font-size: 15px;\r\n                color: rgba(255,255,255,0.7);\r\n                margin-bottom: 40px;\r\n              \">\r\n            Choose the right path for your career"
);

fs.writeFileSync('frontend/web/index.html', html, 'utf8');
console.log('Done: Counselling section background → transparent, heading → white, subtitle → soft white.');
