const fs = require('fs');
const filePath = 'c:\\\\Users\\\\rushi\\\\Downloads\\\\DCneetcounselling\\\\backend\\\\src\\\\routes\\\\payment.js';

let content = fs.readFileSync(filePath, 'utf-8');

// I will target from `discounted_price: updatedOrder.final_amount,` all the way to `.digest("hex");`
const targetStr = `                    discounted_price: updatedOrder.final_amount,
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || '2MzRW1BAyaURYGWXiAmPhQqa')
            .update(body.toString())
            .digest("hex");`;

const replacementStr = `                    discounted_price: updatedOrder.final_amount,
                    discount_applied: updatedOrder.discount || 0,
                    payment_status: 'success'
                }]);
            }
        }

        res.json({ success: true, message: "Payment confirmed successfully" });
    } catch (error) {
        console.error("Payment Confirmation Error:", error);
        res.status(500).json({ success: false, error: "Payment confirmation failed" });
    }
});

// Payment Success API (with signature verification)
router.post('/payment-success', async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            email, fullName, mobile, ctx, userId
        } = req.body;

        console.log("Payment success request body:", req.body);

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || '2MzRW1BAyaURYGWXiAmPhQqa')
            .update(body.toString())
            .digest("hex");`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacementStr);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log("Successfully patched payment.js");
} else {
    console.log("Target string not found in payment.js! Let me try regex.");
    // fallback
    const regex = /discounted_price:\s*updatedOrder\.final_amount,\s*\.createHmac\("sha256",[^)]*\)\s*\.update\([^)]*\)\s*\.digest\("hex"\);/m;
    if (regex.test(content)) {
        content = content.replace(regex, replacementStr);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log("Successfully patched payment.js using regex");
    } else {
        console.log("Failed to find target with regex too.");
    }
}
