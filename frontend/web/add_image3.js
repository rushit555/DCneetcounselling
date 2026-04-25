const fs = require('fs');
let data = fs.readFileSync('index.html', 'utf8');

// Update the Senior Counsellor's placeholder
data = data.replace(
    /<div class="tc-image-placeholder" style="background-image: url\('assets\/pushpendra_sharma_placeholder.png'\); background-size: cover; background-position: center;"><\/div>/g,
    `<div class="tc-image-placeholder has-image" style="background-image: url('assets/Senior%20Counsellor.jpeg'); background-size: cover; background-position: center top;"></div>`
);

fs.writeFileSync('index.html', data);
console.log('Senior Counsellor Image added successfully.');
