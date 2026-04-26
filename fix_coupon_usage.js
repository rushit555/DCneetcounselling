const fs = require('fs');

let content = fs.readFileSync('frontend/web/index.html', 'utf8');

// Use a more flexible approach - search and replace line by line
const lines = content.split('\n');
let modified = false;

for (let i = 0; i < lines.length; i++) {
    // Fix table name: coupon_usages -> coupon_usage
    if (lines[i].includes("from('coupon_usages')")) {
        lines[i] = lines[i].replace("from('coupon_usages')", "from('coupon_usage')");
        modified = true;
        console.log(`Line ${i+1}: Fixed table name coupon_usages -> coupon_usage`);
    }
    
    // Fix coupon_id -> coupon_code
    if (lines[i].includes('coupon_id: ctx.appliedCoupon.id,')) {
        lines[i] = lines[i].replace('coupon_id: ctx.appliedCoupon.id,', 'coupon_code: ctx.appliedCoupon.code,');
        modified = true;
        console.log(`Line ${i+1}: Fixed coupon_id -> coupon_code`);
    }
    
    // Fix amount_before -> original_price
    if (lines[i].includes('amount_before: ctx.originalPrice,')) {
        lines[i] = lines[i].replace('amount_before: ctx.originalPrice,', 'original_price: ctx.originalPrice,');
        modified = true;
        console.log(`Line ${i+1}: Fixed amount_before -> original_price`);
    }
    
    // Fix final_amount -> discounted_price
    if (lines[i].includes('final_amount: finalAmount,')) {
        lines[i] = lines[i].replace('final_amount: finalAmount,', 'discounted_price: finalAmount,');
        modified = true;
        console.log(`Line ${i+1}: Fixed final_amount -> discounted_price`);
    }
    
    // Remove commission line
    if (lines[i].includes('commission: commission')) {
        // Replace with the missing fields
        lines[i] = lines[i].replace(
            /\s*commission: commission/,
            '                              payment_status: \'success\''
        );
        modified = true;
        console.log(`Line ${i+1}: Replaced commission with payment_status`);
    }
    
    // Remove the "const commission" line
    if (lines[i].includes('const commission = finalAmount * 0.20;')) {
        lines[i] = '';
        modified = true;
        console.log(`Line ${i+1}: Removed commission calculation line`);
    }
    
    // Add user_mobile and other missing fields after user_email line
    if (lines[i].includes('user_email: email,') && i > 6940 && i < 6970) {
        const indent = '                              ';
        lines[i] = lines[i] + '\n' + indent + 'user_mobile: mobile,\n' + indent + "order_id: response.razorpay_payment_id || ('EBK_' + Date.now()),\n" + indent + "plan_name: ctx.course + ' (' + ctx.quota + ')',";
        modified = true;
        console.log(`Line ${i+1}: Added user_mobile, order_id, plan_name after user_email`);
    }
}

if (modified) {
    fs.writeFileSync('frontend/web/index.html', lines.join('\n'));
    console.log('\nSUCCESS: All coupon_usage fixes applied!');
} else {
    console.log('No changes needed - already fixed or pattern not found');
}
