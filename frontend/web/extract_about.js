const fs = require('fs');
let data = fs.readFileSync('index.html', 'utf8');

const regex = /(<div id="section-about" class="page-section">.*?)(?=<div id="section-services")/s;
let match = data.match(regex);
if (match) {
  console.log(match[1].substring(0, 300));
  console.log('... [end of section about match] ...');
  console.log(match[1].substring(match[1].length - 300));
} else {
  console.log('Match not found');
}
