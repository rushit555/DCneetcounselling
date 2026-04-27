const fs = require('fs');
const filePath = 'c:\\\\Users\\\\rushi\\\\Downloads\\\\DCneetcounselling\\\\frontend\\\\web\\\\payment\\\\index.html';
let content = fs.readFileSync(filePath, 'utf-8');

const regex = /body:\s*JSON\.stringify\(\{\s*order_id:\s*order_id,\s*razorpay_payment_id:\s*response\.razorpay_payment_id\s*\}\)/;
const newStr = `body: JSON.stringify({ 
                                    order_id: order_id,
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                })`;

if (regex.test(content)) {
    content = content.replace(regex, newStr);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Successfully updated payment/index.html handler payload');
} else {
    console.log('Could not find the target block with regex in payment/index.html');
}
