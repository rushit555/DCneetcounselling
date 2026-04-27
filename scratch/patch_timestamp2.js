const fs = require('fs');
const path = 'c:\\\\Users\\\\rushi\\\\Downloads\\\\DCneetcounselling\\\\frontend\\\\web\\\\index.html';
let content = fs.readFileSync(path, 'utf8');

const regex = /payment_status:\s*'initiated',\s*created_at:\s*new Date\(\)/;
const replacement = `payment_status: 'initiated',
          created_at: new Date(),
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully added Indian timestamp!");
} else {
    console.log("Regex didn't match.");
}
