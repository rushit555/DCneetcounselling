const fs = require('fs');
let data = fs.readFileSync('index.html', 'utf8');

// Replace the linkedin icon div block across the file
const replaced = data.replace(/\s*<div>\s*<a href="#" class="tc-social"><i class="fa-brands fa-linkedin-in"><\/i><\/a>\s*<\/div>/g, '');

fs.writeFileSync('index.html', replaced);
console.log('LinkedIn icons removed successfully.');
