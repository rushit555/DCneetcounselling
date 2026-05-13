const fs = require('fs');

let html = fs.readFileSync('frontend/web/index.html', 'utf8');

// 1. Add supabase-config.js script tag right before supabaseClient.js
const target = '<script defer src="js/supabaseClient.js?v=2026.04.24.1"></script>';
const replacement = '<script defer src="js/supabase-config.js?v=2026.05.11.1"></script>\n  ' + target;

if (html.includes(target) && !html.includes('supabase-config.js')) {
    html = html.replace(target, replacement);
    console.log('✅ Added supabase-config.js script tag before supabaseClient.js');
} else if (html.includes('supabase-config.js')) {
    console.log('⚠️ supabase-config.js already exists in HTML');
} else {
    console.log('❌ Could not find supabaseClient.js script tag');
}

fs.writeFileSync('frontend/web/index.html', html, 'utf8');
console.log('Done!');
