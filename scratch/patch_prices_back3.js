const fs = require('fs');
const path = 'c:\\\\Users\\\\rushi\\\\Downloads\\\\DCneetcounselling\\\\frontend\\\\web\\\\index.html';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/openEbookPurchaseModal\('Medical', 'All India Quota', 1, 'Medical AIQ eBooks'\)/g, "openEbookPurchaseModal('Medical', 'All India Quota', 199, 'Medical AIQ eBooks')");
content = content.replace(/openEbookPurchaseModal\('Medical', 'State Quota', 1, 'Medical State Quota eBooks'\)/g, "openEbookPurchaseModal('Medical', 'State Quota', 99, 'Medical State Quota eBooks')");

fs.writeFileSync(path, content, 'utf8');
console.log("Prices successfully updated for AIQ and State!");
