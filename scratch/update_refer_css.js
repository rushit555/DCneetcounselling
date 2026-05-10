const fs = require('fs');

const cssToReplace = `<style>
        .refer-earn-container { font-family: 'Poppins', sans-serif; min-height: 100vh; padding-bottom: 80px; }
        .refer-earn-content { max-width: 1024px; margin: 0 auto; padding: 40px 20px; }
        .refer-header { margin-bottom: 30px; text-align: center; }
        .refer-header h1 { font-size: 32px; font-weight: 700; color: #ffffff; margin-bottom: 8px; }
        .refer-header p { color: rgba(255,255,255,0.8); font-size: 16px; }
        
        .hero-card { position: relative; border-radius: 24px; background: linear-gradient(135deg, #4f46e5 0%, #9333ea 50%, #db2777 100%); padding: 3px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3); margin-bottom: 30px; }
        .hero-card-inner { background: rgba(0, 0, 0, 0.2); backdrop-filter: blur(20px); border-radius: 21px; padding: 40px; color: white; display: flex; flex-direction: column; gap: 20px; position: relative; z-index: 10; }
        @media (min-width: 768px) { .hero-card-inner { flex-direction: row; align-items: center; justify-content: space-between; } }
        
        .hero-text { flex: 1; }
        .hero-text h2 { font-size: 36px; font-weight: 800; line-height: 1.2; margin-bottom: 16px; color: #ffffff !important; }
        .hero-text p { font-size: 18px; color: rgba(255,255,255,0.9); margin-bottom: 24px; line-height: 1.5; }
        .highlight-badge { background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 6px; font-weight: 700; color: white; }
        
        .link-box { display: flex; gap: 10px; margin-bottom: 24px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; padding: 6px; }
        .link-input { flex: 1; background: transparent; border: none; color: white; padding: 10px 15px; font-size: 16px; outline: none; }
        .link-input::placeholder { color: rgba(255,255,255,0.5); }
        .copy-btn { background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; width: 44px; height: 44px; cursor: pointer; transition: 0.2s; display: flex; justify-content: center; align-items: center; }
        .copy-btn:hover { background: rgba(255,255,255,0.3); }
        
        .share-buttons { display: flex; gap: 12px; flex-wrap: wrap; }
        .share-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 12px; font-weight: 600; font-size: 16px; text-decoration: none; color: white; transition: transform 0.2s; box-shadow: 0 4px 14px rgba(0,0,0,0.2); }
        .share-btn:hover { transform: translateY(-2px); }
        .btn-whatsapp { background: #25D366; }
        .btn-telegram { background: #0088cc; }
        
        .hero-graphic { display: none; }
        @media (min-width: 768px) { .hero-graphic { display: flex; justify-content: center; align-items: center; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; font-size: 80px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); animation: float 6s ease-in-out infinite; } }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
        
        .stats-grid { display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 40px; }
        @media (min-width: 768px) { .stats-grid { grid-template-columns: repeat(3, 1fr); } }
        .stat-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); border-radius: 20px; padding: 24px; display: flex; align-items: center; gap: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.1); transition: transform 0.2s; }
        .stat-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.2); }
        .stat-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; justify-content: center; align-items: center; font-size: 24px; }
        .stat-info h3 { font-size: 14px; color: rgba(255,255,255,0.7) !important; font-weight: 500; margin-bottom: 4px; }
        .stat-info p { font-size: 28px; font-weight: 800; color: #ffffff !important; margin: 0; }
        
        .section-box { background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.1); margin-bottom: 40px; }
        .section-title { font-size: 24px; font-weight: 700; color: #ffffff !important; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
        .section-title i { background: rgba(255,255,255,0.1); width: 40px; height: 40px; border-radius: 12px; display: flex; justify-content: center; align-items: center; color: #ffffff; font-size: 18px; }
        
        .steps-grid { display: grid; grid-template-columns: 1fr; gap: 30px; position: relative; }
        @media (min-width: 768px) { .steps-grid { grid-template-columns: repeat(4, 1fr); } .steps-grid::before { content: ''; position: absolute; top: 32px; left: 10%; right: 10%; height: 2px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); z-index: 1; } }
        .step-item { display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; z-index: 2; }
        .step-icon { width: 64px; height: 64px; background: rgba(0,0,0,0.3); border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.15); display: flex; justify-content: center; align-items: center; font-size: 24px; color: #c084fc; margin-bottom: 16px; position: relative; transition: transform 0.3s; }
        .step-item:hover .step-icon { transform: scale(1.1); border-color: #c084fc; }
        .step-number { position: absolute; top: -8px; right: -8px; width: 24px; height: 24px; background: #c084fc; color: white; border-radius: 50%; font-size: 12px; font-weight: 700; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 10px rgba(192,132,252,0.4); }
        .step-item h4 { font-size: 18px; font-weight: 700; color: #ffffff !important; margin-bottom: 8px; }
        .step-item p { font-size: 14px; color: rgba(255,255,255,0.7) !important; }
        
        .history-table { width: 100%; border-collapse: collapse; }
        .history-table th { text-align: left; padding: 16px; font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.6); border-bottom: 1px solid rgba(255,255,255,0.1); }
        .history-table th:last-child { text-align: right; }
        .history-table td { padding: 20px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; }
        .history-table tr:hover td { background: rgba(255,255,255,0.05); }
        .history-table tr:last-child td { border-bottom: none; }
        .student-cell { display: flex; align-items: center; gap: 12px; }
        .student-avatar { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.1); color: #ffffff; font-weight: 700; display: flex; justify-content: center; align-items: center; }
        .student-name { font-weight: 600; color: #ffffff; }
        .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
        .status-success { background: rgba(34,197,94,0.2); color: #4ade80; }
        .status-success::before { content: ''; width: 6px; height: 6px; background: #4ade80; border-radius: 50%; }
        .status-pending { background: rgba(245,158,11,0.2); color: #fbbf24; }
        .status-pending::before { content: ''; width: 6px; height: 6px; background: #fbbf24; border-radius: 50%; }
        .amount-cell { text-align: right; font-weight: 700; color: #c084fc; }
        .amount-cell.pending { color: rgba(255,255,255,0.5); }
        
        .cta-card { background: linear-gradient(135deg, rgba(30,27,75,0.8), rgba(49,46,129,0.8)); backdrop-filter: blur(10px); border: 1px solid rgba(99,102,241,0.3); border-radius: 24px; padding: 40px; text-align: center; color: white; position: relative; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
        .cta-card::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 60%); animation: spin 15s linear infinite; }
        .cta-content { position: relative; z-index: 10; max-width: 600px; margin: 0 auto; }
        .cta-icon { width: 64px; height: 64px; background: rgba(255,255,255,0.1); border-radius: 20px; display: inline-flex; justify-content: center; align-items: center; font-size: 32px; margin-bottom: 24px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); }
        .cta-content h3 { font-size: 28px; font-weight: 800; margin-bottom: 16px; line-height: 1.3; color: #ffffff !important; }
        .cta-content p { font-size: 16px; color: #c7d2fe; margin-bottom: 32px; }
        .cta-btn { background: #ffffff; color: #312e81; font-weight: 700; font-size: 16px; padding: 16px 32px; border-radius: 30px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; border: none; cursor: pointer; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(255,255,255,0.2); }
        
        .mobile-sticky-share { display: none; }
        @media (max-width: 767px) {
          .mobile-sticky-share { display: block; position: fixed; bottom: 0; left: 0; right: 0; background: rgba(15,23,42,0.9); backdrop-filter: blur(10px); padding: 16px; border-top: 1px solid rgba(255,255,255,0.1); z-index: 100; box-shadow: 0 -4px 20px rgba(0,0,0,0.3); }
          .mobile-sticky-share .share-btn { width: 100%; justify-content: center; }
          .history-table th:nth-child(2), .history-table td:nth-child(2) { display: none; }
        }
      </style>`;

let file = fs.readFileSync('frontend/web/index.html', 'utf8');

// Find the start of the style tag for refer-earn section
const startRegex = /<style>\s*\.refer-earn-container/;
const startIndex = file.search(startRegex);

if (startIndex !== -1) {
    const endTag = '</style>';
    const endIndex = file.indexOf(endTag, startIndex) + endTag.length;
    
    file = file.substring(0, startIndex) + cssToReplace + file.substring(endIndex);
    fs.writeFileSync('frontend/web/index.html', file, 'utf8');
    console.log('Successfully updated the CSS for dark mode glassmorphism!');
} else {
    console.log('Could not find the style block to replace.');
}
