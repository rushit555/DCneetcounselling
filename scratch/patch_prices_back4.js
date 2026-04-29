const fs = require('fs');
const path = 'c:\\\\Users\\\\rushi\\\\Downloads\\\\DCneetcounselling\\\\frontend\\\\web\\\\index.html';
let content = fs.readFileSync(path, 'utf8');
const lines = content.split('\\n');

if (lines[5664].includes('Starts from ₹1')) {
    lines[5664] = lines[5664].replace('Starts from ₹1', 'Starts from ₹199');
}
if (lines[5682].includes('Starts from ₹1')) {
    lines[5682] = lines[5682].replace('Starts from ₹1', 'Starts from ₹99');
}

fs.writeFileSync(path, lines.join('\\n'), 'utf8');
console.log("Labels successfully updated!");
