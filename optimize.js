const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'index.html');
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Add loading="lazy" to <img> tags
// We pass images that already have it or are critical (like logos). We'll blindly add to all <img> then fix the logo in header.html if needed.
let imgCount = 0;
content = content.replace(/<img\b([^>]*)>/gi, (match, p1) => {
    // If it already has loading attr, skip
    if (p1.includes('loading=')) return match;
    // Small inline icons don't strictly need it but it won't hurt.
    imgCount++;
    return `<img loading="lazy" ${p1}>`;
});

// 2. Add defer to external scripts (like razorpay)
let scriptCount = 0;
content = content.replace(/<script\s+src="([^"]+)"([^>]*)><\/script>/gi, (match, src, rest) => {
    // If already deferred or async, skip
    if (rest.includes('defer') || rest.includes('async')) return match;
    
    // Add defer for external specific scripts like Razorpay, or any unused debug scripts
    if (src.includes('checkout.js')) {
        scriptCount++;
        return `<script defer src="${src}"${rest}></script>`;
    }
    return match;
});

// 3. Optional: remove any known dummy/debug scripts
let debugCount = 0;
const debugScripts = ['debug.js', 'my_debug.js', 'fix_everything.js', 'fix_overlay.js', 'fix_header.js'];
debugScripts.forEach(script => {
    const rx = new RegExp(`<script[^>]*src="[^"]*${script}"[^>]*><\\/script>\\s*`, 'gi');
    const prev = content;
    content = content.replace(rx, '');
    if (prev !== content) debugCount++;
});

// Write changes
fs.writeFileSync(targetFile, content);
console.log(`Optimized index.html: added lazy load to ${imgCount} images, deferred ${scriptCount} scripts, removed ${debugCount} debug scripts.`);
