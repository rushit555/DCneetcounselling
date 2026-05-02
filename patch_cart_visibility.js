const fs = require('fs');
let html = fs.readFileSync('frontend/web/index.html', 'utf8');

// 1. Section background to transparent
html = html.replace(
  'id="section-cart" class="page-section" style="\r\n          background: #f8fafc;',
  'id="section-cart" class="page-section" style="\r\n          background: transparent;'
);

// 2. Heading colors to white
html = html.replace(
  'font-size: 28px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">Your Cart',
  'font-size: 28px; font-weight: 800; color: #ffffff; margin: 0 0 6px 0;">Your Cart'
);
html = html.replace(
  'font-size: 14px; color: #64748b; margin: 0; font-weight: 500;">Review your selected eBooks',
  'font-size: 14px; color: rgba(255,255,255,0.7); margin: 0; font-weight: 500;">Review your selected eBooks'
);

// 3. Cart Item Card to glassmorphic
html = html.replace(
  '.cart-item-card {\r\n              background: #ffffff;\r\n              border-radius: 14px;\r\n              padding: 12px;\r\n              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);',
  '.cart-item-card {\r\n              background: rgba(255, 255, 255, 0.08);\r\n              border: 1px solid rgba(244, 180, 0, 0.5);\r\n              border-radius: 14px;\r\n              padding: 12px;\r\n              box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);\r\n              backdrop-filter: blur(12px);'
);

// 4. Cart Item Title, Sub, Price colors to white
html = html.replace(
  '.cart-item-title {\r\n              font-size: 14px;\r\n              font-weight: 600;\r\n              color: #0f172a;',
  '.cart-item-title {\r\n              font-size: 14px;\r\n              font-weight: 600;\r\n              color: #ffffff;'
);
html = html.replace(
  '.cart-item-sub {\r\n              font-size: 12px;\r\n              color: #64748b;',
  '.cart-item-sub {\r\n              font-size: 12px;\r\n              color: rgba(255,255,255,0.7);'
);

// 5. Cart Summary Card to glassmorphic
html = html.replace(
  '.cart-summary-card {\r\n              background: #fff;\r\n              border-radius: 14px;\r\n              padding: 20px;\r\n              box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);',
  '.cart-summary-card {\r\n              background: rgba(255, 255, 255, 0.08);\r\n              border: 1px solid rgba(244, 180, 0, 0.5);\r\n              border-radius: 14px;\r\n              padding: 20px;\r\n              box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);\r\n              backdrop-filter: blur(12px);'
);

// 6. Summary Title, Row, Total colors to white
html = html.replace(
  '.cart-summary-title {\r\n              font-size: 16px;\r\n              font-weight: 700;\r\n              color: #0f172a;',
  '.cart-summary-title {\r\n              font-size: 16px;\r\n              font-weight: 700;\r\n              color: #ffffff;'
);
html = html.replace(
  '.cart-summary-row {\r\n              display: flex;\r\n              justify-content: space-between;\r\n              font-size: 14px;\r\n              color: #64748b;',
  '.cart-summary-row {\r\n              display: flex;\r\n              justify-content: space-between;\r\n              font-size: 14px;\r\n              color: rgba(255,255,255,0.7);'
);
html = html.replace(
  '.cart-summary-total {\r\n              display: flex;\r\n              justify-content: space-between;\r\n              font-size: 16px;\r\n              font-weight: 700;\r\n              color: #0f172a;',
  '.cart-summary-total {\r\n              display: flex;\r\n              justify-content: space-between;\r\n              font-size: 16px;\r\n              font-weight: 700;\r\n              color: #ffffff;'
);

// 7. Icon background
html = html.replace(
  '.cart-item-icon {\r\n              width: 44px;\r\n              height: 44px;\r\n              border-radius: 10px;\r\n              background: #f1f5f9;',
  '.cart-item-icon {\r\n              width: 44px;\r\n              height: 44px;\r\n              border-radius: 10px;\r\n              background: rgba(255,255,255,0.1);'
);

// 8. Summary total border
html = html.replace(
  'border-top: 1px solid #f1f5f9;',
  'border-top: 1px solid rgba(255,255,255,0.1);'
);

// 9. Empty state headings
html = html.replace(
  'h3 style="font-size: 18px; font-weight: 600; color: #0f172a; margin: 0 0 8px 0;">Your cart is empty',
  'h3 style="font-size: 18px; font-weight: 600; color: #ffffff; margin: 0 0 8px 0;">Your cart is empty'
);

fs.writeFileSync('frontend/web/index.html', html, 'utf8');
console.log('Done: Cart section visibility fixed with dark glassmorphic theme.');
