const fs = require('fs');
let html = fs.readFileSync('frontend/web/index.html', 'utf8');

// Change all "Back to Options" button text color from dark grey to white
html = html.replaceAll(
  'color: #4b5563; font-weight: 600">\r\n            &#x2190; Back to Options',
  'color: #ffffff; font-weight: 600">\r\n            &#x2190; Back to Options'
);

fs.writeFileSync('frontend/web/index.html', html, 'utf8');
console.log('Done: All "Back to Options" buttons changed to white text.');
