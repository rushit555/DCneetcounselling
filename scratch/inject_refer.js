const fs = require('fs');

const htmlToInject = `    </div>
    <!-- Refer & Earn Section -->
    <div id="section-profile/refer-earn" class="page-section" style="display: none;">
      <style>
        .refer-earn-container { font-family: 'Poppins', sans-serif; background: #f8fafc; min-height: 100vh; padding-bottom: 80px; }
        .refer-earn-content { max-width: 1024px; margin: 0 auto; padding: 40px 20px; }
        .refer-header { margin-bottom: 30px; text-align: center; }
        .refer-header h1 { font-size: 32px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
        .refer-header p { color: #64748b; font-size: 16px; }
        
        .hero-card { position: relative; border-radius: 24px; background: linear-gradient(135deg, #4f46e5 0%, #9333ea 50%, #db2777 100%); padding: 3px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); margin-bottom: 30px; }
        .hero-card-inner { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); border-radius: 21px; padding: 40px; color: white; display: flex; flex-direction: column; gap: 20px; position: relative; z-index: 10; }
        @media (min-width: 768px) { .hero-card-inner { flex-direction: row; align-items: center; justify-content: space-between; } }
        
        .hero-text { flex: 1; }
        .hero-text h2 { font-size: 36px; font-weight: 800; line-height: 1.2; margin-bottom: 16px; }
        .hero-text p { font-size: 18px; color: #e2e8f0; margin-bottom: 24px; line-height: 1.5; }
        .highlight-badge { background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 6px; font-weight: 700; color: white; }
        
        .link-box { display: flex; gap: 10px; margin-bottom: 24px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; padding: 6px; }
        .link-input { flex: 1; background: transparent; border: none; color: white; padding: 10px 15px; font-size: 16px; outline: none; }
        .link-input::placeholder { color: rgba(255,255,255,0.5); }
        .copy-btn { background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; width: 44px; height: 44px; cursor: pointer; transition: 0.2s; display: flex; justify-content: center; align-items: center; }
        .copy-btn:hover { background: rgba(255,255,255,0.3); }
        
        .share-buttons { display: flex; gap: 12px; flex-wrap: wrap; }
        .share-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 12px; font-weight: 600; font-size: 16px; text-decoration: none; color: white; transition: transform 0.2s; box-shadow: 0 4px 14px rgba(0,0,0,0.15); }
        .share-btn:hover { transform: translateY(-2px); }
        .btn-whatsapp { background: #25D366; }
        .btn-telegram { background: #0088cc; }
        
        .hero-graphic { display: none; }
        @media (min-width: 768px) { .hero-graphic { display: flex; justify-content: center; align-items: center; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; font-size: 80px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); animation: float 6s ease-in-out infinite; } }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
        
        .stats-grid { display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 40px; }
        @media (min-width: 768px) { .stats-grid { grid-template-columns: repeat(3, 1fr); } }
        .stat-card { background: white; border-radius: 20px; padding: 24px; display: flex; align-items: center; gap: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; transition: transform 0.2s; }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
        .stat-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; justify-content: center; align-items: center; font-size: 24px; }
        .stat-info h3 { font-size: 14px; color: #64748b; font-weight: 500; margin-bottom: 4px; }
        .stat-info p { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0; }
        
        .section-box { background: white; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; margin-bottom: 40px; }
        .section-title { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
        .section-title i { background: #f1f5f9; width: 40px; height: 40px; border-radius: 12px; display: flex; justify-content: center; align-items: center; color: #475569; font-size: 18px; }
        
        .steps-grid { display: grid; grid-template-columns: 1fr; gap: 30px; position: relative; }
        @media (min-width: 768px) { .steps-grid { grid-template-columns: repeat(4, 1fr); } .steps-grid::before { content: ''; position: absolute; top: 32px; left: 10%; right: 10%; height: 2px; background: linear-gradient(90deg, #e2e8f0, #cbd5e1, #e2e8f0); z-index: 1; } }
        .step-item { display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; z-index: 2; }
        .step-icon { width: 64px; height: 64px; background: white; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; display: flex; justify-content: center; align-items: center; font-size: 24px; color: #4f46e5; margin-bottom: 16px; position: relative; transition: transform 0.3s; }
        .step-item:hover .step-icon { transform: scale(1.1); }
        .step-number { position: absolute; top: -8px; right: -8px; width: 24px; height: 24px; background: #4f46e5; color: white; border-radius: 50%; font-size: 12px; font-weight: 700; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 10px rgba(79,70,229,0.3); }
        .step-item h4 { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
        .step-item p { font-size: 14px; color: #64748b; }
        
        .history-table { width: 100%; border-collapse: collapse; }
        .history-table th { text-align: left; padding: 16px; font-size: 14px; font-weight: 600; color: #64748b; border-bottom: 1px solid #f1f5f9; }
        .history-table th:last-child { text-align: right; }
        .history-table td { padding: 20px 16px; border-bottom: 1px solid #f8fafc; transition: background 0.2s; }
        .history-table tr:hover td { background: #f8fafc; }
        .history-table tr:last-child td { border-bottom: none; }
        .student-cell { display: flex; align-items: center; gap: 12px; }
        .student-avatar { width: 40px; height: 40px; border-radius: 50%; background: #f1f5f9; color: #475569; font-weight: 700; display: flex; justify-content: center; align-items: center; }
        .student-name { font-weight: 600; color: #0f172a; }
        .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
        .status-success { background: #dcfce7; color: #16a34a; }
        .status-success::before { content: ''; width: 6px; height: 6px; background: #22c55e; border-radius: 50%; }
        .status-pending { background: #fef3c7; color: #d97706; }
        .status-pending::before { content: ''; width: 6px; height: 6px; background: #f59e0b; border-radius: 50%; }
        .amount-cell { text-align: right; font-weight: 700; color: #4f46e5; }
        .amount-cell.pending { color: #94a3b8; }
        
        .cta-card { background: linear-gradient(135deg, #1e1b4b, #312e81); border-radius: 24px; padding: 40px; text-align: center; color: white; position: relative; overflow: hidden; box-shadow: 0 20px 40px rgba(49,46,129,0.2); }
        .cta-card::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 60%); animation: spin 15s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .cta-content { position: relative; z-index: 10; max-width: 600px; margin: 0 auto; }
        .cta-icon { width: 64px; height: 64px; background: rgba(255,255,255,0.1); border-radius: 20px; display: inline-flex; justify-content: center; align-items: center; font-size: 32px; margin-bottom: 24px; backdrop-filter: blur(10px); }
        .cta-content h3 { font-size: 28px; font-weight: 800; margin-bottom: 16px; line-height: 1.3; }
        .cta-content p { font-size: 16px; color: #c7d2fe; margin-bottom: 32px; }
        .cta-btn { background: white; color: #312e81; font-weight: 700; font-size: 16px; padding: 16px 32px; border-radius: 30px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; border: none; cursor: pointer; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
        
        .mobile-sticky-share { display: none; }
        @media (max-width: 767px) {
          .mobile-sticky-share { display: block; position: fixed; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); padding: 16px; border-top: 1px solid #e2e8f0; z-index: 100; box-shadow: 0 -4px 20px rgba(0,0,0,0.05); }
          .mobile-sticky-share .share-btn { width: 100%; justify-content: center; }
          .history-table th:nth-child(2), .history-table td:nth-child(2) { display: none; }
        }
      </style>
      
      <div class="refer-earn-container">
        <div class="refer-earn-content">
          <div class="refer-header">
            <h1>Refer & Earn</h1>
            <p>Share the benefits with friends and earn rewards.</p>
          </div>
          
          <!-- Hero Card -->
          <div class="hero-card">
            <div class="hero-card-inner">
              <div class="hero-text">
                <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.3);">
                  <i class="fa-solid fa-star" style="color: #fde047;"></i> Premium Rewards
                </div>
                <h2>Invite Friends & <br/>Earn Rewards</h2>
                <p>Your friend gets <span class="highlight-badge">10% OFF</span> and you earn <span class="highlight-badge">10% cashback</span> in your wallet after their successful purchase.</p>
                
                <div class="link-box">
                  <input type="text" id="referral-link-input" class="link-input" value="https://yourdomain.com/signup?ref=demo123" readonly>
                  <button class="copy-btn" id="copy-referral-btn" onclick="copyReferralLink()">
                    <i class="fa-regular fa-copy"></i>
                  </button>
                </div>
                
                <div class="share-buttons">
                  <a href="https://wa.me/?text=%F0%9F%8E%93%20Get%2010%25%20OFF%20on%20NEET%20counselling%20plans%20using%20my%20referral%20link%3A%0Ahttps%3A%2F%2Fyourdomain.com%2Fsignup%3Fref%3Ddemo123" target="_blank" class="share-btn btn-whatsapp">
                    <i class="fa-brands fa-whatsapp"></i> WhatsApp
                  </a>
                  <a href="https://t.me/share/url?url=https%3A%2F%2Fyourdomain.com%2Fsignup%3Fref%3Ddemo123&text=%F0%9F%8E%93%20Get%2010%25%20OFF%20on%20NEET%20counselling%20plans%20using%20my%20referral%20link!" target="_blank" class="share-btn btn-telegram">
                    <i class="fa-brands fa-telegram"></i> Telegram
                  </a>
                </div>
              </div>
              <div class="hero-graphic">
                <i class="fa-solid fa-gift"></i>
              </div>
            </div>
          </div>
          
          <!-- Stats Grid -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon" style="background: #e0e7ff; color: #4f46e5;"><i class="fa-solid fa-wallet"></i></div>
              <div class="stat-info">
                <h3>Wallet Balance</h3>
                <p>₹450</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background: #dcfce7; color: #16a34a;"><i class="fa-solid fa-users"></i></div>
              <div class="stat-info">
                <h3>Successful Referrals</h3>
                <p>12</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background: #fef3c7; color: #d97706;"><i class="fa-solid fa-arrow-trend-up"></i></div>
              <div class="stat-info">
                <h3>Cashback Earned</h3>
                <p>₹2,450</p>
              </div>
            </div>
          </div>
          
          <!-- How It Works -->
          <div class="section-box">
            <h3 class="section-title"><i class="fa-solid fa-share-nodes"></i> How It Works</h3>
            <div class="steps-grid">
              <div class="step-item">
                <div class="step-icon">
                  <div class="step-number">1</div>
                  <i class="fa-solid fa-link"></i>
                </div>
                <h4>Share Link</h4>
                <p>Send your unique referral link to friends.</p>
              </div>
              <div class="step-item">
                <div class="step-icon">
                  <div class="step-number">2</div>
                  <i class="fa-solid fa-user-plus"></i>
                </div>
                <h4>Friend Joins</h4>
                <p>They sign up and purchase a plan.</p>
              </div>
              <div class="step-item">
                <div class="step-icon">
                  <div class="step-number">3</div>
                  <i class="fa-solid fa-tag"></i>
                </div>
                <h4>Friend Gets 10% OFF</h4>
                <p>Discount applied automatically.</p>
              </div>
              <div class="step-item">
                <div class="step-icon">
                  <div class="step-number">4</div>
                  <i class="fa-solid fa-sack-dollar"></i>
                </div>
                <h4>You Get Cashback</h4>
                <p>10% cashback added to your wallet.</p>
              </div>
            </div>
          </div>
          
          <!-- History -->
          <div class="section-box">
            <h3 class="section-title"><i class="fa-solid fa-clock-rotate-left"></i> Referral History</h3>
            <div style="overflow-x: auto;">
              <table class="history-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Status</th>
                    <th>Cashback</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div class="student-cell">
                        <div class="student-avatar">R</div>
                        <div class="student-name">Rahul Sharma</div>
                      </div>
                    </td>
                    <td><span class="status-badge status-success">Purchased</span></td>
                    <td class="amount-cell">+₹199</td>
                  </tr>
                  <tr>
                    <td>
                      <div class="student-cell">
                        <div class="student-avatar">P</div>
                        <div class="student-name">Priya Patel</div>
                      </div>
                    </td>
                    <td><span class="status-badge status-pending">Joined</span></td>
                    <td class="amount-cell pending">Pending</td>
                  </tr>
                  <tr>
                    <td>
                      <div class="student-cell">
                        <div class="student-avatar">A</div>
                        <div class="student-name">Aman Singh</div>
                      </div>
                    </td>
                    <td><span class="status-badge status-success">Purchased</span></td>
                    <td class="amount-cell">+₹299</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- CTA -->
          <div class="cta-card">
            <div class="cta-content">
              <div class="cta-icon"><i class="fa-solid fa-rocket" style="color: #fbbf24;"></i></div>
              <h3>Refer more friends and reduce your counselling costs using wallet rewards.</h3>
              <p>There is no limit to how much you can earn. Start sharing your link today!</p>
              <button class="cta-btn" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
                Share Now <i class="fa-solid fa-arrow-up"></i>
              </button>
            </div>
          </div>
          
        </div>
      </div>
      
      <script>
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
      </script>
    </div>
  </main>`;

let file = fs.readFileSync('frontend/web/index.html', 'utf8');
if (!file.includes('id="section-profile/refer-earn"')) {
    file = file.replace('  </main>', htmlToInject);
    fs.writeFileSync('frontend/web/index.html', file, 'utf8');
    console.log('Successfully injected Refer & Earn section');
} else {
    console.log('Section already exists');
}
