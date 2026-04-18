const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'header.html');
let content = fs.readFileSync(targetFile, 'utf8');

let imgCount = 0;
content = content.replace(/<img\b([^>]*)>/gi, (match, p1) => {
    if (p1.includes('loading=')) return match;
    imgCount++;
    return `<img loading="lazy" ${p1}>`;
});

fs.writeFileSync(targetFile, content);
console.log(`Optimized header.html: added lazy load to ${imgCount} images.`);
