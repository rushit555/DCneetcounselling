const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'frontend', 'web', 'index.html');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Lines 587-768 (1-indexed) contain the hardcoded cards + drag script
// We replace lines 587 through 768 (inclusive) with our new dynamic content
const startLine = 587; // <!-- Card 1 -->
const endLine = 768;   // </script>

const newContent = `                <!-- Dynamic cards loaded from Supabase -->
              </div>
            </div>

            <script>
              (function(){
                document.addEventListener('DOMContentLoaded', async function(){
                  var w = document.getElementById('newsTrackWrapper');
                  var t = document.getElementById('newsTrack');
                  if (!w || !t) return;

                  // Show skeleton while loading
                  t.innerHTML = '<div class="premium-news-card" style="min-height:160px;opacity:0.5;pointer-events:none"><div style="width:40px;height:40px;background:#eee;border-radius:50%;margin-bottom:15px"></div><div style="width:60%;height:14px;background:#eee;border-radius:8px;margin-bottom:12px"></div><div style="width:90%;height:18px;background:#eee;border-radius:8px;margin-bottom:8px"></div><div style="width:70%;height:18px;background:#eee;border-radius:8px"></div></div><div class="premium-news-card" style="min-height:160px;opacity:0.5;pointer-events:none"><div style="width:40px;height:40px;background:#eee;border-radius:50%;margin-bottom:15px"></div><div style="width:60%;height:14px;background:#eee;border-radius:8px;margin-bottom:12px"></div><div style="width:90%;height:18px;background:#eee;border-radius:8px;margin-bottom:8px"></div><div style="width:70%;height:18px;background:#eee;border-radius:8px"></div></div><div class="premium-news-card" style="min-height:160px;opacity:0.5;pointer-events:none"><div style="width:40px;height:40px;background:#eee;border-radius:50%;margin-bottom:15px"></div><div style="width:60%;height:14px;background:#eee;border-radius:8px;margin-bottom:12px"></div><div style="width:90%;height:18px;background:#eee;border-radius:8px;margin-bottom:8px"></div><div style="width:70%;height:18px;background:#eee;border-radius:8px"></div></div>';

                  // Fetch from Supabase
                  var colors = ['icon-blue', 'icon-green', 'icon-purple', 'icon-orange'];
                  try {
                    var resp = await window.supabaseClient
                      .from('news_updates')
                      .select('*')
                      .order('date', { ascending: false });

                    if (resp.data && resp.data.length > 0) {
                      t.innerHTML = '';
                      resp.data.forEach(function(item, i) {
                        var colorClass = colors[i % colors.length];
                        var dateObj = new Date(item.date);
                        var dateStr = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                        var icon = item.icon || 'fa-bell';

                        var card = document.createElement('a');
                        card.href = 'javascript:void(0)';
                        card.className = 'premium-news-card';

                        if (item.link) {
                          card.href = item.link;
                          card.target = '_blank';
                        } else if (item.content) {
                          card.addEventListener('click', (function(id) {
                            return function() { window.navigate('news/' + id); };
                          })(item.id));
                        }

                        var footerText = (item.link || item.content) ? 'Read Full Update' : 'Notice';

                        card.innerHTML =
                          '<div class="card-header">' +
                            '<div class="card-icon ' + colorClass + '"><i class="fa-solid ' + icon + '"></i></div>' +
                            '<div class="card-date">' + dateStr + '</div>' +
                          '</div>' +
                          '<div class="card-title">' + item.title + '</div>' +
                          '<div class="card-footer">' + footerText + ' <i class="fa-solid fa-chevron-right"></i></div>';

                        t.appendChild(card);
                      });
                    }
                  } catch (err) {
                    console.error('Failed to fetch news for slider:', err);
                  }

                  // Controlled Drag Slider
                  var isDragging = false;
                  var startX = 0;
                  var currentTranslate = 0;
                  var prevTranslate = 0;
                  var dragStartTranslate = 0;
                  var autoScrollId = null;
                  var resumeTimeout = null;

                  function getMaxScroll() {
                    return t.scrollWidth - w.clientWidth;
                  }

                  function setPosition() {
                    t.style.transform = 'translateX(' + currentTranslate + 'px)';
                  }

                  function startAutoScroll() {
                    stopAutoScroll();
                    autoScrollId = setInterval(function() {
                      var ms = getMaxScroll();
                      currentTranslate -= 1;
                      if (Math.abs(currentTranslate) >= ms) {
                        currentTranslate = 0;
                      }
                      setPosition();
                    }, 30);
                  }

                  function stopAutoScroll() {
                    clearInterval(autoScrollId);
                    autoScrollId = null;
                  }

                  function pauseAndResume() {
                    stopAutoScroll();
                    clearTimeout(resumeTimeout);
                    resumeTimeout = setTimeout(startAutoScroll, 3000);
                  }

                  // Mouse drag
                  t.addEventListener('mousedown', function(e) {
                    isDragging = true;
                    startX = e.pageX;
                    prevTranslate = currentTranslate;
                    dragStartTranslate = currentTranslate;
                    t.classList.add('is-dragging');
                    pauseAndResume();
                  });

                  document.addEventListener('mousemove', function(e) {
                    if (!isDragging) return;
                    e.preventDefault();
                    var moved = e.pageX - startX;
                    var ms = getMaxScroll();
                    currentTranslate = Math.max(Math.min(prevTranslate + moved, 0), -ms);
                    setPosition();
                  });

                  document.addEventListener('mouseup', function() {
                    if (!isDragging) return;
                    isDragging = false;
                    t.classList.remove('is-dragging');
                    prevTranslate = currentTranslate;
                    pauseAndResume();
                  });

                  t.addEventListener('mouseleave', function() {
                    if (isDragging) {
                      isDragging = false;
                      t.classList.remove('is-dragging');
                      prevTranslate = currentTranslate;
                      pauseAndResume();
                    }
                  });

                  // Touch
                  t.addEventListener('touchstart', function(e) {
                    isDragging = true;
                    startX = e.touches[0].clientX;
                    prevTranslate = currentTranslate;
                    dragStartTranslate = currentTranslate;
                    t.classList.add('is-dragging');
                    pauseAndResume();
                  }, { passive: true });

                  t.addEventListener('touchmove', function(e) {
                    if (!isDragging) return;
                    var moved = e.touches[0].clientX - startX;
                    var ms = getMaxScroll();
                    currentTranslate = Math.max(Math.min(prevTranslate + moved, 0), -ms);
                    setPosition();
                  }, { passive: false });

                  t.addEventListener('touchend', function() {
                    isDragging = false;
                    t.classList.remove('is-dragging');
                    prevTranslate = currentTranslate;
                    pauseAndResume();
                  }, { passive: true });

                  // Hover pause
                  w.addEventListener('mouseenter', stopAutoScroll);
                  w.addEventListener('mouseleave', function() {
                    if (!isDragging) pauseAndResume();
                  });

                  // Prevent link clicks after drag
                  t.addEventListener('click', function(e) {
                    if (Math.abs(currentTranslate - dragStartTranslate) > 5) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }, true);

                  // Prevent native image drag
                  t.addEventListener('dragstart', function(e) { e.preventDefault(); });

                  // Start
                  startAutoScroll();
                });
              })();
            </script>`;

// Build new file: lines before + new content + lines after
const before = lines.slice(0, startLine - 1); // lines 1..586
const after = lines.slice(endLine);           // lines 769+

const result = before.join('\n') + '\n' + newContent + '\n' + after.join('\n');
fs.writeFileSync(filePath, result, 'utf8');

console.log('✅ Patch applied successfully!');
console.log('  Replaced lines', startLine, '-', endLine, 'with dynamic Supabase slider');
