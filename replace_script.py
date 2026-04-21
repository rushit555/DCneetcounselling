import codecs

with codecs.open('frontend/web/index.html', 'r', 'utf-8') as f:
    text = f.read()

typing_old = '''                  function typeChar() {
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
                  }'''
typing_new = '''                  function typeChar() {
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
                  }'''
text = text.replace(typing_old, typing_new)

blink_old = '''                  const cursorBlink = setInterval(() => {
                    cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0";
                  }, 500);'''
blink_new = '''                  setInterval(() => {
                    cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0";
                  }, 500);'''
text = text.replace(blink_old, blink_new)

stats_start = '        <section class="stats">'
stats_end = '        <!-- Animated Feature Section -->'
start_idx = text.find(stats_start)
end_idx = text.find(stats_end)
if start_idx != -1 and end_idx != -1:
    text = text[:start_idx] + text[end_idx:]

feature_start = '        <!-- Animated Feature Section -->'
advanced_section = '        <!-- Advanced Counselling Services Section -->'
feature_idx = text.find(feature_start)
adv_idx = text.find(advanced_section)
if feature_idx != -1 and adv_idx != -1:
    with codecs.open('wcu_new.html', 'r', 'utf-8') as f2:
        new_wcu = f2.read()
    text = text[:feature_idx] + new_wcu + '\n\n' + text[adv_idx:]

with codecs.open('frontend/web/index.html', 'w', 'utf-8') as f3:
    f3.write(text)
print("SUCCESS REPLACE")
