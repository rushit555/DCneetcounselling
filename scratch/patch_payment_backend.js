const fs = require('fs');
const filePath = 'c:\\\\Users\\\\rushi\\\\Downloads\\\\DCneetcounselling\\\\backend\\\\src\\\\routes\\\\payment.js';
let content = fs.readFileSync(filePath, 'utf-8');

const regex = /const\s+\{\s*order_id,\s*razorpay_payment_id\s*\}\s*=\s*req\.body;\s*if\s*\(!order_id\)\s*return\s*res\.status\(400\)\.json\(\{\s*success:\s*false,\s*error:\s*"order_id is required"\s*\}\);/g;

const newStr = `const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        console.log("Confirm payment request:", req.body);
        if (!order_id) return res.status(400).json({ success: false, error: "order_id is required" });

        if (razorpay_order_id && razorpay_signature) {
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || '2MzRW1BAyaURYGWXiAmPhQqa')
                .update(body.toString())
                .digest("hex");
            
            if (expectedSignature !== razorpay_signature) {
                console.error("Signature mismatch. Expected:", expectedSignature, "Got:", razorpay_signature);
                return res.status(400).json({ success: false, error: "Payment verification failed" });
            }
        }`;

if (regex.test(content)) {
    content = content.replace(regex, newStr);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Successfully updated confirm-payment endpoint');
} else {
    console.log('Could not find the target block in confirm-payment endpoint');
}
