const fs = require('fs');

let indexHtml = fs.readFileSync('frontend/web/index.html', 'utf8');

// remove conflict markers
indexHtml = indexHtml.replace(/^<{7} HEAD\r?\n/gm, '');
indexHtml = indexHtml.replace(/^={7}\r?\n/gm, '');
indexHtml = indexHtml.replace(/^>{7} testing\r?\n/gm, '');

fs.writeFileSync('frontend/web/index.html', indexHtml);
console.log('Conflict markers removed from index.html');
