const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/web/index.html');
let html = fs.readFileSync(filePath, 'utf8');

function processSection(sectionHtml, isCombo) {
  // Section background
  sectionHtml = sectionHtml.replace(/background:\s*linear-gradient\([^)]+\);\s*min-height:\s*100vh;/g, 'background: linear-gradient(135deg, #6366f1, #a855f7);\n          min-height: 100vh;');
  
  // Back button
  sectionHtml = sectionHtml.replace(/color:\s*#4b5563;\s*font-weight:\s*600/g, 'color: #ffffff !important; font-weight: 600');
  
  // h2 text color
  sectionHtml = sectionHtml.replace(/(<h2[^>]*color:\s*)(#[a-fA-F0-9]+)([^>]*>)/, '$1#ffffff !important$3');
  
  // White cards (Basic / Premium / Combo Basic)
  sectionHtml = sectionHtml.replace(/background:\s*#ffffff;/g, 'background: #ffffff !important;\n                  border: 2px solid #facc15 !important;');
  
  // Center card / Gold card (or Combo Premium)
  // Look for Gold Plan or Premium Combo which has gradients like #81c784, #64b5f6, #ff8a65
  sectionHtml = sectionHtml.replace(/background:\s*linear-gradient\([^)]+\);(\s*padding:\s*24px;\s*border-radius:\s*18px;\s*position:\s*relative;\s*display:\s*flex;\s*flex-direction:\s*column;\s*color:\s*)#fff;/g, 
    'background: linear-gradient(135deg, #ffd700, #ffb700);$1#000000 !important;');
    
  // Also fix color: #fff in headers/text inside the Gold/Premium Combo card
  // Actually, we'll just replace all text colors inside the lists and headers
  
  // Fix checkmarks
  sectionHtml = sectionHtml.replace(/<span>&#x2714;<\/span>/g, '<span style="width: 20px; flex-shrink: 0; font-weight: bold; color: #000000;">✓</span>');
  
  // Fix crosses
  sectionHtml = sectionHtml.replace(/<span>&#x2716;<\/span>/g, '<span style="width: 20px; flex-shrink: 0; font-weight: bold; color: #dc2626;">✕</span>');
  
  // Replace all color variations for text with black
  sectionHtml = sectionHtml.replace(/color:\s*(#333|#111|#444|#222|#fff|#ffffff)(;|\s|!important)/g, (match, p1, p2) => {
    // Avoid replacing button text
    if (match.includes('#fff') && !sectionHtml.includes('button')) {
       // We can't do this easily with regex globally because it might replace button text which needs to be white.
    }
    return match;
  });

  return sectionHtml;
}

// Split by sections to be safe
let ayushStart = html.indexOf('<div id="section-ayush-pricing"');
let vetStart = html.indexOf('<div id="section-veterinary-pricing"');
let comboStart = html.indexOf('<div id="section-combo-pricing"');
let contactStart = html.indexOf('<div id="section-contact"');

if (ayushStart !== -1 && vetStart !== -1 && comboStart !== -1 && contactStart !== -1) {
    
    let ayushSection = html.substring(ayushStart, vetStart);
    let vetSection = html.substring(vetStart, comboStart);
    let comboSection = html.substring(comboStart, contactStart);

    // Apply specific color replacements without affecting buttons
    function fixColors(section) {
        // Ticks list items
        section = section.replace(/color:\s*(#444|#222|#fff|#ffffff)/g, 'color: #000000 !important');
        // Titles and prices
        section = section.replace(/color:\s*(#333|#111)/g, 'color: #000000 !important');
        
        // Restore button colors (buttons have background: #000 and color: #fff)
        section = section.replace(/background:\s*#000;\s*color:\s*#000000 !important;/g, 'background: #000;\n                    color: #fff;');
        
        // Restore badge colors (Starter, Premium, Most Popular)
        // They are absolute, top 12px, right 12px, background: #000, color: #fff
        section = section.replace(/background:\s*#000;\s*color:\s*#000000 !important;\s*font-size:\s*10px;/g, 'background: #000;\n                    color: #fff;\n                    font-size: 10px;');
        return section;
    }

    ayushSection = fixColors(processSection(ayushSection, false));
    vetSection = fixColors(processSection(vetSection, false));
    comboSection = fixColors(processSection(comboSection, true));

    // Special fix for combo plan buttons if any were missed
    
    // Stitch back together
    html = html.substring(0, ayushStart) + ayushSection + vetSection + comboSection + html.substring(contactStart);
    
    fs.writeFileSync(filePath, html, 'utf8');
    console.log("Successfully patched index.html");
} else {
    console.log("Could not find section markers.");
}
