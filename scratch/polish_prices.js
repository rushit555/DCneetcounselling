const fs = require('fs');
const path = 'c:/Users/rushi/Downloads/DCneetcounselling/frontend/web/index.html';
let content = fs.readFileSync(path, 'utf8');

// Specific fix for Medical label that got 149 mistakenly
content = content.replace(/Medical<\/h3>\s*<p class="ec-courses">MBBS, BDS<\/p>\s*<div class="ec-price">\s*<i class="fas fa-tag"><\/i> Starts from ₹149/g, 
    'Medical</h3>\n              <p class="ec-courses">MBBS, BDS</p>\n              <div class="ec-price">\n                <i class="fas fa-tag"></i> Starts from ₹199');

// Specific fix for Medical AIQ and State labels if they were wrong
// (Already handled by global replace but just in case)

fs.writeFileSync(path, content, 'utf8');
console.log('Final polish on Medical prices.');
