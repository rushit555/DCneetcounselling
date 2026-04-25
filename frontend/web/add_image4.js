const fs = require('fs');
let data = fs.readFileSync('index.html', 'utf8');

// Update the Manager's placeholder
data = data.replace(
    /<div class="tc-image-placeholder" style="background-image: url\('assets\/rushit_rupapara_placeholder.png'\); background-size: cover; background-position: center;"><\/div>/g,
    `<div class="tc-image-placeholder has-image" style="background-image: url('assets/Manager.jpeg'); background-size: cover; background-position: center top;"></div>`
);

fs.writeFileSync('index.html', data);
console.log('Manager Image added successfully.');
