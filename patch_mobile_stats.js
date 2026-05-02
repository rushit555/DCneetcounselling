const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/web/index.html');
let html = fs.readFileSync(filePath, 'utf8');

// The CSS to replace:
// .wcu2-stats { flex-wrap: wrap; border-radius: 24px; padding: 20px; gap: 14px; }
// .wcu2-stat { flex: 1 1 40%; justify-content: flex-start; }

const cssRegex = /\.wcu2-stats\s*\{\s*flex-wrap:\s*wrap;\s*border-radius:\s*24px;\s*padding:\s*20px;\s*gap:\s*14px;\s*\}\s*\.wcu2-stat\s*\{\s*flex:\s*1 1 40%;\s*justify-content:\s*flex-start;\s*\}/g;

const newCss = `.wcu2-stats {
              display: grid;
              grid-template-columns: 1fr 1fr;
              border-radius: 24px;
              padding: 20px;
              gap: 14px;
            }

            .wcu2-stat {
              width: 100%;
              min-height: 90px;
              box-sizing: border-box;
              justify-content: flex-start;
              align-items: center;
              padding: 16px;
            }`;

html = html.replace(cssRegex, newCss);

fs.writeFileSync(filePath, html, 'utf8');
console.log('Mobile stats CSS updated via script.');
