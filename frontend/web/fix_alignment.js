const fs = require('fs');
let data = fs.readFileSync('index.html', 'utf8');

// 1. Change justify-content from center to flex-start for tc-content
data = data.replace(
    /\.tc-content {\s*flex: 1;\s*display: flex;\s*flex-direction: column;\s*justify-content: center;\s*}/,
    `.tc-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
          }`
);

// 2. Change TEAM MEMBER to MANAGER
data = data.replace(
    /<div class="tc-badge"><i class="fa-solid fa-user"><\/i> TEAM MEMBER<\/div>/,
    `<div class="tc-badge"><i class="fa-solid fa-user"></i> MANAGER</div>`
);

fs.writeFileSync('index.html', data);
console.log('Alignment fixed and badge changed to Manager.');
