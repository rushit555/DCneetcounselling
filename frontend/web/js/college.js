// College Info Page Components and Logic

window.collegeDataCache = window.collegeDataCache || {};

// SVG placeholder – lightweight, always works, never breaks the UI
var COLLEGE_PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='400' viewBox='0 0 1200 400'%3E%3Crect width='1200' height='400' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Poppins,sans-serif' font-size='28' fill='%2394a3b8'%3ENo Image Available%3C/text%3E%3C/svg%3E";

async function loadCollegeData(slug) {
  if (window.collegeDataCache[slug]) {
    const data = window.collegeDataCache[slug];
    renderCollegePage(data.college, data.fees, data.facilities, data.hospitalInfo, data.cutoffs, data.gallery, data.prosCons);
    return;
  }

  try {
    const { data: college, error } = await window.supabaseClient
      .from('colleges')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !college) {
      document.getElementById('college-content').innerHTML = '<p style="text-align:center; padding: 50px;">College not found.</p>';
      return;
    }

    // Fetch related data in parallel
    const [
      { data: fees },
      { data: facilities },
      { data: hospitalInfo },
      { data: cutoffs },
      { data: gallery },
      { data: prosCons }
    ] = await Promise.all([
      window.supabaseClient.from('fees_structure').select('*').eq('college_id', college.id),
      window.supabaseClient.from('facilities').select('*').eq('college_id', college.id).single(),
      window.supabaseClient.from('hospital_info').select('*').eq('college_id', college.id).single(),
      window.supabaseClient.from('cutoffs').select('*').eq('college_id', college.id).order('year', { ascending: false }),
      window.supabaseClient.from('gallery').select('*').eq('college_id', college.id),
      window.supabaseClient.from('pros_cons').select('*').eq('college_id', college.id)
    ]);

    window.collegeDataCache[slug] = {
      college, fees, facilities, hospitalInfo, cutoffs, gallery, prosCons
    };

    renderCollegePage(college, fees, facilities, hospitalInfo, cutoffs, gallery, prosCons);
  } catch (err) {
    console.error('Error loading college data:', err);
    document.getElementById('college-content').innerHTML = '<p style="text-align:center; padding: 50px;">Error loading college data.</p>';
  }
}

function renderCollegeHero(college) {
  var heroSrc = college.main_image || COLLEGE_PLACEHOLDER_IMG;
  return `
    <style>
      .ch-container {
        display: grid;
        grid-template-columns: 1fr;
        height: 400px;
        border-radius: 20px;
        overflow: hidden;
        margin-bottom: 24px;
        background: #f8fafc;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      }
      .ch-img-layer {
        grid-column: 1 / -1;
        grid-row: 1 / -1;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-end;
      }
      .ch-img-layer img {
        width: 60%;
        height: 100%;
        object-fit: contain;
        object-position: right center;
      }
      .ch-content-layer {
        grid-column: 1 / -1;
        grid-row: 1 / -1;
        width: 55%;
        padding: 40px;
        background: linear-gradient(to right, #ffffff 80%, rgba(255,255,255,0) 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        z-index: 10;
      }
      .ch-badge {
        background: #1e3a8a;
        color: #ffffff;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 700;
        width: max-content;
        margin-bottom: 16px;
      }
      .ch-title {
        font-size: 38px;
        font-weight: 800;
        color: #1e3a8a;
        margin: 0 0 8px 0;
        line-height: 1.2;
      }
      .ch-subtitle {
        color: #64748b;
        font-size: 16px;
        margin: 0 0 20px 0;
        font-weight: 500;
      }
      .ch-location {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #334155;
        font-weight: 600;
        font-size: 15px;
        margin-bottom: 24px;
      }
      .ch-info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      .ch-info-item {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #475569;
        font-size: 14px;
        font-weight: 500;
      }
      .ch-icon-box {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: #eff6ff;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #3b82f6;
      }
      @media (max-width: 768px) {
        .ch-container {
          display: flex;
          flex-direction: column;
          height: auto;
        }
        .ch-img-layer {
          width: 100%;
          height: 250px;
          order: 1;
        }
        .ch-img-layer img {
          width: 100%;
        }
        .ch-content-layer {
          width: 100%;
          padding: 24px;
          background: #ffffff;
          order: 2;
        }
        .ch-title {
          font-size: 28px;
        }
        .ch-info-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
    <div class="ch-container">
      <div class="ch-img-layer">
        <img src="${heroSrc}" alt="${college.name}" loading="lazy" onerror="this.onerror=null;this.src='${COLLEGE_PLACEHOLDER_IMG}';" />
      </div>
      <div class="ch-content-layer">
        <div class="ch-badge">NEET 2026</div>
        <h1 class="ch-title">${college.name}</h1>
        <p class="ch-subtitle">Premier Medical Education & Research Institute</p>
        
        <div class="ch-location">
          <i class="fa-solid fa-location-dot" style="color: #ef4444;"></i>
          ${college.location || 'Unknown'}, ${college.state || ''}
        </div>
        
        <div class="ch-info-grid">
          <div class="ch-info-item">
            <div class="ch-icon-box"><i class="fa-solid fa-building-columns"></i></div>
            ${college.type || 'Government'}
          </div>
          <div class="ch-info-item">
            <div class="ch-icon-box"><i class="fa-solid fa-calendar-alt"></i></div>
            Est. ${college.established_year || 'N/A'}
          </div>
          <div class="ch-info-item">
            <div class="ch-icon-box"><i class="fa-solid fa-stethoscope"></i></div>
            MBBS, MD, MS
          </div>
          <div class="ch-info-item">
            <div class="ch-icon-box"><i class="fa-solid fa-users"></i></div>
            100+ Seats
          </div>
        </div>
      </div>
    </div>
  `;
}


function renderAboutAndFees(college, fees) {
  let aboutHtml = `
    <div style="background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); display: flex; flex-direction: column; height: 100%;">
      <h2 style="font-size: 20px; font-weight: 700; color: #1e293b; margin-top: 0; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-circle-info" style="color: #3b82f6;"></i> About College
      </h2>
      <p style="color: #475569; line-height: 1.7; font-size: 15px; margin: 0; flex-grow: 1;">${college.description || 'No description available.'}</p>
    </div>
  `;

  let feesRows = '';
  let total = 0;
  if (fees && fees.length > 0) {
    total = fees.reduce((sum, item) => sum + Number(item.fees), 0);
    feesRows = fees.map(item => `
      <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
        <span style="color: #475569; font-weight: 500;">${item.category}</span>
        <span style="color: #0f172a; font-weight: 600;">₹${Number(item.fees).toLocaleString('en-IN')}</span>
      </div>
    `).join('');
  } else {
    feesRows = `<p style="color: #64748b; font-size: 14px; text-align: center; padding: 20px 0;">Fee details not available.</p>`;
  }

  let feesHtml = `
    <div style="background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); display: flex; flex-direction: column; height: 100%;">
      <h2 style="font-size: 20px; font-weight: 700; color: #1e293b; margin-top: 0; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-wallet" style="color: #10b981;"></i> Fees Structure
      </h2>
      <div style="flex-grow: 1;">
        ${feesRows}
      </div>
      <div style="margin-top: 16px; background: #ecfdf5; padding: 16px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #a7f3d0;">
        <span style="font-weight: 700; color: #065f46;">Estimated Total</span>
        <span style="font-size: 18px; font-weight: 800; color: #059669; background: #fff; padding: 4px 12px; border-radius: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">₹${total.toLocaleString('en-IN')}</span>
      </div>
    </div>
  `;

  return `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 32px;">
      ${aboutHtml}
      ${feesHtml}
    </div>
  `;
}

function renderFacilitiesAndHospital(facilities, hospitalInfo) {
  const list = [];
  if (facilities) {
    [
      { name: 'Hostel', value: facilities.hostel, icon: 'fa-bed' },
      { name: 'Mess', value: facilities.mess, icon: 'fa-utensils' },
      { name: 'Library', value: facilities.library, icon: 'fa-book' },
      { name: 'Sports', value: facilities.sports, icon: 'fa-basketball' },
      { name: 'WiFi', value: facilities.wifi, icon: 'fa-wifi' }
    ].forEach(item => {
      if (item.value && item.value.toLowerCase() !== 'no') list.push(item);
    });
  }

  let facHtml = `
    <div style="background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); height: 100%;">
      <h2 style="font-size: 20px; font-weight: 700; color: #1e293b; margin-top: 0; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-building" style="color: #6366f1;"></i> Facilities
      </h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 12px;">
        ${list.length ? list.map(item => `
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; transition: all 0.2s;" onmouseover="this.style.borderColor='#818cf8';this.style.backgroundColor='#eef2ff';" onmouseout="this.style.borderColor='#e2e8f0';this.style.backgroundColor='#f8fafc';">
            <i class="fa-solid ${item.icon}" style="color: #6366f1; font-size: 24px; margin-bottom: 8px;"></i>
            <span style="font-weight: 600; color: #334155; font-size: 14px;">${item.name}</span>
          </div>
        `).join('') : '<p style="color: #64748b; font-size: 14px; text-align: center; padding: 20px 0; width: 100%;">Details not available.</p>'}
      </div>
    </div>
  `;

  let hospHtml = `
    <div style="background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); height: 100%;">
      <h2 style="font-size: 20px; font-weight: 700; color: #1e293b; margin-top: 0; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-hospital" style="color: #ef4444;"></i> Hospital Info
      </h2>
      <div style="display: grid; grid-template-columns: 1fr; gap: 16px;">
        <div style="display: flex; align-items: center; padding: 16px; background: #fef2f2; border-radius: 12px; border: 1px solid #fecaca;">
          <div style="width: 48px; height: 48px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <i class="fa-solid fa-bed-pulse" style="color: #ef4444; font-size: 20px;"></i>
          </div>
          <div>
            <div style="font-size: 13px; color: #7f1d1d; text-transform: uppercase; font-weight: 600;">Bed Count</div>
            <div style="font-size: 16px; font-weight: 700; color: #991b1b;">${hospitalInfo?.bed_count || 'N/A'}</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; padding: 16px; background: #f0fdf4; border-radius: 12px; border: 1px solid #bbf7d0;">
          <div style="width: 48px; height: 48px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <i class="fa-solid fa-users" style="color: #10b981; font-size: 20px;"></i>
          </div>
          <div>
            <div style="font-size: 13px; color: #14532d; text-transform: uppercase; font-weight: 600;">Patient Flow</div>
            <div style="font-size: 16px; font-weight: 700; color: #166534;">${hospitalInfo?.patient_flow || 'N/A'}</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; padding: 16px; background: #f3e8ff; border-radius: 12px; border: 1px solid #e9d5ff;">
          <div style="width: 48px; height: 48px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <i class="fa-solid fa-user-doctor" style="color: #9333ea; font-size: 20px;"></i>
          </div>
          <div>
            <div style="font-size: 13px; color: #581c87; text-transform: uppercase; font-weight: 600;">Internship</div>
            <div style="font-size: 16px; font-weight: 700; color: #6b21a8;">${hospitalInfo?.internship || 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  `;

  return `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 32px;">
      ${facHtml}
      ${hospHtml}
    </div>
  `;
}

function renderThreeCardsGrid(cutoffs) {
  let cardStyle = "background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); display: flex; flex-direction: column;";
  let titleStyle = "font-size: 18px; font-weight: 700; color: #1e293b; margin-top: 0; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;";

  return `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-bottom: 32px;">
      <div style="${cardStyle}">
        <h2 style="${titleStyle}">
          <i class="fa-solid fa-book-open" style="color: #0ea5e9;"></i> Courses Offered
        </h2>
        <div style="display: flex; flex-direction: column; gap: 12px; flex-grow: 1; justify-content: center;">
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f8fafc; border-radius: 8px;">
            <i class="fa-solid fa-stethoscope" style="color: #0ea5e9; font-size: 20px;"></i>
            <div>
              <div style="font-weight: 600; color: #1e293b; font-size: 15px;">MBBS</div>
              <div style="font-size: 13px; color: #64748b;">Undergraduate • 5.5 Yrs</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f8fafc; border-radius: 8px;">
            <i class="fa-solid fa-microscope" style="color: #0ea5e9; font-size: 20px;"></i>
            <div>
              <div style="font-weight: 600; color: #1e293b; font-size: 15px;">MD / MS</div>
              <div style="font-size: 13px; color: #64748b;">Postgraduate • 3 Yrs</div>
            </div>
          </div>
        </div>
      </div>
      <div style="${cardStyle}">
        <h2 style="${titleStyle}">
          <i class="fa-solid fa-chalkboard-user" style="color: #ec4899;"></i> Faculty Profile
        </h2>
         <div style="display: flex; flex-direction: column; gap: 16px; flex-grow: 1; justify-content: center;">
            <div style="display: flex; align-items: center; gap: 16px;">
               <div style="width: 50px; height: 50px; background: #fbcfe8; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <i class="fa-solid fa-user-tie" style="color: #be185d; font-size: 20px;"></i>
               </div>
               <div>
                  <div style="font-weight: 700; color: #1e293b; font-size: 20px;">150+</div>
                  <div style="font-size: 14px; color: #64748b; font-weight: 500;">Experienced Doctors</div>
               </div>
            </div>
            <div style="display: flex; align-items: center; gap: 16px;">
               <div style="width: 50px; height: 50px; background: #fbcfe8; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <i class="fa-solid fa-graduation-cap" style="color: #be185d; font-size: 20px;"></i>
               </div>
               <div>
                  <div style="font-weight: 700; color: #1e293b; font-size: 20px;">12:1</div>
                  <div style="font-size: 14px; color: #64748b; font-weight: 500;">Student-Faculty Ratio</div>
               </div>
            </div>
        </div>
      </div>
    </div>
  `;
}


function renderGalleryGridUpdated(gallery) {
  if (!gallery || gallery.length === 0) return '';
  var images = gallery.slice(0, 4);
  
  return `
    <div style="margin-bottom: 32px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #1e293b; margin-top: 0; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-images" style="color: #8b5cf6;"></i> Campus Gallery
      </h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        ${images.map(function(img) {
          var imgSrc = img.image_url || COLLEGE_PLACEHOLDER_IMG;
          return `
          <div style="border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <img src="${imgSrc}"
                 alt="Campus photo"
                 loading="lazy"
                 onerror="this.onerror=null;this.src='${COLLEGE_PLACEHOLDER_IMG}';"
                 style="width: 100%; height: 180px; object-fit: cover; display: block; transition: transform 0.4s ease;"
                 onmouseover="this.style.transform='scale(1.08)'"
                 onmouseout="this.style.transform='scale(1)'" />
          </div>
        `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderProsConsUpdated(prosCons) {
  if (!prosCons || prosCons.length === 0) return '';
  
  const pros = prosCons.filter(item => item.type === 'pro');
  const cons = prosCons.filter(item => item.type === 'con');

  return `
    <div style="margin-bottom: 32px;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
        <div style="background: #fff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); padding: 24px; border-radius: 16px; border-top: 4px solid #22c55e;">
          <h3 style="color: #15803d; margin: 0 0 20px; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
            <div style="background: #dcfce7; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <i class="fa-solid fa-check" style="color: #16a34a; font-size: 18px;"></i>
            </div>
            Pros
          </h3>
          <ul style="margin: 0; padding: 0; list-style: none;">
            ${pros.map(item => `
              <li style="margin-bottom: 12px; display: flex; gap: 10px; align-items: flex-start;">
                <i class="fa-solid fa-circle-check" style="color: #22c55e; margin-top: 3px;"></i>
                <span style="color: #334155; font-size: 15px; line-height: 1.5;">${item.text}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        <div style="background: #fff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); padding: 24px; border-radius: 16px; border-top: 4px solid #ef4444;">
          <h3 style="color: #b91c1c; margin: 0 0 20px; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
            <div style="background: #fee2e2; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <i class="fa-solid fa-xmark" style="color: #dc2626; font-size: 18px;"></i>
            </div>
            Cons
          </h3>
          <ul style="margin: 0; padding: 0; list-style: none;">
            ${cons.map(item => `
              <li style="margin-bottom: 12px; display: flex; gap: 10px; align-items: flex-start;">
                <i class="fa-solid fa-circle-xmark" style="color: #ef4444; margin-top: 3px;"></i>
                <span style="color: #334155; font-size: 15px; line-height: 1.5;">${item.text}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    </div>
  `;
}

function renderFinalVerdict() {
  return `
    <div style="background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%); border-radius: 16px; padding: 32px; color: #fff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); position: relative; overflow: hidden; margin-bottom: 40px;">
      <div style="position: absolute; top: -20px; right: -20px; opacity: 0.1;">
        <i class="fa-solid fa-scale-balanced" style="font-size: 150px;"></i>
      </div>
      <div style="position: relative; z-index: 1;">
        <div style="display: inline-block; background: #fbbf24; color: #78350f; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; padding: 6px 16px; border-radius: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          Best for Rank: Under AIR 100
        </div>
        <h2 style="font-size: 24px; font-weight: 700; margin: 0 0 24px; display: flex; align-items: center; gap: 12px;">
          <i class="fa-solid fa-gavel"></i> Final Verdict
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(4px);">
            <h4 style="color: #a7f3d0; margin: 0 0 12px; font-size: 16px; display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-thumbs-up"></i> Best For</h4>
            <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #f1f5f9;">Students looking for top-tier clinical exposure, modern infrastructure, and excellent faculty guidance.</p>
          </div>
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(4px);">
            <h4 style="color: #fca5a5; margin: 0 0 12px; font-size: 16px; display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-thumbs-down"></i> Avoid If</h4>
            <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #f1f5f9;">You prefer a highly peaceful campus away from the city center, or if your rank is above AIR 5000.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCollegePage(college, fees, facilities, hospitalInfo, cutoffs, gallery, prosCons) {
  const container = document.getElementById('college-content');
  
  container.style.maxWidth = '1200px';
  container.style.margin = '0 auto';
  
  let html = renderCollegeHero(college);
  
  html += '<div style="padding: 0 16px;">';
  html += renderAboutAndFees(college, fees);
  html += renderFacilitiesAndHospital(facilities, hospitalInfo);
  html += renderThreeCardsGrid(cutoffs);
  html += renderGalleryGridUpdated(gallery);
  html += renderProsConsUpdated(prosCons);
  html += renderFinalVerdict();
  html += '</div>';
  
  container.innerHTML = html;
}

