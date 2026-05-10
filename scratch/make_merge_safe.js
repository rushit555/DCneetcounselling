const fs = require('fs');
const path = require('path');

const testUrl = 'https://anqqmulbmeydetwpeudh.supabase.co';
const prodUrl = 'https://rlqmdylbzapyepuwncwt.supabase.co';

const testKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFucXFtdWxibWV5ZGV0d3BldWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODY1MTMsImV4cCI6MjA5Mzk2MjUxM30.AbfUID7hy1gg88C_j0OUk09G0XEW8uEqvJzD17u96ZA';
const prodKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscW1keWxiemFweWVwdXduY3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTcwNzYsImV4cCI6MjA5MTgzMzA3Nn0.oNNK1pwLnykQlNfUkw7IdB-ZBkKDoWxszsKDSIjsLeo';

const testHost = 'anqqmulbmeydetwpeudh.supabase.co';
const prodHost = 'rlqmdylbzapyepuwncwt.supabase.co';

// Files to revert to production (everything EXCEPT supabase-config.js)
const filesToRevert = [
    'frontend/web/index.html',
    'frontend/web/js/app_v2.js',
    'frontend/web/js/collegeMediaUpload.js',
    'frontend/web/payment/index.html',
    'frontend/web/reset-password/index.html',
    'frontend/web/sitemap.php',
];

filesToRevert.forEach(file => {
    if (!fs.existsSync(file)) {
        console.log('SKIP (not found):', file);
        return;
    }
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    if (content.includes(testUrl)) {
        content = content.split(testUrl).join(prodUrl);
        changed = true;
    }
    if (content.includes(testKey)) {
        content = content.split(testKey).join(prodKey);
        changed = true;
    }
    if (content.includes(testHost)) {
        content = content.split(testHost).join(prodHost);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('REVERTED to production:', file);
    } else {
        console.log('Already production:', file);
    }
});

// Now update supabaseClient.js to read from window.__SUPABASE_URL
const scFile = 'frontend/web/js/supabaseClient.js';
let sc = fs.readFileSync(scFile, 'utf8');

// Replace the hardcoded testing URL/key with references to the global config
sc = sc.replace(
    /const SUPABASE_URL\s*=\s*'[^']+'/,
    "const SUPABASE_URL  = window.__SUPABASE_URL || 'https://rlqmdylbzapyepuwncwt.supabase.co'"
);
sc = sc.replace(
    /const SUPABASE_ANON\s*=\s*'[^']+'/,
    "const SUPABASE_ANON = window.__SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscW1keWxiemFweWVwdXduY3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTcwNzYsImV4cCI6MjA5MTgzMzA3Nn0.oNNK1pwLnykQlNfUkw7IdB-ZBkKDoWxszsKDSIjsLeo'"
);

fs.writeFileSync(scFile, sc, 'utf8');
console.log('UPDATED supabaseClient.js to use window.__SUPABASE_URL with production fallback');

// Now update app_v2.js to also use the global config
const appFile = 'frontend/web/js/app_v2.js';
let app = fs.readFileSync(appFile, 'utf8');

app = app.replace(
    /const SUPABASE_URL\s*=\s*'[^']+'/,
    "const SUPABASE_URL  = window.__SUPABASE_URL || 'https://rlqmdylbzapyepuwncwt.supabase.co'"
);
app = app.replace(
    /const SUPABASE_ANON\s*=\s*'[^']+'/,
    "const SUPABASE_ANON = window.__SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscW1keWxiemFweWVwdXduY3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTcwNzYsImV4cCI6MjA5MTgzMzA3Nn0.oNNK1pwLnykQlNfUkw7IdB-ZBkKDoWxszsKDSIjsLeo'"
);

fs.writeFileSync(appFile, app, 'utf8');
console.log('UPDATED app_v2.js to use window.__SUPABASE_URL with production fallback');

console.log('\n✅ All files are now merge-safe!');
console.log('Only supabase-config.js controls which database is active.');
