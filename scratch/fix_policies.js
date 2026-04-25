const fs = require('fs');
const path = 'c:/Users/rushi/Downloads/DCneetcounselling/frontend/web/index.html';
let content = fs.readFileSync(path, 'utf8');

console.log('Original content length:', content.length);

// 1. Update eBook prices
// Handle the "Starts from ₹1" labels
content = content.replace(/Starts from ₹1/g, (match, offset) => {
    const context = content.substring(offset - 300, offset);
    if (context.toLowerCase().includes('dental') || context.toLowerCase().includes('bds')) {
        return 'Starts from ₹149';
    }
    return 'Starts from ₹199';
});

// Update modal calls with price 1 to 199 (default)
content = content.replace(/openEbookPurchaseModal\(([^,]+), ([^,]+), 1, /g, 'openEbookPurchaseModal($1, $2, 199, ');

// Specific Dental modal call fix
content = content.replace(/openEbookPurchaseModal\('Dental', 'All Courses', 199, /g, "openEbookPurchaseModal('Dental', 'All Courses', 149, ");

// Medical specific AIQ and State
content = content.replace(/openEbookPurchaseModal\('Medical', 'All India Quota', 149, /g, "openEbookPurchaseModal('Medical', 'All India Quota', 199, ");
content = content.replace(/openEbookPurchaseModal\('Medical', 'State Quota', 99, /g, "openEbookPurchaseModal('Medical', 'State Quota', 199, ");

// 2. Fix corrupted Privacy Policy line
content = content.replace(/Your data is .*? \(secure\) and not sold to third parties/g, 'Your data is 100% secure and not sold to third parties');

// 3. Fix corrupted Refund Policy lines
// Fix the "5-7" dash issue
content = content.replace(/Refund processed within 5.*?7 working days/g, 'Refund processed within 5-7 working days');

// Fix the contact detail emojis
content = content.replace(/<p style="color: #444; margin: 4px 0;">.*? Phone\/WhatsApp: <strong>8000258339<\/strong><\/p>/g, '              <p style="color: #444; margin: 4px 0;">📞 Phone/WhatsApp: <strong>8000258339</strong></p>');
content = content.replace(/<p style="color: #444; margin: 4px 0;">.*? Website: <strong>dcneetcounselling.com<\/strong><\/p>/g, '              <p style="color: #444; margin: 4px 0;">🌐 Website: <strong>dcneetcounselling.com</strong></p>');
content = content.replace(/<p style="color: #444; margin: 4px 0;">.*? Email: <strong>support@dcneetcounselling.com<\/strong><\/p>/g, '              <p style="color: #444; margin: 4px 0;">📧 Email: <strong>support@dcneetcounselling.com</strong></p>');

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated prices and fixed corrupted policy text.');
