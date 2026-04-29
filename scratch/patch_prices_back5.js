const fs = require('fs');
const path = 'c:\\\\Users\\\\rushi\\\\Downloads\\\\DCneetcounselling\\\\frontend\\\\web\\\\index.html';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/<div class="mo-price">\s*<i class="fas fa-tag"><\/i> Starts from ₹1\s*<\/div>\s*<button class="mo-btn" style="background: #2563eb;"/g, '<div class="mo-price">\\n                <i class="fas fa-tag"></i> Starts from ₹199\\n              </div>\\n              <button class="mo-btn" style="background: #2563eb;"');

content = content.replace(/<div class="mo-price">\s*<i class="fas fa-tag"><\/i> Starts from ₹1\s*<\/div>\s*<button class="mo-btn" style="background: #16a34a;"/g, '<div class="mo-price">\\n                <i class="fas fa-tag"></i> Starts from ₹99\\n              </div>\\n              <button class="mo-btn" style="background: #16a34a;"');

fs.writeFileSync(path, content, 'utf8');
console.log("Replaced final labels.");
