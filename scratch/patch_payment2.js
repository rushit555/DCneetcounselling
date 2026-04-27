const fs = require('fs');
const filePath = 'c:\\\\Users\\\\rushi\\\\Downloads\\\\DCneetcounselling\\\\backend\\\\src\\\\routes\\\\payment.js';
let lines = fs.readFileSync(filePath, 'utf-8').split('\\n');

let startIdx = lines.findIndex(l => l.includes('discounted_price: updatedOrder.final_amount,'));
let endIdx = lines.findIndex(l => l.includes('.digest("hex");'));

if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
    const replacement = `                    discounted_price: updatedOrder.final_amount,
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
            .digest("hex");`.split('\\n');
    
    lines.splice(startIdx, endIdx - startIdx + 1, ...replacement);
    fs.writeFileSync(filePath, lines.join('\\n'), 'utf-8');
    console.log("Successfully fixed payment.js array");
} else {
    console.log("Could not find start/end indices", startIdx, endIdx);
}
