const fs = require('fs');

let html = fs.readFileSync('frontend/web/index.html', 'utf8');

// 1. Add IDs to the stat values in the HTML and clear hardcoded data
html = html.replace('<h3>Wallet Balance</h3>\n                <p>₹450</p>', '<h3>Wallet Balance</h3>\n                <p id="wallet-balance-val">₹0</p>');
html = html.replace('<h3>Successful Referrals</h3>\n                <p>12</p>', '<h3>Successful Referrals</h3>\n                <p id="referral-count-val">0</p>');
html = html.replace('<h3>Cashback Earned</h3>\n                <p>₹2,450</p>', '<h3>Cashback Earned</h3>\n                <p id="cashback-earned-val">₹0</p>');

// Also update CRLF versions just in case
html = html.replace('<h3>Wallet Balance</h3>\r\n                <p>₹450</p>', '<h3>Wallet Balance</h3>\r\n                <p id="wallet-balance-val">₹0</p>');
html = html.replace('<h3>Successful Referrals</h3>\r\n                <p>12</p>', '<h3>Successful Referrals</h3>\r\n                <p id="referral-count-val">0</p>');
html = html.replace('<h3>Cashback Earned</h3>\r\n                <p>₹2,450</p>', '<h3>Cashback Earned</h3>\r\n                <p id="cashback-earned-val">₹0</p>');

// 2. Add ID to the history table body
html = html.replace('<tbody>\n                  <tr>\n                    <td>\n                      <div class="student-cell">', '<tbody id="referral-history-body">\n                  <tr>\n                    <td>\n                      <div class="student-cell">');
html = html.replace('<tbody>\r\n                  <tr>\r\n                    <td>\r\n                      <div class="student-cell">', '<tbody id="referral-history-body">\r\n                  <tr>\r\n                    <td>\r\n                      <div class="student-cell">');

// 3. Update loadReferralPageData to use these new IDs and be even more robust
const oldLoaderStart = '        async function loadReferralPageData() {';
const newLoader = `        window.loadReferralPageData = async function() {
          if (!window.supabaseClient || !window._authUser) {
            // If not logged in, show zeros and return
            if (document.getElementById('wallet-balance-val')) document.getElementById('wallet-balance-val').textContent = '₹0';
            if (document.getElementById('referral-count-val')) document.getElementById('referral-count-val').textContent = '0';
            if (document.getElementById('cashback-earned-val')) document.getElementById('cashback-earned-val').textContent = '₹0';
            return;
          }

          var userId = window._authUser.id;
          var client = window.supabaseClient;

          try {
            // 1. Fetch user's referral token & wallet balance
            var { data: userData, error: userErr } = await client
              .from('users')
              .select('referral_token, wallet_balance')
              .eq('id', userId)
              .maybeSingle();

            if (userErr) throw userErr;

            var token = userData ? userData.referral_token : null;
            var walletBalance = userData ? (userData.wallet_balance || 0) : 0;

            // If no token yet, generate one now
            if (!token) {
              token = Math.random().toString(36).substring(2, 11).toLowerCase();
              await client.from('users').update({ referral_token: token }).eq('id', userId);
            }

            // 2. Build the referral link
            var baseUrl = window.location.origin;
            var referralLink = baseUrl + '/?ref=' + token;

            // 3. Update link input
            var linkInput = document.getElementById('referral-link-input');
            if (linkInput) linkInput.value = referralLink;

            // 4. Update share buttons with real link
            var encodedLink = encodeURIComponent(referralLink);
            var shareMsg = encodeURIComponent('🎓 Get 10% OFF on NEET counselling plans using my referral link:\\n' + referralLink);
            
            var waBtn = document.querySelector('.share-btn.btn-whatsapp');
            if (waBtn) waBtn.href = 'https://wa.me/?text=' + shareMsg;
            
            var tgBtn = document.querySelector('.share-btn.btn-telegram');
            if (tgBtn) tgBtn.href = 'https://t.me/share/url?url=' + encodedLink + '&text=' + encodeURIComponent('🎓 Get 10% OFF on NEET counselling plans using my referral link!');

            // 5. Update stats cards using IDs (Much more reliable)
            if (document.getElementById('wallet-balance-val')) document.getElementById('wallet-balance-val').textContent = '₹' + walletBalance.toLocaleString('en-IN');

            // 6. Fetch referral history (people I referred)
            var { data: referrals, error: refErr } = await client
              .from('referrals')
              .select('*')
              .eq('referrer_id', userId)
              .order('created_at', { ascending: false });

            if (refErr) throw refErr;

            var referralCount = referrals ? referrals.length : 0;
            var totalCashback = 0;

            if (document.getElementById('referral-count-val')) document.getElementById('referral-count-val').textContent = referralCount.toString();

            // 7. Fetch referred user names
            var historyRows = [];
            if (referrals && referrals.length > 0) {
              var userIds = referrals.map(function(r) { return r.referred_user_id; });
              var { data: refUsers } = await client
                .from('users')
                .select('id, name, full_name, email')
                .in('id', userIds);

              var userMap = {};
              if (refUsers) {
                refUsers.forEach(function(u) {
                  userMap[u.id] = u.full_name || u.name || (u.email ? u.email.split('@')[0] : 'User');
                });
              }

              referrals.forEach(function(ref) {
                var displayName = userMap[ref.referred_user_id] || 'User';
                var cashback = ref.cashback_amount || 0;
                totalCashback += cashback;
                historyRows.push({
                  name: displayName,
                  status: ref.status,
                  cashback: cashback
                });
              });
            }

            if (document.getElementById('cashback-earned-val')) document.getElementById('cashback-earned-val').textContent = '₹' + totalCashback.toLocaleString('en-IN');

            // 8. Update referral history table
            var tbody = document.getElementById('referral-history-body');
            if (tbody) {
              if (historyRows.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:30px; color:rgba(255,255,255,0.5); font-style:italic;">No referrals yet. Share your link to get started! 🚀</td></tr>';
              } else {
                var rowsHtml = '';
                historyRows.forEach(function(row) {
                  var initial = row.name.charAt(0).toUpperCase();
                  var statusClass = row.status === 'purchased' ? 'status-success' : 'status-pending';
                  var statusText = row.status === 'purchased' ? 'Purchased' : (row.status === 'joined' ? 'Joined' : row.status);
                  var cashText = row.cashback > 0 ? '+₹' + row.cashback : 'Pending';
                  var cashClass = row.cashback > 0 ? '' : ' pending';

                  rowsHtml += '<tr>' +
                    '<td><div class="student-cell"><div class="student-avatar">' + initial + '</div><div class="student-name">' + row.name + '</div></div></td>' +
                    '<td><span class="status-badge ' + statusClass + '">' + statusText + '</span></td>' +
                    '<td class="amount-cell' + cashClass + '">' + cashText + '</td>' +
                  '</tr>';
                });
                tbody.innerHTML = rowsHtml;
              }
            }
          } catch (err) {
            console.error('[Referral] Error loading data:', err);
          }
        };`;

// Replace the old function definition (we'll replace everything from "async function loadReferralPageData() {" to the end of that block)
// This is tricky with regex, so we'll just replace the start and the specific logic parts.
// Actually, since I have the whole block, I'll just replace from the function start until the observer starts.

const observerStart = '        // Auto-load data when the section becomes visible';
const partToReplace = html.substring(html.indexOf(oldLoaderStart), html.indexOf(observerStart));

if (html.includes(oldLoaderStart) && html.includes(observerStart)) {
    html = html.replace(partToReplace, newLoader + '\n\n        ');
    console.log('✅ Updated loadReferralPageData to use specific IDs and improved logic');
} else {
    // Try with CRLF
    const partToReplaceCRLF = html.substring(html.indexOf(oldLoaderStart), html.indexOf(observerStart.replace(/\n/g, '\r\n')));
    if (html.includes(oldLoaderStart)) {
        html = html.replace(partToReplaceCRLF, newLoader + '\n\n        ');
        console.log('✅ Updated loadReferralPageData to use specific IDs (CRLF)');
    }
}

fs.writeFileSync('frontend/web/index.html', html, 'utf8');
console.log('Done!');
