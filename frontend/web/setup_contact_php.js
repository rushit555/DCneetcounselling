const fs = require('fs');
let data = fs.readFileSync('index.html', 'utf8');

// Replace the inline onsubmit handler
data = data.replace(/<form id="contactForm" onsubmit="event.preventDefault\(\); alert\('Message sent successfully!'\);">/, '<form id="contactForm">');

// Add name attributes
data = data.replace('<input type="text" placeholder="Your Name" required class="cp-input" />', '<input type="text" name="name" placeholder="Your Name" required class="cp-input" />');
data = data.replace('<input type="email" placeholder="Your Email" required class="cp-input" />', '<input type="email" name="email" placeholder="Your Email" required class="cp-input" />');
data = data.replace('<textarea placeholder="Your Message" required class="cp-input"></textarea>', '<textarea name="message" placeholder="Your Message" required class="cp-input"></textarea>');

// If it already has the script, don't add it again.
if (!data.includes("document.getElementById('contactForm').addEventListener('submit'")) {
    const script = `
<script>
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Change button to show loading state
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;

    try {
        const formData = new FormData(this);
        const res = await fetch('contact.php', { method: 'POST', body: formData });
        const text = await res.text();
        
        if (text.trim() === 'success') {
            alert('Message sent successfully!');
            this.reset();
        } else {
            alert('Error sending message. Please try again.');
        }
    } catch (err) {
        alert('Network error. Please try again.');
        console.error(err);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
});
</script>
</body>`;
    data = data.replace('</body>', script);
}

fs.writeFileSync('index.html', data);
console.log('index.html updated successfully with PHP backend connection.');
