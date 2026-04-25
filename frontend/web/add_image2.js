const fs = require('fs');
let data = fs.readFileSync('index.html', 'utf8');

// Update the Co-Founder's placeholder
data = data.replace(
    /<div class="tc-image-placeholder" style="background-image: url\('assets\/rahul_saini_placeholder.png'\); background-size: cover; background-position: center;"><\/div>/g,
    `<div class="tc-image-placeholder has-image" style="background-image: url('assets/Co%20founder.jpeg'); background-size: cover; background-position: center top;"></div>`
);

fs.writeFileSync('index.html', data);
console.log('Co-Founder Image added successfully.');
