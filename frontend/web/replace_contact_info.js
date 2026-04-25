const fs = require('fs');
let data = fs.readFileSync('index.html', 'utf8');

data = data.replace('+91 123 456 7890', '+91 9694673555');
data = data.replace('support@dccounselling.com', 'support@dcneetcounselling.com');
data = data.replace('123 Education Street, New Delhi,<br>India - 110001', 'H-301 Keshavpura Sector-7,<br>Kota, Rajasthan 324009');

fs.writeFileSync('index.html', data);
console.log('Contact details updated successfully.');
