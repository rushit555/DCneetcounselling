const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/web/index.html');
let html = fs.readFileSync(filePath, 'utf8');

function processSection(sectionHtml) {
  // Replace card backgrounds
  // Find all cards (med-pricing-card, ayush-pricing-card, vet-pricing-card, combo-pricing-card)
  // Basic & Premium cards -> White + Gold Border
  // Gold/Premium Combo -> Yellow gradient
  
  // 1. Process Basic and Premium cards (which initially have background: #ffffff or similar)
  sectionHtml = sectionHtml.replace(/background:\s*#ffffff;?\s*(padding:\s*24px;\s*border-radius:\s*18px;)/g, 
    'background: #ffffff !important; border: 2px solid #facc15 !important; $1');
  
  sectionHtml = sectionHtml.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.05\);?\s*(backdrop-filter:\s*blur\(10px\);?\s*border:\s*1px\s*solid\s*rgba\(255,\s*255,\s*255,\s*0\.1\);?)/g, 
    'background: #ffffff !important; border: 2px solid #facc15 !important; /* $1 */');

  // 2. Process Center cards (Most Popular / Gold / Ultimate)
  // They usually have a gradient like linear-gradient(135deg, #ffd700, #ffb700) or #81c784 or #64b5f6 or #ff8a65
  sectionHtml = sectionHtml.replace(/background:\s*linear-gradient\([^)]+\);(?=\s*padding:\s*24px;\s*border-radius:\s*18px;)/g, 
    'background: linear-gradient(135deg, #ffd700, #ffb700) !important;');

  // 3. Fix Checkmarks and Crosses
  // Replace old &#x2714; or <i class="fa-solid fa-check"...>
  sectionHtml = sectionHtml.replace(/<span>&#x2714;<\/span>/g, '<span style="width: 20px; flex-shrink: 0; font-weight: bold; color: #000000 !important;">✓</span>');
  sectionHtml = sectionHtml.replace(/<span>&#x2716;<\/span>/g, '<span style="width: 20px; flex-shrink: 0; font-weight: bold; color: #dc2626 !important;">✕</span>');
  
  sectionHtml = sectionHtml.replace(/<i class="fa-solid fa-check"[^>]*><\/i>/g, '<span style="width: 20px; flex-shrink: 0; font-weight: bold; color: #000000 !important;">✓</span>');
  sectionHtml = sectionHtml.replace(/<i class="fa-solid fa-xmark"[^>]*><\/i>/g, '<span style="width: 20px; flex-shrink: 0; font-weight: bold; color: #dc2626 !important;">✕</span>');

  // 4. Force text color to black inside the cards
  // Only target typical text colors used in these cards
  sectionHtml = sectionHtml.replace(/color:\s*(#ffffff|#fff|#333|#111|#444|#e5e7eb|#9ca3af|rgba\(255,\s*255,\s*255,\s*0\.8\))(!important|;|\s)/g, (match, p1, p2) => {
    // Avoid buttons/badges which usually have font-size: 10px or say "Book Now"
    return `color: #000000 !important${p2}`;
  });
  
  // Ensure red cross text remains red
  sectionHtml = sectionHtml.replace(/color:\s*#d32f2f;/g, 'color: #dc2626 !important;');
  
  // Revert button and badge text colors back to white!
  sectionHtml = sectionHtml.replace(/background:\s*#000;?\s*color:\s*#000000 !important;?/g, 'background: #000; color: #ffffff !important;');

  return sectionHtml;
}

const sectionIds = [
  'section-medical-pricing',
  'section-ayush-pricing',
  'section-veterinary-pricing',
  'section-combo-pricing'
];

sectionIds.forEach(id => {
  let startIndex = html.indexOf(`<div id="${id}"`);
  if (startIndex === -1) return;
  
  // Find the end of the section by looking for the next <div id="section-
  let endIndex = html.indexOf('<div id="section-', startIndex + 10);
  if (endIndex === -1) endIndex = html.indexOf('<!--', startIndex + 10); // fallback
  
  let sectionHtml = html.substring(startIndex, endIndex);
  let processedHtml = processSection(sectionHtml);
  
  html = html.substring(0, startIndex) + processedHtml + html.substring(endIndex);
});

// Write it back
fs.writeFileSync(filePath, html, 'utf8');
console.log("Pricing sections perfectly patched.");
