const fs = require('fs');
const path = 'c:\\\\Users\\\\rushi\\\\Downloads\\\\DCneetcounselling\\\\frontend\\\\web\\\\index.html';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `payment_status: 'initiated',
          created_at: new Date()`;

const replacementStr = `payment_status: 'initiated',
          created_at: new Date(),
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacementStr);
    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully added Indian timestamp!");
} else {
    console.log("Could not find the target string.");
}
