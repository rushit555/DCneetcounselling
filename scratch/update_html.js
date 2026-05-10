const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/web/index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Replace doctorsss
html = html.replace(
  /<img\s+src="assets\/doctorsss-removebg-preview555\.png"\s+alt="Why Choose DC NEET Counselling"\s+class="wcu2-dd-img"\s*\/>/g,
  '<img src="assets/doctorsss-removebg-preview555.webp" alt="Why Choose DC NEET Counselling" class="wcu2-dd-img" width="892" height="1116" loading="lazy" />'
);

// Replace dd transperent
html = html.replace(
  /<img\s+src="assets\/dd transperent555\.png"\s+alt="Smart Counselling Illustration"\s+class="ps-json-img"\s*\/>/g,
  '<img src="assets/dd transperent555.webp" alt="Smart Counselling Illustration" class="ps-json-img" width="1000" height="1000" loading="lazy" />'
);

// Replace ebook transperent
html = html.replace(
  /<img\s+src="assets\/ebook transperent555\.png"\s+alt="NEET Counselling Ebook"\s+class="eb-json-img"\s*\/>/g,
  '<img src="assets/ebook transperent555.webp" alt="NEET Counselling Ebook" class="eb-json-img" width="960" height="1036" loading="lazy" />'
);

// Replace logo
html = html.replace(
  /<img\s+src="assets\/logo\.jpg"\s+alt="Logo"\s+style="height: 40px; border-radius: 50%;"\s*>/g,
  '<img src="assets/logo.webp" alt="Logo" width="1024" height="1024" style="height: 40px; width: 40px; border-radius: 50%;" />'
);

// Add lazy loading and width/height to youtube thumbnails
html = html.replace(
  /<img\s+src="(https:\/\/img\.youtube\.com\/vi\/[^\/]+\/maxresdefault\.jpg)"\s+alt="([^"]+)"\s*class="rev-p-img"\s*\/>/g,
  '<img src="$1" alt="$2" class="rev-p-img" width="1280" height="720" loading="lazy" />'
);
// Some thumbnails have newlines between attributes
html = html.replace(
  /<img\s+src="(https:\/\/img\.youtube\.com\/vi\/[^\/]+\/maxresdefault\.jpg)"\s+alt="([^"]+)"\s*\n\s*class="rev-p-img"\s*\/>/g,
  '<img src="$1" alt="$2" class="rev-p-img" width="1280" height="720" loading="lazy" />'
);

fs.writeFileSync(filePath, html, 'utf8');
console.log('HTML updated successfully');
