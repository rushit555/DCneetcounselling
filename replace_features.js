const fs = require('fs');
let text = fs.readFileSync('frontend/web/index.html', 'utf-8');

const feature_start = '<!-- Animated Feature Section -->';
const advanced_section = '<!-- Advanced Counselling Services Section -->';

const feature_idx = text.indexOf(feature_start);
const adv_idx = text.indexOf(advanced_section);

if (feature_idx !== -1 && adv_idx !== -1) {
    let padding_before = text.substring(0, feature_idx);
    let padding_after = text.substring(adv_idx);
    const new_wcu = fs.readFileSync('wcu_new.html', 'utf-8');
    text = padding_before + new_wcu + '\n\n        ' + padding_after;
    fs.writeFileSync('frontend/web/index.html', text, 'utf-8');
    console.log("REPLACED FEATURES successfully.");
} else {
    console.log("Markers not found! feature_idx=" + feature_idx + ", adv_idx=" + adv_idx);
}
