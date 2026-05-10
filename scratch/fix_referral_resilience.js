const fs = require('fs');

let html = fs.readFileSync('frontend/web/index.html', 'utf8');

// Update the loadReferralPageData function to be more resilient
const oldQuery = ".select('referred_user_id, status, cashback_amount, created_at')";
const newQuery = ".select('referred_user_id, status, created_at')"; // Remove cashback_amount from initial select to be safe, or handle it dynamically

// Actually, let's just make the whole function more robust with try-catch blocks around specific queries
const oldFuncStart = '            // 5. Fetch referral history (people I referred)\n            var { data: referrals, error: refErr } = await client\n              .from(\'referrals\')\n              .select(\'referred_user_id, status, cashback_amount, created_at\')';

const newFuncStart = `            // 5. Fetch referral history (people I referred)
            var referrals = [];
            try {
              var { data, error: refErr } = await client
                .from('referrals')
                .select('*') // Use * to be safe against missing columns in JS
                .eq('referrer_id', userId)
                .order('created_at', { ascending: false });
              
              if (refErr) throw refErr;
              referrals = data || [];
            } catch (e) {
              console.warn('[Referral] History fetch failed, likely missing columns:', e);
            }`;

if (html.includes(oldFuncStart)) {
    html = html.replace(oldFuncStart, newFuncStart);
    console.log('✅ Updated referral history fetch to be more robust');
} else {
    // Try with CRLF
    const oldFuncStartCRLF = oldFuncStart.replace(/\n/g, '\r\n');
    if (html.includes(oldFuncStartCRLF)) {
        html = html.replace(oldFuncStartCRLF, newFuncStart);
        console.log('✅ Updated referral history fetch to be more robust (CRLF)');
    }
}

fs.writeFileSync('frontend/web/index.html', html, 'utf8');
console.log('Done!');
