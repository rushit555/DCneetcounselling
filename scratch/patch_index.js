const fs = require('fs');
const filePath = 'c:\\\\Users\\\\rushi\\\\Downloads\\\\DCneetcounselling\\\\frontend\\\\web\\\\index.html';
let content = fs.readFileSync(filePath, 'utf-8');

const startIdx = content.indexOf('          "handler": async function (response){');
const endIdx = content.indexOf('          "prefill": {', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const newHandler = `          "handler": async function (response){
              try {
                  console.log("Razorpay Response:", response);
                  
                  var userId = (window._authUser && window._authUser.id) ? window._authUser.id : null;
                  if (!userId && window.supabaseClient) {
                      const { data } = await window.supabaseClient.auth.getUser();
                      if (data && data.user) userId = data.user.id;
                  }

                  const verifyRes = await fetch(\`\${backendUrl}/payment-success\`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                          razorpay_order_id: response.razorpay_order_id,
                          razorpay_payment_id: response.razorpay_payment_id,
                          razorpay_signature: response.razorpay_signature,
                          email: email,
                          fullName: fullName,
                          mobile: mobile,
                          ctx: ctx,
                          userId: userId
                      })
                  });

                  const data = await verifyRes.json();
                  
                  if (data.success) {
                      if (ctx && ctx.is_cart) {
                          if (window.updateCartBadge) window.updateCartBadge();
                          if (window.renderCartPage) window.renderCartPage();
                      }
                      closeEbookPurchaseModal();
                      window.navigate('thank-you');
                  } else {
                      alert(data.message || "Payment verification failed");
                  }
              } catch (err) {
                  console.error('Unexpected error in payment handler:', err);
                  alert("Server error during verification");
              }
          },
          "modal": {
              "ondismiss": function() {
                  console.log("Payment popup closed");
              }
          },
`;
    content = content.slice(0, startIdx) + newHandler + content.slice(endIdx);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Successfully updated index.html handler logic');
} else {
    console.log('Could not find the handler block in index.html');
}
