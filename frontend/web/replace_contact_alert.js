const fs = require('fs');
let data = fs.readFileSync('index.html', 'utf8');

// 1. Remove the old script
data = data.replace(/<script>\s*document\.getElementById\('contactForm'\)\.addEventListener\('submit', async function\(e\).*?<\/script>\s*<\/body>/s, '</body>');

// 2. Add the message div below the button
if (!data.includes('id="contactFormStatus"')) {
    data = data.replace(
        /<button type="submit" class="cp-submit">\s*Send Message <i class="fa-solid fa-paper-plane"><\/i>\s*<\/button>/,
        `<button type="submit" class="cp-submit">
                  Send Message <i class="fa-solid fa-paper-plane"></i>
                </button>
                <div id="contactFormStatus" style="display: none; padding: 12px; margin-top: 15px; border-radius: 8px; font-weight: 600; text-align: center; font-size: 0.95rem;"></div>`
    );
}

// 3. Add the new script
const script = `
<script>
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const btn = this.querySelector('button[type="submit"]');
    const statusDiv = document.getElementById('contactFormStatus');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;
    statusDiv.style.display = 'none';

    try {
        const formData = new FormData(this);
        const res = await fetch('contact.php', { method: 'POST', body: formData });
        const text = await res.text();
        
        statusDiv.style.display = 'block';
        if (text.trim() === 'success') {
            statusDiv.style.backgroundColor = '#ecfdf5';
            statusDiv.style.color = '#059669';
            statusDiv.style.border = '1px solid #10b981';
            statusDiv.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message sent successfully! We will get back to you shortly.';
            this.reset();
            
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        } else {
            statusDiv.style.backgroundColor = '#fef2f2';
            statusDiv.style.color = '#dc2626';
            statusDiv.style.border = '1px solid #ef4444';
            statusDiv.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Error sending message. Please try again.';
        }
    } catch (err) {
        statusDiv.style.display = 'block';
        statusDiv.style.backgroundColor = '#fef2f2';
        statusDiv.style.color = '#dc2626';
        statusDiv.style.border = '1px solid #ef4444';
        statusDiv.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Network error. Please try again later.';
        console.error(err);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
});
</script>
</body>`;

data = data.replace('</body>', script);
fs.writeFileSync('index.html', data);
console.log('index.html updated with inline success message.');
