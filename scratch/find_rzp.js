const fs = require('fs');
const content = fs.readFileSync('c:\\\\Users\\\\rushi\\\\Downloads\\\\DCneetcounselling\\\\frontend\\\\web\\\\index.html', 'utf-8');
const lines = content.split('\\n');
lines.forEach((line, i) => {
    if (line.toLowerCase().includes('razorpay')) {
        console.log(`Line ${i+1}: ${line.trim()}`);
    }
});
