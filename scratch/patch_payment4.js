const fs = require('fs');
const filePath = 'c:\\\\Users\\\\rushi\\\\Downloads\\\\DCneetcounselling\\\\backend\\\\src\\\\routes\\\\payment.js';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Update /confirm-payment
const confirmPaymentTarget = `        const { order_id, razorpay_payment_id } = req.body;
        if (!order_id) return res.status(400).json({ success: false, error: "order_id is required" });`;

const confirmPaymentReplacement = `        const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
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

content = content.replace(confirmPaymentTarget, confirmPaymentReplacement);

// 2. Append /payment-success before module.exports = router;
const appendTarget = `module.exports = router;`;

const appendReplacement = `// Payment Success API (with signature verification)
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
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // SUCCESS - Verify and save to database
            
            // Record Coupon Usage
            if (ctx && ctx.appliedCoupon) {
                const finalAmount = ctx.price;
                const commission = finalAmount * 0.20;
                await supabase.from('coupon_usage').insert({
                    coupon_code: ctx.appliedCoupon.coupon_code || ctx.appliedCoupon.id,
                    user_email: email,
                    original_price: ctx.originalPrice,
                    discount_applied: ctx.originalPrice - ctx.price,
                    discounted_price: finalAmount,
                    payment_status: 'success'
                });
            }

            // Clear Cart if applicable
            if (ctx && ctx.is_cart && userId) {
                await supabase.from('cart').delete().eq('user_id', userId);
            }

            // Save order to orders table securely
            if (userId && ctx) {
                await supabase.from('orders').insert({
                    user_id: userId,
                    full_name: fullName,
                    email: email,
                    mobile: mobile,
                    product_name: ctx.course + ' (' + ctx.quota + ')',
                    amount_paid: ctx.price,
                    payment_status: 'success',
                    razorpay_payment_id: razorpay_payment_id,
                    razorpay_order_id: razorpay_order_id,
                    created_at: new Date()
                });
            }

            // Update ebook_users record status
            if (ctx && email) {
                await supabase.from('ebook_users')
                    .update({
                        payment_status: 'success',
                        razorpay_payment_id: razorpay_payment_id,
                        razorpay_order_id: razorpay_order_id
                    })
                    .eq('email', email)
                    .eq('course', ctx.course)
                    .eq('payment_status', 'initiated');
            }

            return res.json({ success: true, message: "Payment verified successfully" });
        } else {
            console.error("Signature mismatch. Expected:", expectedSignature, "Got:", razorpay_signature);
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }
    } catch (error) {
        console.error("Payment Verification Error:", error);
        return res.status(500).json({ success: false, message: "Server error during verification" });
    }
});

module.exports = router;`;

content = content.replace(appendTarget, appendReplacement);

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Successfully rebuilt payment.js safely.");
