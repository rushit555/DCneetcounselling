const fs = require('fs');
let html = fs.readFileSync('frontend/web/index.html', 'utf8');

// Fix "Explore eBooks" heading color
html = html.replace(
  'color: #1e293b !important; margin: 0 0 6px 0;">Explore eBooks',
  'color: #ffffff !important; margin: 0 0 6px 0;">Explore eBooks'
);

// Fix subtitle color
html = html.replace(
  'color: #64748b; margin: 0; font-weight: 500;">Cutoff Data',
  'color: rgba(255,255,255,0.7) !important; margin: 0; font-weight: 500;">Cutoff Data'
);

fs.writeFileSync('frontend/web/index.html', html, 'utf8');
console.log('Done: Explore eBooks heading and subtitle are now white.');
