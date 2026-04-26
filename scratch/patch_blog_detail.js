const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'frontend', 'web', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');
const lines = content.split('\n');

// Blog detail section: lines 8032-8113
const startLine = 8032;
const endLine = 8113;

const newBlogDetail = `    <div id="section-blog-detail" class="page-section" style="display: none;">
      <style>
        .bd-wrapper {
          max-width: 780px;
          margin: 0 auto;
          padding: 90px 20px 60px;
        }
        .bd-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 14px;
          text-decoration: none;
          font-weight: 500;
          margin-bottom: 32px;
          padding: 8px 18px;
          background: #f8fafc;
          border-radius: 30px;
          transition: all 0.2s;
        }
        .bd-back:hover { background: #e2e8f0; color: #334155; }
        .bd-meta-row {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .bd-cat-badge {
          font-size: 12px;
          font-weight: 700;
          color: #6366f1;
          background: #eef2ff;
          padding: 6px 16px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .bd-date-text {
          font-size: 14px;
          color: #94a3b8;
          font-weight: 500;
        }
        .bd-title {
          font-size: 38px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 28px;
          line-height: 1.2;
        }
        .bd-cover {
          width: 100%;
          height: auto;
          max-height: 440px;
          object-fit: cover;
          border-radius: 18px;
          margin-bottom: 40px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
        }
        .bd-content {
          font-size: 17px;
          line-height: 1.9;
          color: #334155;
        }
        .bd-content h1, .bd-content h2, .bd-content h3 {
          color: #0f172a;
          margin-top: 2em;
          margin-bottom: 0.8em;
          font-weight: 700;
        }
        .bd-content h2 { font-size: 24px; }
        .bd-content h3 { font-size: 20px; }
        .bd-content p { margin-bottom: 1.5em; }
        .bd-content a { color: #6366f1; text-decoration: underline; }
        .bd-content ul, .bd-content ol { padding-left: 1.5em; margin-bottom: 1.5em; }
        .bd-content li { margin-bottom: 0.5em; }
        .bd-content blockquote {
          border-left: 4px solid #e2e8f0;
          padding: 16px 20px;
          color: #64748b;
          font-style: italic;
          margin: 1.5em 0;
          background: #f8fafc;
          border-radius: 0 12px 12px 0;
        }
        .bd-content img {
          max-width: 100%;
          border-radius: 12px;
          margin: 1.5em 0;
        }

        /* Share bar */
        .bd-share-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 0;
          margin-top: 32px;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 48px;
        }
        .bd-share-label {
          font-size: 14px;
          font-weight: 600;
          color: #334155;
        }
        .bd-share-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: #fff;
          cursor: pointer;
          border: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .bd-share-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .bd-share-whatsapp { background: #25d366; }
        .bd-share-twitter { background: #1da1f2; }
        .bd-share-linkedin { background: #0077b5; }
        .bd-share-copy { background: #64748b; }

        /* Related Posts */
        .bd-related-section {
          margin-top: 0;
        }
        .bd-related-title {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 24px;
        }
        .bd-related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .bd-related-card {
          background: #fff;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.06);
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .bd-related-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .bd-related-card img {
          width: 100%;
          height: 140px;
          object-fit: cover;
        }
        .bd-related-card-body {
          padding: 16px;
        }
        .bd-related-card-cat {
          font-size: 10px;
          font-weight: 700;
          color: #6366f1;
          background: #eef2ff;
          padding: 3px 10px;
          border-radius: 20px;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 8px;
        }
        .bd-related-card-title {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .bd-title { font-size: 26px; }
          .bd-related-grid { grid-template-columns: 1fr; }
          .bd-wrapper { padding: 80px 16px 40px; }
        }
      </style>

      <div class="bd-wrapper">
        <a href="javascript:void(0)" onclick="window.navigate('blog')" class="bd-back">
          <i class="fa-solid fa-arrow-left"></i> Back to Blog
        </a>

        <div id="blogDetailLoading" style="text-align: center; padding: 60px;">
          <i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color: #cbd5e1;"></i>
        </div>

        <div id="blogDetailContent" style="display: none;">
          <div class="bd-meta-row">
            <span id="bd-category" class="bd-cat-badge"></span>
            <span id="bd-date" class="bd-date-text"></span>
          </div>
          <h1 id="bd-title" class="bd-title"></h1>
          <img id="bd-image" src="" class="bd-cover" style="display:none;">
          <div id="bd-html" class="bd-content"></div>

          <!-- Share Bar -->
          <div class="bd-share-bar">
            <span class="bd-share-label">Share this article:</span>
            <button class="bd-share-btn bd-share-whatsapp" id="bdShareWA" title="Share on WhatsApp"><i class="fa-brands fa-whatsapp"></i></button>
            <button class="bd-share-btn bd-share-twitter" id="bdShareTW" title="Share on Twitter"><i class="fa-brands fa-x-twitter"></i></button>
            <button class="bd-share-btn bd-share-linkedin" id="bdShareLI" title="Share on LinkedIn"><i class="fa-brands fa-linkedin-in"></i></button>
            <button class="bd-share-btn bd-share-copy" id="bdShareCopy" title="Copy Link"><i class="fa-solid fa-link"></i></button>
          </div>

          <!-- Related Posts -->
          <div class="bd-related-section" id="bdRelatedSection" style="display:none;">
            <h3 class="bd-related-title">Related Articles</h3>
            <div class="bd-related-grid" id="bdRelatedGrid"></div>
          </div>
        </div>

        <div id="blogDetailError" style="display: none; text-align: center; padding: 60px 20px;">
          <i class="fa-solid fa-circle-exclamation" style="font-size: 48px; color: #ef4444; margin-bottom: 15px;"></i>
          <h3 style="font-size: 18px; color: #0f172a;">Article not found</h3>
          <p style="color: #64748b; font-size: 14px;">The article you are looking for does not exist or has been removed.</p>
        </div>
      </div>

      <script>
        document.addEventListener("DOMContentLoaded", function() {
          // Share buttons
          document.getElementById('bdShareWA').addEventListener('click', function() {
            window.open('https://wa.me/?text=' + encodeURIComponent(document.title + ' ' + window.location.href), '_blank');
          });
          document.getElementById('bdShareTW').addEventListener('click', function() {
            window.open('https://twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href) + '&text=' + encodeURIComponent(document.getElementById('bd-title').textContent), '_blank');
          });
          document.getElementById('bdShareLI').addEventListener('click', function() {
            window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(window.location.href), '_blank');
          });
          document.getElementById('bdShareCopy').addEventListener('click', function() {
            navigator.clipboard.writeText(window.location.href).then(function() {
              var btn = document.getElementById('bdShareCopy');
              btn.innerHTML = '<i class="fa-solid fa-check"></i>';
              setTimeout(function() { btn.innerHTML = '<i class="fa-solid fa-link"></i>'; }, 2000);
            });
          });

          const oldNav = window.navigate;
          window.navigate = async function(route) {
            if (oldNav) oldNav(route);

            if (route.startsWith('blog/') && window.currentBlogSlug) {
              const slug = window.currentBlogSlug;
              document.getElementById('blogDetailContent').style.display = 'none';
              document.getElementById('blogDetailError').style.display = 'none';
              document.getElementById('blogDetailLoading').style.display = 'block';

              try {
                const { data, error } = await window.supabaseClient
                  .from('blog_posts')
                  .select('*')
                  .eq('slug', slug)
                  .single();

                if (error || !data) throw new Error("Not found");

                document.getElementById('bd-title').textContent = data.title;
                document.getElementById('bd-category').textContent = data.category || 'General';
                document.getElementById('bd-date').textContent = new Date(data.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
                document.getElementById('bd-html').innerHTML = data.content;

                const img = document.getElementById('bd-image');
                if (data.image_url) {
                  img.src = data.image_url;
                  img.style.display = 'block';
                } else {
                  img.style.display = 'none';
                }

                document.getElementById('blogDetailLoading').style.display = 'none';
                document.getElementById('blogDetailContent').style.display = 'block';

                // Fetch related posts (same category, different slug)
                try {
                  const { data: related } = await window.supabaseClient
                    .from('blog_posts')
                    .select('title, slug, image_url, category')
                    .eq('is_published', true)
                    .neq('slug', slug)
                    .limit(3);

                  const relSection = document.getElementById('bdRelatedSection');
                  const relGrid = document.getElementById('bdRelatedGrid');
                  if (related && related.length > 0) {
                    relGrid.innerHTML = '';
                    related.forEach(function(r) {
                      var imgH = r.image_url
                        ? '<img src="' + r.image_url + '" alt="' + r.title + '">'
                        : '<div style="height:140px;background:linear-gradient(135deg,#f1f5f9,#e2e8f0);display:flex;align-items:center;justify-content:center;color:#94a3b8;"><i class="fa-solid fa-image fa-2x"></i></div>';
                      var card = document.createElement('a');
                      card.href = 'javascript:void(0)';
                      card.className = 'bd-related-card';
                      card.onclick = function() { window.navigate('blog/' + r.slug); };
                      card.innerHTML = imgH + '<div class="bd-related-card-body"><div class="bd-related-card-cat">' + (r.category || 'General') + '</div><div class="bd-related-card-title">' + r.title + '</div></div>';
                      relGrid.appendChild(card);
                    });
                    relSection.style.display = 'block';
                  } else {
                    relSection.style.display = 'none';
                  }
                } catch (e) {
                  console.log('Could not load related posts');
                }
              } catch (err) {
                document.getElementById('blogDetailLoading').style.display = 'none';
                document.getElementById('blogDetailError').style.display = 'block';
              }
            }
          };
        });
      </script>
    </div>`;

const before = lines.slice(0, startLine - 1);
const after = lines.slice(endLine);
const result = before.join('\n') + '\n' + newBlogDetail + '\n' + after.join('\n');
fs.writeFileSync(indexPath, result, 'utf8');
console.log('✅ Blog detail upgraded with share buttons + related posts!');
