const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/web/index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Force background transparent on .wcu2-stats, .wcu2-wrap, .wcu2-right, .wcu2-left in mobile
const fixCss = `
          @media (max-width: 900px) {
            .wcu2-wrap, .wcu2-left, .wcu2-right, .wcu2-stats, .wcu2-features, .wcu2-feat {
              background: transparent !important;
            }
            .wcu2-stats {
              background: transparent !important;
              background-color: transparent !important;
            }
            /* If the image has a white background, try to blend it, or hide if it's broken */
            .wcu2-dd-img {
              background: transparent !important;
            }
`;

// Insert the fix into the mobile media query
html = html.replace(/@media \(max-width: 900px\) \{/, fixCss);

// Let's also forcefully remove background: #F9F9F9 from .wcu2-stats
html = html.replace(/background:\s*#F9F9F9;/g, 'background: transparent !important;');
html = html.replace(/background:\s*#FAFAFA;/g, 'background: transparent !important;');

fs.writeFileSync(filePath, html, 'utf8');
console.log('Forced wcu2-stats and features to be transparent.');
