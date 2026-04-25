const fs = require('fs');
let data = fs.readFileSync('index.html', 'utf8');

const regex = /<div id="([^"]+)" class="page-section"/g;
let match;
while ((match = regex.exec(data)) !== null) {
  console.log(match[1]);
}
