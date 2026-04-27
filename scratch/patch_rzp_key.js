const fs = require('fs');
const filePath = 'c:\\\\Users\\\\rushi\\\\Downloads\\\\DCneetcounselling\\\\frontend\\\\web\\\\index.html';
let content = fs.readFileSync(filePath, 'utf-8');

const oldKey = '"key": "rzp_live_SebrDtxMirg67M"';
const newKey = '"key": "rzp_live_ShlgHvLVwqmST2"';

if (content.includes(oldKey)) {
    content = content.replace(oldKey, newKey);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Successfully updated Razorpay key in index.html');
} else {
    console.log('Could not find the old key in index.html');
}
