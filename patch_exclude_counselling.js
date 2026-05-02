const fs = require('fs');
let html = fs.readFileSync('frontend/web/index.html', 'utf8');

// Remove .counselling-card from the glassmorphic background rule
html = html.replace(
  '.ebook-card-v2, .counselling-card, .ps-json-card, .eb-json-feature-card, .rev-p-card, .card-date, .premium-news-btn {\r\n      background: rgba(255, 255, 255, 0.08) !important;\r\n      backdrop-filter: blur(12px) !important;\r\n      border: 1px solid rgba(255, 255, 255, 0.15) !important;\r\n    }',
  '.ebook-card-v2, .ps-json-card, .eb-json-feature-card, .rev-p-card, .card-date, .premium-news-btn {\r\n      background: rgba(255, 255, 255, 0.08) !important;\r\n      backdrop-filter: blur(12px) !important;\r\n      border: 1px solid rgba(255, 255, 255, 0.15) !important;\r\n    }'
);

// Remove .counselling-card from golden borders rule
html = html.replace(
  '.ebook-card-v2, .counselling-card, .ps-json-card, .eb-json-feature-card, .rev-p-card {\r\n      border: 1px solid rgba(244, 180, 0, 0.6) !important;\r\n      box-shadow: 0 0 15px rgba(244, 180, 0, 0.2) !important;\r\n    }',
  '.ebook-card-v2, .ps-json-card, .eb-json-feature-card, .rev-p-card {\r\n      border: 1px solid rgba(244, 180, 0, 0.6) !important;\r\n      box-shadow: 0 0 15px rgba(244, 180, 0, 0.2) !important;\r\n    }'
);

// Remove .counselling-card:hover from hover rule
html = html.replace(
  '.ebook-card-v2:hover, .counselling-card:hover, .ps-json-card:hover, .eb-json-feature-card:hover, .rev-p-card:hover {\r\n      border: 1px solid rgba(244, 180, 0, 1) !important;\r\n      box-shadow: 0 0 25px rgba(244, 180, 0, 0.4) !important;\r\n      background: rgba(255, 255, 255, 0.12) !important;\r\n    }',
  '.ebook-card-v2:hover, .ps-json-card:hover, .eb-json-feature-card:hover, .rev-p-card:hover {\r\n      border: 1px solid rgba(244, 180, 0, 1) !important;\r\n      box-shadow: 0 0 25px rgba(244, 180, 0, 0.4) !important;\r\n      background: rgba(255, 255, 255, 0.12) !important;\r\n    }'
);

fs.writeFileSync('frontend/web/index.html', html, 'utf8');
console.log('Done: Removed .counselling-card from global theme overrides.');
