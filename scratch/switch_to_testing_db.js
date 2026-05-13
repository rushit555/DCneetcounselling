const fs = require('fs');
const path = require('path');

const prodUrl = 'https://rlqmdylbzapyepuwncwt.supabase.co';
const testUrl = 'https://anqqmulbmeydetwpeudh.supabase.co';

const prodKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscW1keWxiemFweWVwdXduY3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTcwNzYsImV4cCI6MjA5MTgzMzA3Nn0.oNNK1pwLnykQlNfUkw7IdB-ZBkKDoWxszsKDSIjsLeo';
const testKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFucXFtdWxibWV5ZGV0d3BldWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODY1MTMsImV4cCI6MjA5Mzk2MjUxM30.AbfUID7hy1gg88C_j0OUk09G0XEW8uEqvJzD17u96ZA';

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else {
            if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.php')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walkDir('frontend/web');

let replacedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;
    
    if (content.includes(prodUrl)) {
        content = content.split(prodUrl).join(testUrl);
        hasChanges = true;
    }
    
    if (content.includes(prodKey)) {
        content = content.split(prodKey).join(testKey);
        hasChanges = true;
    }
    
    // There might be another format of the url without https://
    const prodHost = 'rlqmdylbzapyepuwncwt.supabase.co';
    const testHost = 'anqqmulbmeydetwpeudh.supabase.co';
    if (content.includes(prodHost)) {
        content = content.split(prodHost).join(testHost);
        hasChanges = true;
    }

    if (hasChanges) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated:', file);
        replacedCount++;
    }
});

console.log('Total files updated to use TESTING database:', replacedCount);
