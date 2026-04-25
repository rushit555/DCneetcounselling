const fs = require('fs');
let data = fs.readFileSync('index.html', 'utf8');

// Add the .has-image CSS class to remove borders and text
if (!data.includes('.tc-image-placeholder.has-image')) {
    data = data.replace(
        /.tc-image-placeholder::after {/g,
        `.tc-image-placeholder.has-image { border: none; }\n          .tc-image-placeholder.has-image::after { content: none; display: none; }\n          .tc-image-placeholder::after {`
    );
}

// Update the Founder's placeholder
data = data.replace(
    /<div class="tc-image-placeholder" style="background-image: url\('assets\/chetan_sen_placeholder.png'\); background-size: cover; background-position: center;"><\/div>/g,
    `<div class="tc-image-placeholder has-image" style="background-image: url('assets/Founder.jpeg'); background-size: cover; background-position: center top;"></div>`
);

fs.writeFileSync('index.html', data);
console.log('Image added successfully.');
