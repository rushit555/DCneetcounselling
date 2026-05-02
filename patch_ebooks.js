const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/web/index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Find the ebook grid section
const gridStart = html.indexOf('<div class="ebook-grid">');
const gridEnd = html.indexOf('</div>', html.lastIndexOf('class="ebook-card-v2 scale-up"') + 500) + 6; 
// We will process each ebook-card-v2 individually instead of relying on perfect indices.

let newHtml = html;

// We use regex to match each ebook card:
const cardRegex = /<div class="ebook-card-v2 scale-up"([\s\S]*?)<\/button>\s*<\/div>/g;

newHtml = newHtml.replace(cardRegex, (match, inner) => {
  // If it doesn't look like our main ebook cards, skip it
  if (!match.includes('ec-title')) return match;

  // Extract current price
  let priceMatch = match.match(/Starts from &#8377;(\d+)/);
  let currentPrice = priceMatch ? parseInt(priceMatch[1]) : 99;
  
  // Logic
  let originalPrice = currentPrice * 2;
  let savings = originalPrice - currentPrice;

  // 1. Remove old price text
  let updatedCard = match.replace(/<div class="ec-price">[\s\S]*?<\/div>/, '');

  // 2. Add New Pricing Block + Value Text
  // We'll insert it after the ec-courses paragraph
  let coursesRegex = /(<p class="ec-courses">.*?<\/p>)/;
  updatedCard = updatedCard.replace(coursesRegex, `$1
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

  // 3. Add Discount Badge at the top left of the card
  // Insert right after the opening div
  updatedCard = updatedCard.replace(/(<div class="ebook-card-v2 scale-up"[^>]*>)/, `$1
            <div class="ec-discount-badge" style="position: absolute; top: -10px; left: -10px; background: linear-gradient(135deg, #ef4444, #f97316); color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; z-index: 10; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">🔥 50% OFF</div>`);

  // 4. Update Button Text
  updatedCard = updatedCard.replace(/Buy eBooks/g, `Buy Now at &#8377;${currentPrice}`);

  // 6. Add Urgency Text below buttons
  // The card ends with the cart button, then </div>.
  // We match the cart button's closing tag and add urgency text before the final </div>
  updatedCard = updatedCard.replace(/(<\/button>\s*<\/div>)$/, `</button>\n            <div style="font-size: 11px; font-weight: 700; color: #ef4444; margin-top: 12px;">⏳ Limited Time Offer</div>\n          </div>`);

  return updatedCard;
});

fs.writeFileSync(filePath, newHtml, 'utf8');
console.log('Ebook UI updated successfully!');
