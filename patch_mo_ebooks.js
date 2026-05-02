const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/web/index.html');
let html = fs.readFileSync(filePath, 'utf8');

const cardRegex = /<div class="mo-card scale-up"([\s\S]*?)<\/button>\s*<\/div>/g;

html = html.replace(cardRegex, (match, inner) => {
  if (!match.includes('mo-title')) return match;

  let priceMatch = match.match(/Starts from &#8377;(\d+)/);
  if (!priceMatch) return match; // already processed or not matching
  let currentPrice = parseInt(priceMatch[1]);
  let originalPrice = currentPrice * 2;
  let savings = originalPrice - currentPrice;

  // 1. Remove old price
  let updatedCard = match.replace(/<div\s+style="[^"]*font-size:\s*12px;\s*font-weight:\s*600;\s*color:\s*#16a34a;[^"]*">\s*<i[^>]*><\/i>\s*Starts from &#8377;\d+\s*<\/div>/, '');

  // 2. Add new pricing block + value text (below mo-subtitle)
  updatedCard = updatedCard.replace(/(<p class="mo-subtitle">.*?<\/p>)/, `$1
            <p style="font-size: 11px; font-weight: 600; color: #1e293b; margin: 0 0 10px 0;">Cutoff + Counselling + College Guide</p>
            <div style="margin: 8px 0 12px 0;">
              <div style="font-size: 13px; font-weight: 600; color: #1e293b; display: flex; align-items: center; justify-content: center; gap: 8px;">
                <span style="color: #94a3b8; text-decoration: line-through;">&#8377;${originalPrice}</span>
                <span style="font-size: 16px; font-weight: 800; color: #f59e0b;">&#8377;${currentPrice}</span>
              </div>
              <div style="font-size: 11px; font-weight: 700; color: #16a34a; margin-top: 2px;">
                You save &#8377;${savings}
              </div>
            </div>`);

  // 3. Discount badge
  updatedCard = updatedCard.replace(/(<div class="mo-card scale-up"[^>]*>)/, `$1
            <div class="ec-discount-badge" style="position: absolute; top: -10px; left: -10px; background: linear-gradient(135deg, #ef4444, #f97316); color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; z-index: 10; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">🔥 50% OFF</div>`);

  // 4. Button Text
  updatedCard = updatedCard.replace(/Buy (AIQ|State) eBooks/, `Buy Now at &#8377;${currentPrice}`);

  // 6. Urgency text
  updatedCard = updatedCard.replace(/(<\/button>\s*<\/div>)$/, `</button>\n            <div style="font-size: 11px; font-weight: 700; color: #ef4444; margin-top: 12px;">⏳ Limited Time Offer</div>\n          </div>`);

  // Ensure card has position: relative so badge places correctly
  updatedCard = updatedCard.replace(/class="mo-card scale-up"/, 'class="mo-card scale-up" style="position: relative;"');

  return updatedCard;
});

fs.writeFileSync(filePath, html, 'utf8');
console.log('MO Ebook cards updated.');
