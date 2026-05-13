const fs = require('fs');

let html = fs.readFileSync('frontend/web/index.html', 'utf8');

// 1. Inject Referral Detection Script into <head>
const headEnd = '</head>';
const detectionScript = `
  <script>
    // Referral Detection Logic
    (function() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        let refToken = urlParams.get('ref');
        
        if (!refToken && window.location.hash.includes('?ref=')) {
          const hashSplit = window.location.hash.split('?ref=');
          if (hashSplit.length > 1) {
            refToken = hashSplit[1].split('&')[0];
          }
        }
        
        if (refToken) {
          localStorage.setItem('pending_referral', refToken);
          console.log('Referral token detected and saved:', refToken);
        }
      } catch(e) {
        console.error('Error processing referral token', e);
      }
    })();
    
    // Referral Link Generator Helper
    window.generateReferralLink = function(token) {
      if (!token) return "";
      return window.location.origin + "/#signup?ref=" + token;
    };
  </script>
`;

if (!html.includes('pending_referral')) {
  html = html.replace(headEnd, detectionScript + '\n' + headEnd);
}

// 2. Inject Signup Referral Logic after signUp
const signUpSuccessStr = 'if (res.error) throw res.error;';
const referralLogic = `
                    // REFERRAL SYSTEM CONNECTION
                    try {
                      if (res.data && res.data.user && res.data.user.id) {
                        const newUserId = res.data.user.id;
                        
                        // Wait a moment for auth trigger to create public.users row
                        await new Promise(r => setTimeout(r, 1000));
                        
                        // 1. Generate unique referral token (8-12 chars, lowercase)
                        const newToken = Math.random().toString(36).substring(2, 11).toLowerCase();
                        
                        // 2. Check for pending referral
                        const pendingReferralToken = localStorage.getItem('pending_referral');
                        let referrerId = null;
                        
                        if (pendingReferralToken) {
                          // Find matching user using referral_token
                          const { data: referrerData } = await client.from('users').select('id').eq('referral_token', pendingReferralToken).single();
                          
                          if (referrerData && referrerData.id && referrerData.id !== newUserId) {
                            referrerId = referrerData.id;
                          }
                        }
                        
                        // 3. Save to users table
                        const updatePayload = { referral_token: newToken };
                        if (referrerId) {
                          updatePayload.referred_by = referrerId;
                        }
                        
                        await client.from('users').update(updatePayload).eq('id', newUserId);
                        
                        // 4. Create referral record if referred
                        if (referrerId) {
                          // Fetch referrer details to store in referral record
                          const { data: rInfo } = await client.from('users').select('email, full_name, name').eq('id', referrerId).single();

                          await client.from('referrals').insert({
                            referrer_id: referrerId,
                            referred_user_id: newUserId,
                            referrer_email: rInfo?.email || null,
                            referrer_name: rInfo?.full_name || rInfo?.name || null,
                            referred_user_email: email,
                            referred_user_name: name || null,
                            referral_token: pendingReferralToken,
                            status: 'joined'
                          });
                          // Clear pending token
                          localStorage.removeItem('pending_referral');
                        }
                      }
                    } catch (refError) {
                      console.error("Error setting up referral:", refError);
                    }
`;

if (!html.includes('REFERRAL SYSTEM CONNECTION')) {
  html = html.replace(signUpSuccessStr, signUpSuccessStr + '\n' + referralLogic);
}

fs.writeFileSync('frontend/web/index.html', html, 'utf8');
console.log('Successfully injected referral logic into index.html');
