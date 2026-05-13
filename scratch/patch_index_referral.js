const fs = require('fs');

let html = fs.readFileSync('frontend/web/index.html', 'utf8');

// 1. Update updateNavForAuth
const oldNav = '      window._authUser = user;';
const newNav = '      window._authUser = user;\n      \n      // Trigger Referral Data Load if logged in\n      if (user && window.loadReferralPageData) {\n        window.loadReferralPageData();\n      }';

if (html.includes(oldNav)) {
    // We need to be careful as there might be multiple occurrences of window._authUser = user;
    // But usually only one inside updateNavForAuth
    html = html.replace(oldNav, newNav);
    console.log('✅ Updated updateNavForAuth');
}

// 2. Fix generateReferralLink
const oldGen = 'return window.location.origin + "/#signup?ref=" + token;';
const newGen = 'return window.location.origin + "/?ref=" + token;';
if (html.includes(oldGen)) {
    html = html.replace(oldGen, newGen);
    console.log('✅ Fixed generateReferralLink');
}

// 3. Add initial load to DOMContentLoaded
const oldDoc = "_referralObserver.observe(section, { attributes: true, attributeFilter: ['style'] });\n          }\n        });";
const newDoc = "_referralObserver.observe(section, { attributes: true, attributeFilter: ['style'] });\n          }\n          \n          // Initial check if already logged in\n          if (window._authUser) {\n            loadReferralPageData();\n          }\n        });";

if (html.includes(oldDoc)) {
    html = html.replace(oldDoc, newDoc);
    console.log('✅ Added initial load to DOMContentLoaded');
} else {
    // Try with different spacing/line endings
    const oldDocAlt = "_referralObserver.observe(section, { attributes: true, attributeFilter: ['style'] });\r\n          }\r\n        });";
    if (html.includes(oldDocAlt)) {
        html = html.replace(oldDocAlt, newDoc);
        console.log('✅ Added initial load to DOMContentLoaded (CRLF)');
    } else {
        console.log('❌ Could not find DOMContentLoaded block');
    }
}

fs.writeFileSync('frontend/web/index.html', html, 'utf8');
console.log('Done!');
