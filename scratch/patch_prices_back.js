const fs = require('fs');
const path = 'c:\\\\Users\\\\rushi\\\\Downloads\\\\DCneetcounselling\\\\frontend\\\\web\\\\index.html';
let content = fs.readFileSync(path, 'utf8');
const lines = content.split('\\n');

// 1. Update the "Starts from" labels
lines[5482] = lines[5482].replace('Starts from ₹1', 'Starts from ₹99'); // Medical
lines[5499] = lines[5499].replace('Starts from ₹1', 'Starts from ₹149'); // Dental
lines[5516] = lines[5516].replace('Starts from ₹1', 'Starts from ₹199'); // AYUSH
lines[5533] = lines[5533].replace('Starts from ₹1', 'Starts from ₹149'); // Veterinary

lines[5663] = lines[5663].replace('Starts from ₹1', 'Starts from ₹199'); // Medical AIQ
lines[5681] = lines[5681].replace('Starts from ₹1', 'Starts from ₹99'); // Medical State

// 2. Update the modal calls
for(let i=0; i<lines.length; i++) {
    lines[i] = lines[i].replace(/openEbookPurchaseModal\('Dental', 'All Courses', 1, 'Dental Cutoff eBooks'\)/g, "openEbookPurchaseModal('Dental', 'All Courses', 149, 'Dental Cutoff eBooks')");
    lines[i] = lines[i].replace(/openEbookPurchaseModal\('AYUSH', 'All Courses', 1, 'AYUSH Cutoff eBooks'\)/g, "openEbookPurchaseModal('AYUSH', 'All Courses', 199, 'AYUSH Cutoff eBooks')");
    lines[i] = lines[i].replace(/openEbookPurchaseModal\('Veterinary', 'All Courses', 1, 'Veterinary Cutoff eBooks'\)/g, "openEbookPurchaseModal('Veterinary', 'All Courses', 149, 'Veterinary Cutoff eBooks')");
    
    lines[i] = lines[i].replace(/openEbookPurchaseModal\('Medical', 'All India Quota', 1, 'Medical AIQ eBooks'\)/g, "openEbookPurchaseModal('Medical', 'All India Quota', 199, 'Medical AIQ eBooks')");
    lines[i] = lines[i].replace(/openEbookPurchaseModal\('Medical', 'State Quota', 1, 'Medical State Quota eBooks'\)/g, "openEbookPurchaseModal('Medical', 'State Quota', 99, 'Medical State Quota eBooks')");
}

// 3. Update EBOOK_META
for(let i=0; i<lines.length; i++) {
    if(lines[i].includes("'medical': {") && lines[i].includes("price: 1")) {
        lines[i] = lines[i].replace("price: 1", "price: 99");
    }
    if(lines[i].includes("'dental': {") && lines[i].includes("price: 1")) {
        lines[i] = lines[i].replace("price: 1", "price: 149");
    }
    if(lines[i].includes("'ayush': {") && lines[i].includes("price: 1")) {
        lines[i] = lines[i].replace("price: 1", "price: 199");
    }
    if(lines[i].includes("'veterinary': {") && lines[i].includes("price: 1")) {
        lines[i] = lines[i].replace("price: 1", "price: 149");
    }
}

fs.writeFileSync(path, lines.join('\\n'), 'utf8');
console.log("Prices successfully updated!");
