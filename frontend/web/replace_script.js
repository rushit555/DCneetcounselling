const fs=require('fs');

let c1=fs.readFileSync('index.html', 'utf8');
c1=c1.replace(/data-campaign='YOUR_CAMPAIGN_ID'/g, "data-domain='dcneetcounselling.goaffpro.com'");
fs.writeFileSync('index.html', c1);

let c2=fs.readFileSync('payment/index.html', 'utf8');
c2=c2.replace(/data-campaign='YOUR_CAMPAIGN_ID'/g, "data-domain='dcneetcounselling.goaffpro.com'");
fs.writeFileSync('payment/index.html', c2);

let c3=fs.readFileSync('thank-you/index.html', 'utf8');
c3=c3.replace(/data-campaign="YOUR_CAMPAIGN_ID"/g, "data-domain='dcneetcounselling.goaffpro.com'");
fs.writeFileSync('thank-you/index.html', c3);
