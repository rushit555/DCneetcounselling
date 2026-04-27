const fs = require('fs');
const path = 'c:\\\\Users\\\\rushi\\\\Downloads\\\\DCneetcounselling\\\\frontend\\\\web\\\\index.html';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/Starts from ₹199/g, 'Starts from ₹1');
content = content.replace(/Starts from ₹149/g, 'Starts from ₹1');

content = content.replace(/openEbookPurchaseModal\('Dental', 'All Courses', 149, 'Dental Cutoff eBooks'\)/g, "openEbookPurchaseModal('Dental', 'All Courses', 1, 'Dental Cutoff eBooks')");
content = content.replace(/openEbookPurchaseModal\('AYUSH', 'All Courses', 199, 'AYUSH Cutoff eBooks'\)/g, "openEbookPurchaseModal('AYUSH', 'All Courses', 1, 'AYUSH Cutoff eBooks')");
content = content.replace(/openEbookPurchaseModal\('Veterinary', 'All Courses', 199, 'Veterinary Cutoff eBooks'\)/g, "openEbookPurchaseModal('Veterinary', 'All Courses', 1, 'Veterinary Cutoff eBooks')");
content = content.replace(/openEbookPurchaseModal\('Medical', 'All India Quota', 199, 'Medical AIQ eBooks'\)/g, "openEbookPurchaseModal('Medical', 'All India Quota', 1, 'Medical AIQ eBooks')");
content = content.replace(/openEbookPurchaseModal\('Medical', 'State Quota', 199, 'Medical State Quota eBooks'\)/g, "openEbookPurchaseModal('Medical', 'State Quota', 1, 'Medical State Quota eBooks')");

content = content.replace(/price: 99/g, "price: 1");
content = content.replace(/price: 149/g, "price: 1");

fs.writeFileSync(path, content, 'utf8');
console.log("Prices updated to 1 rs in index.html");
