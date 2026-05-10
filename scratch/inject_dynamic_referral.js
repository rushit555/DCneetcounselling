const fs = require('fs');

// ==========================================================================
// PART 1: Add referral token generation to app_v2.js signup flow
// ==========================================================================
let app = fs.readFileSync('frontend/web/js/app_v2.js', 'utf8');

const appInsertAfter = `            if (res.error) { 
                showErr(res.error.message); 
            } else if (res.data && res.data.user && res.data.user.identities && res.data.user.identities.length === 0) {
                showErr('⚠️ An account with this email already exists. Please switch to Sign In instead.');
            } else { `;

const appReferralCode = `            if (res.error) { 
                showErr(res.error.message); 
            } else if (res.data && res.data.user && res.data.user.identities && res.data.user.identities.length === 0) {
                showErr('⚠️ An account with this email already exists. Please switch to Sign In instead.');
            } else { 
                // ── REFERRAL SYSTEM: Generate token & link referrer ──
                try {
                    if (res.data && res.data.user && res.data.user.id) {
                        await new Promise(function(r) { setTimeout(r, 1000); });
                        var newToken = Math.random().toString(36).substring(2, 11).toLowerCase();
                        var pendingRef = localStorage.getItem('pending_referral');
                        var refId = null;
                        if (pendingRef) {
                            var refRes = await window.supabaseClient.from('users').select('id').eq('referral_token', pendingRef).single();
                            if (refRes.data && refRes.data.id && refRes.data.id !== res.data.user.id) {
                                refId = refRes.data.id;
                            }
                        }
                        var payload = { referral_token: newToken };
                        if (refId) payload.referred_by = refId;
                        await window.supabaseClient.from('users').update(payload).eq('id', res.data.user.id);
                        if (refId) {
                            await window.supabaseClient.from('referrals').insert({
                                referrer_id: refId,
                                referred_user_id: res.data.user.id,
                                referral_token: pendingRef,
                                status: 'joined'
                            });
                            localStorage.removeItem('pending_referral');
                        }
                    }
                } catch(refErr) { console.error('Referral setup error:', refErr); }`;

if (!app.includes('REFERRAL SYSTEM')) {
    app = app.replace(appInsertAfter, appReferralCode);
    fs.writeFileSync('frontend/web/js/app_v2.js', app, 'utf8');
    console.log('✅ Added referral token generation to app_v2.js signup flow');
} else {
    console.log('⚠️ Referral code already exists in app_v2.js');
}

// ==========================================================================
// PART 2: Replace Refer & Earn section with dynamic version
// ==========================================================================
let html = fs.readFileSync('frontend/web/index.html', 'utf8');

// Replace the old static script with a dynamic one
const oldScript = `      <script>
        function copyReferralLink() {
          var copyText = document.getElementById("referral-link-input");
          var btn = document.getElementById("copy-referral-btn");
          copyText.select();
          copyText.setSelectionRange(0, 99999);
          navigator.clipboard.writeText(copyText.value);
          
          var originalHTML = btn.innerHTML;
          btn.innerHTML = '<i class="fa-solid fa-check" style="color: #86efac;"></i>';
          setTimeout(function() {
            btn.innerHTML = originalHTML;
          }, 2000);
        }
      </script>`;

const newScript = `      <script>
        function copyReferralLink() {
          var copyText = document.getElementById("referral-link-input");
          var btn = document.getElementById("copy-referral-btn");
          copyText.select();
          copyText.setSelectionRange(0, 99999);
          navigator.clipboard.writeText(copyText.value);
          
          var originalHTML = btn.innerHTML;
          btn.innerHTML = '<i class="fa-solid fa-check" style="color: #86efac;"></i>';
          setTimeout(function() {
            btn.innerHTML = originalHTML;
          }, 2000);
        }

        // ═══════════════════════════════════════════════════════════
        // DYNAMIC REFERRAL DATA LOADER
        // ═══════════════════════════════════════════════════════════
        async function loadReferralPageData() {
          if (!window.supabaseClient || !window._authUser) {
            console.log('[Referral] Waiting for auth...');
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
              .single();

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

            // 5. Fetch referral history (people I referred)
            var { data: referrals, error: refErr } = await client
              .from('referrals')
              .select('referred_user_id, status, cashback_amount, created_at')
              .eq('referrer_id', userId)
              .order('created_at', { ascending: false });

            if (refErr) throw refErr;

            var referralCount = referrals ? referrals.length : 0;
            var totalCashback = 0;

            // 6. Fetch referred user names
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
                  cashback: cashback,
                  date: ref.created_at
                });
              });
            }

            // 7. Update stats cards
            var statCards = document.querySelectorAll('#section-profile\\\\/refer-earn .stat-info p');
            if (statCards.length >= 3) {
              statCards[0].textContent = '₹' + walletBalance.toLocaleString('en-IN');
              statCards[1].textContent = referralCount.toString();
              statCards[2].textContent = '₹' + totalCashback.toLocaleString('en-IN');
            }

            // 8. Update referral history table
            var tbody = document.querySelector('#section-profile\\\\/refer-earn .history-table tbody');
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

            console.log('[Referral] Page data loaded — Token:', token, '| Referrals:', referralCount);

          } catch (err) {
            console.error('[Referral] Error loading data:', err);
          }
        }

        // Auto-load data when the section becomes visible
        var _referralObserver = new MutationObserver(function(mutations) {
          mutations.forEach(function(m) {
            if (m.type === 'attributes' && m.attributeName === 'style') {
              var el = document.getElementById('section-profile/refer-earn');
              if (el && el.style.display !== 'none') {
                loadReferralPageData();
              }
            }
          });
        });

        // Start observing once DOM is ready
        document.addEventListener('DOMContentLoaded', function() {
          var section = document.getElementById('section-profile/refer-earn');
          if (section) {
            _referralObserver.observe(section, { attributes: true, attributeFilter: ['style'] });
          }
        });
      </script>`;

if (html.includes(oldScript)) {
    html = html.replace(oldScript, newScript);
    fs.writeFileSync('frontend/web/index.html', html, 'utf8');
    console.log('✅ Replaced static Refer & Earn script with dynamic data-fetching version');
} else {
    console.log('❌ Could not find the old script block. Trying fallback...');
    // Fallback: find a partial match
    var partialOld = 'function copyReferralLink() {\n          var copyText = document.getElementById("referral-link-input");';
    if (html.includes(partialOld)) {
        console.log('Found partial match, need manual editing');
    } else {
        // Try with \r\n
        var crlfOld = oldScript.replace(/\n/g, '\r\n');
        if (html.includes(crlfOld)) {
            html = html.replace(crlfOld, newScript);
            fs.writeFileSync('frontend/web/index.html', html, 'utf8');
            console.log('✅ Replaced static script (CRLF) with dynamic data-fetching version');
        } else {
            console.log('❌ Could not find script block in any format');
        }
    }
}

console.log('\n🎉 Done! Both signup flows now generate referral tokens and the Refer & Earn page fetches real data.');
