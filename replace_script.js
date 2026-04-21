const fs = require('fs');

let text = fs.readFileSync('frontend/web/index.html', 'utf-8');

const typing_old =                   function typeChar() {
                    if (charIndex < targetText.length) {
                      typedText.textContent += targetText.charAt(charIndex);
                      charIndex++;
                      // Duration 1300ms total for 15 chars = ~86ms per char, or 60ms as per request
                      setTimeout(typeChar, 60);
                    } else {
                      // Hide cursor after complete
                      setTimeout(() => {
                        clearInterval(cursorBlink);
                        cursor.style.display = "none";
                      }, 1000);
                    }
                  };
const typing_new =                   function typeChar() {
                    if (charIndex === 0) {
                      typedText.textContent = "";
                      cursor.style.display = "inline";
                    }
                    if (charIndex < targetText.length) {
                      typedText.textContent += targetText.charAt(charIndex);
                      charIndex++;
                      setTimeout(typeChar, 60);
                    } else {
                      // Restart typing effect after 5 seconds
                      setTimeout(() => {
                        charIndex = 0;
                        typeChar();
                      }, 5000);
                    }
                  };
text = text.replace(typing_old, typing_new);

const blink_old =                   const cursorBlink = setInterval(() => {
                    cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0";
                  }, 500);;
const blink_new =                   setInterval(() => {
                    cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0";
                  }, 500);;
text = text.replace(blink_old, blink_new);


const stats_start = '        <section class="stats">';
const feature_start = '        <!-- Animated Feature Section -->';
const start_idx = text.indexOf(stats_start);
const end_idx = text.indexOf(feature_start);
if (start_idx !== -1 && end_idx !== -1) {
    text = text.substring(0, start_idx) + text.substring(end_idx);
}

const advanced_section = '        <!-- Advanced Counselling Services Section -->';
const feature_idx = text.indexOf(feature_start);
const adv_idx = text.indexOf(advanced_section);
if (feature_idx !== -1 && adv_idx !== -1) {
    const new_wcu = fs.readFileSync('wcu_new.html', 'utf-8');
    text = text.substring(0, feature_idx) + new_wcu + '\n\n' + text.substring(adv_idx);
}

fs.writeFileSync('frontend/web/index.html', text, 'utf-8');
console.log("SUCCESS REPLACE Node");
