const fs = require('fs');
let data = fs.readFileSync('index.html', 'utf8');

const replacement = `      <!-- Contact Section -->
      <div id="section-contact" class="page-section" style="background-color: #f8f9fc;">
        <style>
          .contact-page-wrapper { font-family: 'Inter', sans-serif; color: #111827; padding: 80px 20px; max-width: 1100px; margin: 0 auto; }
          .cp-header { text-align: center; margin-bottom: 50px; }
          .cp-subtitle-top { display: flex; align-items: center; justify-content: center; gap: 15px; font-size: 0.85rem; font-weight: 700; color: #d97706; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; }
          .cp-subtitle-top::before, .cp-subtitle-top::after { content: ""; height: 1px; width: 40px; background-color: #d97706; opacity: 0.5; }
          .cp-title { font-size: 3.5rem; font-weight: 800; color: #0f172a; margin-bottom: 15px; }
          .cp-desc { color: #64748b; font-size: 1.1rem; max-width: 600px; margin: 0 auto; line-height: 1.6; }
          .cp-card { display: flex; background: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05); overflow: hidden; margin-bottom: 40px; flex-wrap: wrap; }
          .cp-left { background: #0f172a; color: #ffffff; padding: 50px; flex: 1; min-width: 350px; position: relative; border-radius: 24px; margin: 10px; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.2); overflow: hidden; }
          .cp-left::before { content: ""; position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: inset 0 0 0 20px rgba(255, 255, 255, 0.02), inset 0 0 0 40px rgba(255, 255, 255, 0.02); z-index: 0; }
          .cp-left-content { position: relative; z-index: 1; }
          .cp-left h2 { font-size: 2.2rem; font-weight: 700; line-height: 1.2; margin-bottom: 20px; }
          .cp-left h2 span { color: #facc15; display: block; }
          .cp-left-desc { color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
          .cp-info-item { display: flex; align-items: flex-start; gap: 20px; margin-bottom: 30px; }
          .cp-info-icon { width: 45px; height: 45px; border-radius: 50%; background: rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: center; color: #facc15; font-size: 1.1rem; flex-shrink: 0; }
          .cp-info-text h4 { font-size: 1rem; font-weight: 600; margin: 0 0 5px 0; color: #ffffff; }
          .cp-info-text p { font-size: 0.9rem; color: #cbd5e1; margin: 0; line-height: 1.5; }
          .cp-left-footer { margin-top: 40px; background: rgba(255, 255, 255, 0.05); padding: 15px 20px; border-radius: 12px; display: flex; align-items: center; gap: 15px; }
          .cp-left-footer i { color: #facc15; font-size: 1.5rem; }
          .cp-left-footer p { margin: 0; font-size: 0.8rem; color: #94a3b8; }
          .cp-left-footer p strong { display: block; color: #ffffff; font-size: 0.9rem; margin-bottom: 3px; }
          .cp-right { flex: 1.5; padding: 50px; min-width: 350px; display: flex; flex-direction: column; justify-content: center; }
          .cp-right-header { display: flex; align-items: center; gap: 20px; margin-bottom: 40px; }
          .cp-right-icon { width: 60px; height: 60px; border-radius: 50%; background: #fef3c7; color: #d97706; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
          .cp-right-title h3 { font-size: 1.8rem; font-weight: 700; margin: 0 0 5px 0; color: #0f172a; }
          .cp-right-title p { color: #64748b; margin: 0; font-size: 0.95rem; }
          .cp-form-group { position: relative; margin-bottom: 25px; }
          .cp-form-group i { position: absolute; left: 20px; top: 18px; color: #94a3b8; font-size: 1.1rem; }
          .cp-input { width: 100%; padding: 16px 20px 16px 50px; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 1rem; color: #0f172a; font-family: inherit; transition: all 0.3s ease; background: #ffffff; box-sizing: border-box; }
          .cp-input:focus { outline: none; border-color: #facc15; box-shadow: 0 0 0 4px rgba(250, 204, 21, 0.1); }
          textarea.cp-input { resize: vertical; min-height: 120px; padding-top: 16px; }
          .cp-submit { width: 100%; padding: 16px; background: linear-gradient(135deg, #facc15, #f59e0b); color: #0f172a; font-weight: 700; font-size: 1.1rem; border: none; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.3s ease; box-shadow: 0 10px 20px rgba(245, 158, 11, 0.2); }
          .cp-submit:hover { transform: translateY(-2px); box-shadow: 0 15px 25px rgba(245, 158, 11, 0.3); }
          .cp-form-footer { margin-top: 25px; text-align: center; font-size: 0.85rem; color: #94a3b8; display: flex; align-items: center; justify-content: center; gap: 8px; }
          .cp-features { display: flex; background: #ffffff; border-radius: 16px; padding: 30px; justify-content: space-between; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03); flex-wrap: wrap; gap: 20px; }
          .cp-feature { display: flex; align-items: center; gap: 15px; flex: 1; min-width: 200px; justify-content: center; border-right: 1px solid #f1f5f9; }
          .cp-feature:last-child { border-right: none; }
          .cp-feature i { font-size: 1.8rem; color: #d97706; }
          .cp-feature-text { font-size: 0.9rem; color: #64748b; }
          .cp-feature-text strong { display: block; color: #0f172a; font-weight: 600; margin-top: 2px; }
          @media (max-width: 768px) {
            .cp-card { flex-direction: column; }
            .cp-left, .cp-right { padding: 30px; margin: 0; border-radius: 0; }
            .cp-left { border-top-left-radius: 24px; border-top-right-radius: 24px; }
            .cp-right { border-bottom-left-radius: 24px; border-bottom-right-radius: 24px; }
            .cp-features { flex-direction: column; align-items: flex-start; }
            .cp-feature { border-right: none; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; width: 100%; justify-content: flex-start; }
            .cp-feature:last-child { border-bottom: none; padding-bottom: 0; }
            .cp-title { font-size: 2.5rem; }
          }
        </style>
        <div class="contact-page-wrapper">
          <div class="cp-header fade-up">
            <div class="cp-subtitle-top">GET IN TOUCH</div>
            <h1 class="cp-title">Contact Us</h1>
            <p class="cp-desc">We\\'re here to help you! Reach out to us for any queries and our expert team will get back to you.</p>
          </div>
          <div class="cp-card fade-up">
            <div class="cp-left">
              <div class="cp-left-content">
                <h2>We\\'re Here <span>To Help You</span></h2>
                <p class="cp-left-desc">Have questions about our counselling plans or need guidance? Fill the form and we\\'ll connect with you shortly.</p>
                <div class="cp-info-item">
                  <div class="cp-info-icon"><i class="fa-solid fa-phone"></i></div>
                  <div class="cp-info-text"><h4>Call Us</h4><p>+91 123 456 7890</p></div>
                </div>
                <div class="cp-info-item">
                  <div class="cp-info-icon"><i class="fa-solid fa-envelope"></i></div>
                  <div class="cp-info-text"><h4>Email Us</h4><p>support@dccounselling.com</p></div>
                </div>
                <div class="cp-info-item">
                  <div class="cp-info-icon"><i class="fa-regular fa-clock"></i></div>
                  <div class="cp-info-text"><h4>Working Hours</h4><p>Mon - Sat: 9:00 AM - 8:00 PM</p></div>
                </div>
                <div class="cp-info-item" style="margin-bottom: 0;">
                  <div class="cp-info-icon"><i class="fa-solid fa-location-dot"></i></div>
                  <div class="cp-info-text"><h4>Our Office</h4><p>123 Education Street, New Delhi,<br>India - 110001</p></div>
                </div>
                <div class="cp-left-footer">
                  <i class="fa-solid fa-shield-halved"></i>
                  <p><strong>Your Information is 100% Safe & Secure</strong>We respect your privacy and never share your details.</p>
                </div>
              </div>
            </div>
            <div class="cp-right">
              <div class="cp-right-header">
                <div class="cp-right-icon"><i class="fa-regular fa-paper-plane"></i></div>
                <div class="cp-right-title"><h3>Send Us a Message</h3><p>Fill out the form below and we will get back to you.</p></div>
              </div>
              <form id="contactForm" onsubmit="event.preventDefault(); alert('Message sent successfully!');">
                <div class="cp-form-group">
                  <i class="fa-regular fa-user"></i>
                  <input type="text" placeholder="Your Name" required class="cp-input" />
                </div>
                <div class="cp-form-group">
                  <i class="fa-regular fa-envelope"></i>
                  <input type="email" placeholder="Your Email" required class="cp-input" />
                </div>
                <div class="cp-form-group">
                  <i class="fa-solid fa-pen"></i>
                  <textarea placeholder="Your Message" required class="cp-input"></textarea>
                </div>
                <button type="submit" class="cp-submit">
                  Send Message <i class="fa-solid fa-paper-plane"></i>
                </button>
                <div class="cp-form-footer">
                  <i class="fa-solid fa-lock"></i> Your details are safe with us. We\\'ll never share your information.
                </div>
              </form>
            </div>
          </div>
          <div class="cp-features fade-up">
            <div class="cp-feature">
              <i class="fa-solid fa-shield-halved" style="color: #d97706;"></i>
              <div class="cp-feature-text">Trusted by <strong>10,000+ Students</strong></div>
            </div>
            <div class="cp-feature">
              <i class="fa-solid fa-award" style="color: #d97706;"></i>
              <div class="cp-feature-text">Expert Guidance <strong>Till Admission</strong></div>
            </div>
            <div class="cp-feature">
              <i class="fa-solid fa-headset" style="color: #d97706;"></i>
              <div class="cp-feature-text">Quick Response <strong>24/7 Support</strong></div>
            </div>
            <div class="cp-feature">
              <i class="fa-solid fa-lock" style="color: #d97706;"></i>
              <div class="cp-feature-text">100% Privacy <strong>Guaranteed</strong></div>
            </div>
          </div>
        </div>
      </div>`;

data = data.replace(/<div id="section-contact" class="page-section">[\s\S]*?<\/form>\s*<\/div>\s*<\/div>\s*<\/section>\s*<\/div>/, replacement);
fs.writeFileSync('index.html', data);
console.log('Replaced successfully.');
