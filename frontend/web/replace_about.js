const fs = require('fs');
let data = fs.readFileSync('index.html', 'utf8');

const replacementHtml = `      <!-- About Us Section -->
      <div id="section-about" class="page-section" style="background-color: #fafafa;">
        <style>
          .about-page-wrapper {
            font-family: 'Inter', sans-serif;
            color: #111827;
            padding: 80px 20px;
            max-width: 1200px;
            margin: 0 auto;
            position: relative;
          }
          .about-header {
            text-align: center;
            margin-bottom: 50px;
          }
          .ah-subtitle {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            font-size: 0.9rem;
            font-weight: 700;
            color: #111;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 10px;
          }
          .ah-subtitle::before, .ah-subtitle::after {
            content: "";
            height: 1px;
            width: 50px;
            background-color: #f59e0b;
          }
          .ah-title {
            font-size: 3.5rem;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.2;
            margin-bottom: 15px;
          }
          .ah-title span {
            color: #f59e0b;
          }
          .ah-desc {
            color: #4b5563;
            font-size: 1.15rem;
            max-width: 700px;
            margin: 0 auto;
          }

          .team-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 50px;
          }

          @media (max-width: 900px) {
            .team-grid {
              grid-template-columns: 1fr;
            }
          }

          .team-card {
            background: #ffffff;
            border: 1px solid #f1f5f9;
            border-radius: 20px;
            padding: 20px;
            display: flex;
            gap: 25px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
            position: relative;
          }

          .tc-image-placeholder {
            width: 180px;
            height: 220px;
            background-color: #fef3c7;
            border-radius: 16px;
            position: relative;
            flex-shrink: 0;
            border: 2px dashed #fcd34d;
            border-bottom-left-radius: 40px;
          }
          
          .tc-image-placeholder::after {
            content: "Upload Image (180x220)";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #d97706;
            font-size: 0.8rem;
            font-weight: 600;
            text-align: center;
          }

          .tc-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .tc-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #fef3c7;
            color: #111;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 700;
            margin-bottom: 15px;
            width: max-content;
          }

          .tc-badge i {
            color: #f59e0b;
          }

          .tc-name {
            font-size: 1.8rem;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 15px;
          }

          .tc-list {
            list-style: none;
            padding: 0;
            margin: 0 0 20px 0;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .tc-list li {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            font-size: 0.9rem;
            color: #334155;
            line-height: 1.4;
          }

          .tc-list li i {
            color: #f59e0b;
            margin-top: 3px;
            width: 16px;
            text-align: center;
          }

          .tc-social {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            background: #f59e0b;
            color: #fff;
            border-radius: 50%;
            text-decoration: none;
            font-size: 1rem;
            transition: all 0.3s ease;
          }

          .tc-social:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(245, 158, 11, 0.4);
          }

          .team-divider {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin: 40px 0;
            font-size: 1.2rem;
            font-weight: 800;
            color: #111;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .team-divider::before, .team-divider::after {
            content: "";
            height: 1px;
            width: 60px;
            background-color: #f59e0b;
            opacity: 0.5;
          }

          @media (max-width: 600px) {
            .team-card {
              flex-direction: column;
              align-items: center;
              text-align: center;
            }
            .tc-list li {
              text-align: left;
            }
            .tc-badge {
              margin: 0 auto 15px;
            }
            .ah-title {
              font-size: 2.5rem;
            }
          }
        </style>

        <div class="about-page-wrapper">
          <div class="about-header fade-up">
            <div class="ah-subtitle"><span style="color:#f59e0b;">●</span> ABOUT US <span style="color:#f59e0b;">●</span></div>
            <h1 class="ah-title">The People Behind<br><span>DC NEET Counselling</span></h1>
            <p class="ah-desc">A passionate team of experts dedicated to guiding NEET aspirants towards the right career and a successful future.</p>
          </div>

          <!-- Founders Row -->
          <div class="team-grid fade-up">
            <!-- Founder 1 -->
            <div class="team-card">
              <div class="tc-image-placeholder" style="background-image: url('assets/chetan_sen_placeholder.png'); background-size: cover; background-position: center;"></div>
              <div class="tc-content">
                <div class="tc-badge"><i class="fa-solid fa-crown"></i> FOUNDER & CEO</div>
                <h3 class="tc-name">Dr. Chetan Sen</h3>
                <ul class="tc-list">
                  <li><i class="fa-solid fa-graduation-cap"></i> BAMS Intern, GAC Junagadh</li>
                  <li><i class="fa-solid fa-briefcase"></i> 5+ Years Experience</li>
                  <li><i class="fa-solid fa-star"></i> MBBS BDS BAMS BVSc Expert</li>
                </ul>
                <div>
                  <a href="#" class="tc-social"><i class="fa-brands fa-linkedin-in"></i></a>
                </div>
              </div>
            </div>

            <!-- Founder 2 -->
            <div class="team-card">
              <div class="tc-image-placeholder" style="background-image: url('assets/rahul_saini_placeholder.png'); background-size: cover; background-position: center;"></div>
              <div class="tc-content">
                <div class="tc-badge"><i class="fa-solid fa-user"></i> CO-FOUNDER</div>
                <h3 class="tc-name">Dr. Rahul Saini</h3>
                <ul class="tc-list">
                  <li><i class="fa-solid fa-graduation-cap"></i> BAMS Final Year | Expert Counsellor</li>
                  <li><i class="fa-solid fa-briefcase"></i> 4+ Years Experience</li>
                  <li><i class="fa-solid fa-star"></i> NEET & AYUSH Guidance | Proven Results</li>
                </ul>
                <div>
                  <a href="#" class="tc-social"><i class="fa-brands fa-linkedin-in"></i></a>
                </div>
              </div>
            </div>
          </div>

          <div class="team-divider fade-up">
            <span style="color:#f59e0b;">●</span> OUR TEAM <span style="color:#f59e0b;">●</span>
          </div>

          <!-- Team Row -->
          <div class="team-grid fade-up" style="margin-bottom: 20px;">
            <!-- Member 1 -->
            <div class="team-card">
              <div class="tc-image-placeholder" style="background-image: url('assets/pushpendra_sharma_placeholder.png'); background-size: cover; background-position: center;"></div>
              <div class="tc-content">
                <div class="tc-badge"><i class="fa-solid fa-user"></i> SENIOR COUNSELLOR</div>
                <h3 class="tc-name">Dr. Pushpendra Sharma</h3>
                <ul class="tc-list">
                  <li><i class="fa-solid fa-graduation-cap"></i> GMC Vadodara</li>
                  <li><i class="fa-solid fa-briefcase"></i> 5+ Years Experience</li>
                  <li><i class="fa-solid fa-star"></i> <div>Expert in MBBS Counselling<br>(Government & Private Colleges)</div></li>
                </ul>
                <div>
                  <a href="#" class="tc-social"><i class="fa-brands fa-linkedin-in"></i></a>
                </div>
              </div>
            </div>

            <!-- Member 2 -->
            <div class="team-card">
              <div class="tc-image-placeholder" style="background-image: url('assets/rushit_rupapara_placeholder.png'); background-size: cover; background-position: center;"></div>
              <div class="tc-content">
                <div class="tc-badge"><i class="fa-solid fa-user"></i> TEAM MEMBER</div>
                <h3 class="tc-name">Dr. Rushit Rupapara</h3>
                <ul class="tc-list">
                  <li><i class="fa-solid fa-briefcase"></i> Manager | Tech Expert</li>
                  <li><i class="fa-solid fa-desktop"></i> Web Dev | Data Analytics | Design</li>
                  <li><i class="fa-solid fa-star"></i> 3 Years Experience as manager</li>
                </ul>
                <div>
                  <a href="#" class="tc-social"><i class="fa-brands fa-linkedin-in"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
\n      <!-- End About Us Section -->\n      `;

const regex = /(<div id="section-about".*?)(?=\s*<div id="section-(services|contact|login|dashboard)")/s;

if (regex.test(data)) {
  data = data.replace(regex, replacementHtml);
  fs.writeFileSync('index.html', data);
  console.log('About section replaced successfully.');
} else {
  console.log('Could not find target regex to replace.');
}
