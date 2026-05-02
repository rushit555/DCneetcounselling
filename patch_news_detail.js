const fs = require('fs');
const filePath = 'frontend/web/index.html';
let html = fs.readFileSync(filePath, 'utf8');

// Replace the old #nd-html content styles with dark-theme versions
const oldBlock = `      #nd-html p {\r\n        margin-bottom: 1em;\r\n      }\r\n\r\n      #nd-html a {\r\n        color: #facc15;\r\n        text-decoration: underline;\r\n      }\r\n\r\n      #nd-html ul {\r\n        list-style: none;\r\n        padding-left: 0;\r\n        margin-bottom: 1.5em;\r\n      }\r\n\r\n      #nd-html li {\r\n        margin-bottom: 0.5em;\r\n      }`;

const newBlock = `      #nd-html p,
      #nd-html span,
      #nd-html div,
      #nd-html li,
      #nd-html td,
      #nd-html th,
      #nd-html blockquote,
      #nd-html figcaption {
        color: rgba(255, 255, 255, 0.85) !important;
      }

      #nd-html p {
        margin-bottom: 1em;
      }

      #nd-html strong,
      #nd-html b {
        color: #ffffff !important;
      }

      #nd-html em,
      #nd-html i:not(.fa-solid):not(.fa-regular):not(.fa-brands) {
        color: rgba(255, 255, 255, 0.9) !important;
      }

      #nd-html a {
        color: #FFD700 !important;
        text-decoration: underline;
      }

      #nd-html ul,
      #nd-html ol {
        list-style: none;
        padding-left: 0;
        margin-bottom: 1.5em;
      }

      #nd-html li {
        margin-bottom: 0.5em;
        color: rgba(255, 255, 255, 0.85) !important;
      }

      #nd-html h4,
      #nd-html h5,
      #nd-html h6 {
        color: #ffffff !important;
      }

      #nd-html table {
        border-color: rgba(255, 255, 255, 0.2) !important;
      }

      #nd-html code,
      #nd-html pre {
        background: rgba(255, 255, 255, 0.08) !important;
        color: #FFD700 !important;
        border-radius: 6px;
        padding: 2px 6px;
      }`;

if (html.includes(oldBlock)) {
  html = html.replace(oldBlock, newBlock);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log('SUCCESS: Replaced nd-html styles with dark theme versions.');
} else {
  // Try without \r\n
  const oldBlock2 = oldBlock.replace(/\r\n/g, '\n');
  if (html.includes(oldBlock2)) {
    html = html.replace(oldBlock2, newBlock);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('SUCCESS (LF): Replaced nd-html styles with dark theme versions.');
  } else {
    console.log('ERROR: Could not find old block. Searching...');
    const idx = html.indexOf('#nd-html p {');
    console.log('Found #nd-html p at char index:', idx);
    if (idx > -1) {
      // Find from #nd-html p to the next </style>
      const endIdx = html.indexOf('</style>', idx);
      const oldSection = html.substring(idx, endIdx);
      console.log('Old section:\n', JSON.stringify(oldSection.substring(0, 300)));
    }
  }
}
