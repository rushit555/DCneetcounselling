const fs = require('fs');
const path = require('path');

// ===== 1. ADD BLOG TO HEADER =====
const headerPath = path.join(__dirname, '..', 'frontend', 'web', 'header.html');
let header = fs.readFileSync(headerPath, 'utf8');

// Desktop nav: Add Blog after Home
header = header.replace(
  `<li><a href="#" data-route="home" class="nav-pill-link" onclick="event.preventDefault(); window.navigate('home');">Home</a></li>`,
  `<li><a href="#" data-route="home" class="nav-pill-link" onclick="event.preventDefault(); window.navigate('home');">Home</a></li>\r\n                <li><a href="#" data-route="blog" class="nav-pill-link" onclick="event.preventDefault(); window.navigate('blog');">Blog</a></li>`
);

// Mobile nav: Add Blog after Home
header = header.replace(
  `<a href="#" class="md-link" data-route="home" onclick="event.preventDefault(); window.navigate('home'); document.getElementById('mobileDrawer').classList.remove('active'); document.getElementById('mobileDrawerOverlay').classList.remove('active');">Home</a>`,
  `<a href="#" class="md-link" data-route="home" onclick="event.preventDefault(); window.navigate('home'); document.getElementById('mobileDrawer').classList.remove('active'); document.getElementById('mobileDrawerOverlay').classList.remove('active');">Home</a>\r\n            <a href="#" class="md-link" data-route="blog" onclick="event.preventDefault(); window.navigate('blog'); document.getElementById('mobileDrawer').classList.remove('active'); document.getElementById('mobileDrawerOverlay').classList.remove('active');">Blog</a>`
);

fs.writeFileSync(headerPath, header, 'utf8');
console.log('✅ Blog added to header nav (desktop + mobile)');


// ===== 2. UPGRADE BLOG SECTION IN INDEX.HTML =====
const indexPath = path.join(__dirname, '..', 'frontend', 'web', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');
const lines = content.split('\n');

// Find start (line 7531: <!-- Blog Section -->) and end (line 7646: </div> closing section-blog)
const startLine = 7531;
// Find the closing </div> of section-blog
let endLine = 7646;

const newBlogSection = `    <!-- Blog Section -->
    <div id="section-blog" class="page-section" style="display: none;">
      <style>
        .blog-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%);
          padding: 80px 20px 60px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .blog-hero::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          border-radius: 50%;
        }
        .blog-hero::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%);
          border-radius: 50%;
        }
        .blog-hero h1 {
          font-size: 42px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 14px;
          position: relative;
          z-index: 1;
        }
        .blog-hero h1 span {
          background: linear-gradient(90deg, #f59e0b, #f97316);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .blog-hero p {
          font-size: 17px;
          color: #94a3b8;
          max-width: 550px;
          margin: 0 auto;
          line-height: 1.6;
          position: relative;
          z-index: 1;
        }
        .blog-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px 80px;
        }
        .blog-toolbar {
          display: flex;
          gap: 12px;
          margin-bottom: 36px;
          flex-wrap: wrap;
          align-items: center;
        }
        .blog-search-input {
          flex: 1;
          min-width: 220px;
          padding: 12px 20px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s;
          background: #fff;
        }
        .blog-search-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .blog-cat-btn {
          padding: 8px 18px;
          border: 1.5px solid #e2e8f0;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          background: #fff;
          color: #475569;
          transition: all 0.2s ease;
          font-family: inherit;
          white-space: nowrap;
        }
        .blog-cat-btn:hover {
          border-color: #6366f1;
          color: #6366f1;
        }
        .blog-cat-btn.active {
          background: #6366f1;
          color: #fff;
          border-color: #6366f1;
        }

        /* Featured Card */
        .blog-featured {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 0;
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.06);
          margin-bottom: 48px;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-decoration: none;
          color: inherit;
        }
        .blog-featured:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.1);
        }
        .blog-featured-img {
          width: 100%;
          height: 100%;
          min-height: 320px;
          object-fit: cover;
        }
        .blog-featured-img-placeholder {
          width: 100%;
          min-height: 320px;
          background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #818cf8;
          font-size: 48px;
        }
        .blog-featured-body {
          padding: 40px 36px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .blog-featured-badge {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          color: #f59e0b;
          background: #fef3c7;
          padding: 5px 14px;
          border-radius: 20px;
          margin-bottom: 16px;
          width: fit-content;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .blog-featured-title {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.3;
          margin-bottom: 14px;
        }
        .blog-featured-desc {
          font-size: 15px;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .blog-featured-meta {
          font-size: 13px;
          color: #94a3b8;
          font-weight: 500;
        }

        /* Blog Grid */
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        /* Blog Card */
        .blog-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.06);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
        }
        .blog-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
        }
        .blog-card-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        .blog-card-img-placeholder {
          width: 100%;
          height: 200px;
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 28px;
        }
        .blog-card-body {
          padding: 22px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .blog-card-cat {
          font-size: 11px;
          font-weight: 700;
          color: #6366f1;
          background: #eef2ff;
          padding: 4px 12px;
          border-radius: 20px;
          width: fit-content;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .blog-card-title {
          font-size: 17px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.4;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .blog-card-desc {
          font-size: 13px;
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 16px;
          flex-grow: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .blog-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }
        .blog-card-date {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
        }
        .blog-card-read {
          font-size: 13px;
          font-weight: 600;
          color: #6366f1;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .blog-card:hover .blog-card-read i {
          transform: translateX(3px);
        }
        .blog-card-read i {
          font-size: 10px;
          transition: transform 0.2s;
        }

        .blog-empty {
          text-align: center;
          padding: 60px 20px;
          background: #f9fafb;
          border-radius: 16px;
          grid-column: 1 / -1;
        }
        .blog-load-more {
          display: block;
          margin: 40px auto 0;
          padding: 14px 36px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: #fff;
          color: #334155;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .blog-load-more:hover {
          background: #6366f1;
          color: #fff;
          border-color: #6366f1;
        }

        @media (max-width: 900px) {
          .blog-grid { grid-template-columns: repeat(2, 1fr); }
          .blog-featured { grid-template-columns: 1fr; }
          .blog-featured-img, .blog-featured-img-placeholder { min-height: 220px; }
          .blog-featured-body { padding: 28px 24px; }
          .blog-featured-title { font-size: 22px; }
        }
        @media (max-width: 600px) {
          .blog-hero { padding: 70px 16px 40px; }
          .blog-hero h1 { font-size: 28px; }
          .blog-hero p { font-size: 14px; }
          .blog-grid { grid-template-columns: 1fr; }
          .blog-featured-title { font-size: 20px; }
          .blog-container { padding: 24px 16px 60px; }
        }
      </style>

      <!-- Hero -->
      <div class="blog-hero">
        <h1>Insights & <span>Guides</span></h1>
        <p>Latest updates, NEET counselling guides, cutoff analysis, and expert tips to help you secure your dream medical seat.</p>
      </div>

      <div class="blog-container">
        <!-- Featured Post -->
        <div id="blogFeaturedCard" style="display:none;"></div>

        <!-- Toolbar: Search + Category Filters -->
        <div class="blog-toolbar">
          <input type="text" id="blogSearchInput2" class="blog-search-input" placeholder="🔍  Search articles...">
          <button class="blog-cat-btn active" data-cat="All">All</button>
          <button class="blog-cat-btn" data-cat="Counselling Guide">Counselling Guide</button>
          <button class="blog-cat-btn" data-cat="College List">College List</button>
          <button class="blog-cat-btn" data-cat="Cutoff Analysis">Cutoff Analysis</button>
          <button class="blog-cat-btn" data-cat="Tips & Strategy">Tips & Strategy</button>
          <button class="blog-cat-btn" data-cat="NEET Updates">NEET Updates</button>
        </div>

        <!-- Blog Grid -->
        <div id="blogGrid2" class="blog-grid">
          <!-- Skeleton loaders -->
          <div class="blog-card" style="pointer-events:none;opacity:0.5"><div style="height:200px;background:#eee"></div><div style="padding:22px"><div style="width:60px;height:16px;background:#eee;border-radius:10px;margin-bottom:12px"></div><div style="width:100%;height:20px;background:#eee;border-radius:10px;margin-bottom:8px"></div><div style="width:80%;height:16px;background:#eee;border-radius:10px"></div></div></div>
          <div class="blog-card" style="pointer-events:none;opacity:0.5"><div style="height:200px;background:#eee"></div><div style="padding:22px"><div style="width:60px;height:16px;background:#eee;border-radius:10px;margin-bottom:12px"></div><div style="width:100%;height:20px;background:#eee;border-radius:10px;margin-bottom:8px"></div><div style="width:80%;height:16px;background:#eee;border-radius:10px"></div></div></div>
          <div class="blog-card" style="pointer-events:none;opacity:0.5"><div style="height:200px;background:#eee"></div><div style="padding:22px"><div style="width:60px;height:16px;background:#eee;border-radius:10px;margin-bottom:12px"></div><div style="width:100%;height:20px;background:#eee;border-radius:10px;margin-bottom:8px"></div><div style="width:80%;height:16px;background:#eee;border-radius:10px"></div></div></div>
        </div>

        <div id="blogEmptyState2" class="blog-empty" style="display:none;">
          <i class="fa-solid fa-folder-open" style="font-size:48px;color:#cbd5e1;margin-bottom:15px;"></i>
          <h3 style="font-size:18px;color:#334155;margin-bottom:8px;">No Articles Found</h3>
          <p style="color:#64748b;font-size:14px;">Try a different search term or category.</p>
        </div>

        <button id="blogLoadMore" class="blog-load-more" style="display:none;">Load More Articles</button>
      </div>

      <script>
        document.addEventListener("DOMContentLoaded", function() {
          let allBlogData = [];
          let activeCategory = 'All';
          let searchTerm = '';
          const POSTS_PER_PAGE = 6;
          let visibleCount = POSTS_PER_PAGE;

          async function fetchBlogs() {
            if (!window.supabaseClient) return;
            try {
              const { data, error } = await window.supabaseClient
                .from('blog_posts')
                .select('*')
                .eq('is_published', true)
                .order('created_at', { ascending: false });

              if (error) throw error;
              allBlogData = data || [];
              renderFeatured();
              renderBlogs();
            } catch (err) {
              console.error('Blog fetch error:', err);
              document.getElementById('blogGrid2').innerHTML = '<p style="color:red;grid-column:1/-1;text-align:center;">Failed to load articles.</p>';
            }
          }

          function renderFeatured() {
            const container = document.getElementById('blogFeaturedCard');
            if (allBlogData.length === 0) { container.style.display = 'none'; return; }
            const feat = allBlogData[0];
            const dateStr = new Date(feat.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
            const imgHtml = feat.image_url
              ? '<img class="blog-featured-img" src="' + feat.image_url + '" alt="' + feat.title + '">'
              : '<div class="blog-featured-img-placeholder"><i class="fa-solid fa-image"></i></div>';

            container.innerHTML = '<a href="javascript:void(0)" class="blog-featured" onclick="window.navigate(\\'blog/' + feat.slug + '\\')">' +
              imgHtml +
              '<div class="blog-featured-body">' +
                '<div class="blog-featured-badge">⭐ Featured</div>' +
                '<div class="blog-featured-title">' + feat.title + '</div>' +
                '<div class="blog-featured-desc">' + (feat.short_description || '') + '</div>' +
                '<div class="blog-featured-meta"><i class="fa-regular fa-calendar"></i> &nbsp;' + dateStr + ' &nbsp;&bull;&nbsp; ' + (feat.category || 'General') + '</div>' +
              '</div>' +
            '</a>';
            container.style.display = 'block';
          }

          function getFilteredBlogs() {
            return allBlogData.filter(function(item, idx) {
              if (activeCategory !== 'All' && item.category !== activeCategory) return false;
              if (searchTerm && !item.title.toLowerCase().includes(searchTerm) && !(item.short_description && item.short_description.toLowerCase().includes(searchTerm))) return false;
              return true;
            });
          }

          function renderBlogs() {
            const grid = document.getElementById('blogGrid2');
            const emptyState = document.getElementById('blogEmptyState2');
            const loadMore = document.getElementById('blogLoadMore');
            const filtered = getFilteredBlogs();

            grid.innerHTML = '';

            if (filtered.length === 0) {
              emptyState.style.display = 'block';
              loadMore.style.display = 'none';
              return;
            }
            emptyState.style.display = 'none';

            const toShow = filtered.slice(0, visibleCount);
            toShow.forEach(function(item) {
              const dateStr = new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
              const imgHtml = item.image_url
                ? '<img class="blog-card-img" src="' + item.image_url + '" alt="' + item.title + '">'
                : '<div class="blog-card-img-placeholder"><i class="fa-solid fa-image"></i></div>';

              const card = document.createElement('a');
              card.href = 'javascript:void(0)';
              card.className = 'blog-card';
              card.onclick = function() { window.navigate('blog/' + item.slug); };
              card.innerHTML =
                imgHtml +
                '<div class="blog-card-body">' +
                  '<div class="blog-card-cat">' + (item.category || 'General') + '</div>' +
                  '<div class="blog-card-title">' + item.title + '</div>' +
                  '<div class="blog-card-desc">' + (item.short_description || '') + '</div>' +
                  '<div class="blog-card-footer">' +
                    '<span class="blog-card-date">' + dateStr + '</span>' +
                    '<span class="blog-card-read">Read Article <i class="fa-solid fa-chevron-right"></i></span>' +
                  '</div>' +
                '</div>';
              grid.appendChild(card);
            });

            loadMore.style.display = filtered.length > visibleCount ? 'block' : 'none';
          }

          // Category filter
          document.querySelectorAll('.blog-cat-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
              document.querySelectorAll('.blog-cat-btn').forEach(function(b) { b.classList.remove('active'); });
              btn.classList.add('active');
              activeCategory = btn.getAttribute('data-cat');
              visibleCount = POSTS_PER_PAGE;
              renderBlogs();
            });
          });

          // Search
          document.getElementById('blogSearchInput2').addEventListener('input', function(e) {
            searchTerm = e.target.value.toLowerCase();
            visibleCount = POSTS_PER_PAGE;
            renderBlogs();
          });

          // Load More
          document.getElementById('blogLoadMore').addEventListener('click', function() {
            visibleCount += POSTS_PER_PAGE;
            renderBlogs();
          });

          fetchBlogs();

          const oldNav = window.navigate;
          window.navigate = function(route) {
            if (route === 'blog' && allBlogData.length === 0) fetchBlogs();
            if (oldNav) oldNav(route);
          };
        });
      </script>
    </div>`;

const before = lines.slice(0, startLine - 1);
const after = lines.slice(endLine);
const result = before.join('\n') + '\n' + newBlogSection + '\n' + after.join('\n');
fs.writeFileSync(indexPath, result, 'utf8');
console.log('✅ Blog section upgraded with premium design!');
