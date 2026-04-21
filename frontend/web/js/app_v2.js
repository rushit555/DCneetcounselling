// ─── Supabase Configuration ───────────────────────────────────────────────────

const SUPABASE_URL  = 'https://rlqmdylbzapyepuwncwt.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscW1keWxiemFweWVwdXduY3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTcwNzYsImV4cCI6MjA5MTgzMzA3Nn0.oNNK1pwLnykQlNfUkw7IdB-ZBkKDoWxszsKDSIjsLeo';

const COUNSELLING_META = {
    'med_basic': { title: 'Medical - Basic Plan', price: 4999, type: 'Medical' },
    'med_gold': { title: 'Medical - Gold Plan', price: 9999, type: 'Medical' },
    'med_platinum': { title: 'Medical - Private MBBS/BDS', price: 14999, type: 'Medical' },
    'ayush_basic': { title: 'AYUSH - Basic Plan', price: 4999, type: 'AYUSH' },
    'ayush_gold': { title: 'AYUSH - Gold Plan', price: 8999, type: 'AYUSH' },
    'ayush_platinum': { title: 'AYUSH - Private Plan', price: 9999, type: 'AYUSH' },
    'vet_basic': { title: 'Veterinary - Basic Plan', price: 4999, type: 'Veterinary' },
    'vet_gold': { title: 'Veterinary - Gold Plan', price: 8999, type: 'Veterinary' },
    'vet_platinum': { title: 'Veterinary - Premium Plan', price: 10999, type: 'Veterinary' },
    'combo_basic': { title: 'Combo - Basic Plan', price: 6999, type: 'Combo' },
    'combo_gold': { title: 'Combo - Gold Plan', price: 11999, type: 'Combo' },
    'combo_platinum': { title: 'Combo - Premium Plan', price: 15999, type: 'Combo' }
};


const REDIRECT_URL = window.location.href.split('#')[0].split('?')[0];

// ─── Security Utilities ──────────────────────────────────────────────────────

/**
 * XSS Sanitizer — escapes HTML entities in user-supplied strings
 * Use this before inserting any user data into innerHTML.
 */
window.sanitizeHTML = function(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

/**
 * Login Rate Limiter — prevents brute force attacks client-side.
 * Allows max 5 attempts within a 5-minute window.
 */
var _loginAttempts = [];
var LOGIN_MAX_ATTEMPTS = 5;
var LOGIN_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

function isLoginRateLimited() {
    var now = Date.now();
    // Purge old attempts outside the window
    _loginAttempts = _loginAttempts.filter(function(t) { return now - t < LOGIN_WINDOW_MS; });
    return _loginAttempts.length >= LOGIN_MAX_ATTEMPTS;
}

function recordLoginAttempt() {
    _loginAttempts.push(Date.now());
}

function getLoginLockoutRemaining() {
    if (_loginAttempts.length === 0) return 0;
    var oldest = _loginAttempts[0];
    var remaining = LOGIN_WINDOW_MS - (Date.now() - oldest);
    return Math.max(0, Math.ceil(remaining / 1000));
}

/**
 * Password validator
 * Restrictions removed as per user request.
 */
function validatePasswordStrength(pass) {
    return null; // All passwords pass
}

// ─── Core Router (Upgraded) ──────────────────────────────────────────────────
// Enhance the stub navigation with animations and dynamic features
var originalStub = window.navigate;
window.navigate = function(route) {
    if (route === 'ebooks') {
        setTimeout(function() { if (window.loadWishlistStates) window.loadWishlistStates(); }, 200);
        setTimeout(function() { if (window.loadCartStates) window.loadCartStates(); }, 250);
    }
    if (route === 'cart') {
        setTimeout(function() { if (window.renderCartPage) window.renderCartPage(); }, 200);
    }
    if (route === 'wishlist') {
        setTimeout(function() { if (window.renderWishlistPage) window.renderWishlistPage(); }, 200);
    }
    if (route === 'orders') {
        var ordersEl = document.getElementById('section-orders');
        if (ordersEl) {
            ordersEl.style.display = 'block';
            ordersEl.innerHTML = '<div style="padding:120px 20px;text-align:center;"><div class="loading-spinner"></div><br>Loading your order history...</div>';
            renderOrders().then(html => {
                if (html) ordersEl.innerHTML = html;
            }).catch(err => {
                ordersEl.innerHTML = '<div style="padding:120px 20px;text-align:center;color:#ef4444;">Failed to load orders. Please refresh.</div>';
            });
        }
    }
    if (route === 'dashboard') {
        var dashEl = document.getElementById('section-dashboard');
        if (dashEl) {
            dashEl.style.display = 'block';
            dashEl.innerHTML = '<div style="padding:120px 20px;text-align:center;"><div class="loading-spinner"></div><br>Loading your dashboard...</div>';
            renderDashboard().then(html => {
                if (html) dashEl.innerHTML = html;
            }).catch(err => {
                dashEl.innerHTML = '<div style="padding:120px 20px;text-align:center;color:#ef4444;">Failed to load dashboard. Please refresh.</div>';
            });
        }
    }
    
    if (originalStub && originalStub !== window.navigate) {
        originalStub(route);
    }
    
    // Highlight active nav link (redundant but safe)
    document.querySelectorAll('.nav-links a').forEach(function(link) {
        if (link.getAttribute('data-route') === route) link.classList.add('active');
        else link.classList.remove('active');
    });

    // Re-run animations after section switch
    setTimeout(function() {
        if (typeof initAnimations === 'function') initAnimations();
        if (typeof bindDynamicEvents === 'function') bindDynamicEvents();
    }, 50);
};



// ─── App Boot ─────────────────────────────────────────────────────────────────
window.bootApp = bootApp; // EXPOSE IMMEDIATELY
function bootApp() {

    document.body.classList.add('js-enabled');

    // ══════════════════════════════════════════════════════════════════════
    // BULLETPROOF SUPABASE INIT + SESSION PERSISTENCE
    // ══════════════════════════════════════════════════════════════════════
    // ══════════════════════════════════════════════════════════════════════
    // SUPABASE AUTH INITIALIZATION (Single Source of Truth)
    // ══════════════════════════════════════════════════════════════════════
    (function syncAuthState() {
        if (!window.supabaseClient) {
            setTimeout(syncAuthState, 100);
            return;
        }

        // Use onAuthStateChange as SINGLE SOURCE OF TRUTH
        window.supabaseClient.auth.onAuthStateChange(function(event, session) {

            if (window.updateNavForAuth) {
                window.updateNavForAuth(session);
            }
            
            // Ensure dashboard catches the loaded user session if we refreshed while on the dashboard
            if (window.location.hash === '#dashboard') {
                var dashEl = document.getElementById('section-dashboard');
                if (dashEl && typeof renderDashboard === 'function') {
                    dashEl.style.display = 'block';
                    renderDashboard().then(function(html) {
                        if (html) dashEl.innerHTML = html;
                    });
                }
            }
        });


    })();


    // Wire up ALL [data-route] elements (links and buttons)
    document.querySelectorAll('[data-route]').forEach(function(el) {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            var route = el.getAttribute('data-route');
            if (route) window.navigate(route);
        });
    });

    // Initial navigation
    var rawHash = window.location.hash;
    if (rawHash.includes('error=')) {
        var errStr = decodeURIComponent((rawHash.split('error_description=')[1] || '').split('&')[0] || rawHash);
        if (errStr.toLowerCase().includes('expire') || errStr.toLowerCase().includes('invalid')) {
            window.location.replace('/reset-password/' + window.location.hash);
        } else {
            setTimeout(() => {
                alert('Supabase Auth Error: ' + errStr);
            }, 800);
            window.navigate('login');
        }
    } else if (rawHash.includes('access_token=')) {
        // Only redirect to home if NOT a password recovery flow
        if (!rawHash.includes('type=recovery')) {
            setTimeout(() => window.navigate('home'), 1500);
        } else {
            console.log("[App] Recovery link detected, navigating to separate reset-password page.");
            window.location.replace('/reset-password/' + window.location.hash);
        }
    } else {
        window.navigate(rawHash.replace('#', '') || 'home');
    }

    // Additional setup
    initMouseEffects();
    try { setupLoginPage(); } catch(e) { console.warn('setupLoginPage:', e); }
    try { setupPredictorModal(); } catch(e) { console.warn('setupPredictorModal:', e); }
    initAnimations();

    // Expose globals
    window.signInWithGoogle = signInWithGoogle;
    window.simulatePrediction = simulatePrediction;
    window.resetPredictor = resetPredictor;
}

// ─── Dynamic Event Binding ────────────────────────────────────────────────────
function bindDynamicEvents() {
    var heroBtn = document.getElementById('heroPredictorBtn');
    if (heroBtn && !heroBtn._bound) {
        heroBtn._bound = true;
        heroBtn.addEventListener('click', function() {
            document.getElementById('predictorModal').style.display = 'block';
            document.getElementById('modalOverlay').style.display = 'block';
        });
    }
}

// ─── Animations ───────────────────────────────────────────────────────────────
function initAnimations() {
    var fadeUpEls = document.querySelectorAll('.fade-up, .stagger-in');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    fadeUpEls.forEach(function(el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('visible');
        } else if (!el.classList.contains('visible')) {
            observer.observe(el);
        }
    });


    // Small delay to ensure browser has completed initial layout
    setTimeout(function() {
        initCounters();
        // initTiltEffects(); // Disabled as per user request to keep cards static
        initCarousel();
    }, 150);
}

function initCarousel() {
    var track = document.getElementById('newsCarouselTrack');
    var leftBtn = document.getElementById('newsCarouselLeft');
    var rightBtn = document.getElementById('newsCarouselRight');
    if (!track) return;
    
    if (track._carouselInit) return;
    track._carouselInit = true;

    var scrollAmt = 300; 

    if (leftBtn) {
        leftBtn.addEventListener('click', function() { 
            if (track.scrollLeft <= 0) {
                track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: -scrollAmt, behavior: 'smooth' }); 
            }
        });
    }

    var scrollRight = function() {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            track.scrollBy({ left: scrollAmt, behavior: 'smooth' });
        }
    };

    if (rightBtn) {
        rightBtn.addEventListener('click', scrollRight);
    }

    // Interval logic: 2500ms
    if (window._newsCarouselInterval) clearInterval(window._newsCarouselInterval);
    window._newsCarouselInterval = setInterval(scrollRight, 2500);

    // Pause on Hover
    var wrapper = document.querySelector('.carousel-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', function() { clearInterval(window._newsCarouselInterval); });
        wrapper.addEventListener('mouseleave', function() {
            clearInterval(window._newsCarouselInterval);
            window._newsCarouselInterval = setInterval(scrollRight, 2500);
        });
    }
}

function initMouseEffects() {
    var glow = document.getElementById('cursor-glow');
    if (!glow) return;
    document.addEventListener('mousemove', function(e) {
        glow.style.opacity = '1';
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', function() { glow.style.opacity = '0'; });
}

function initTiltEffects() {
    var cards = document.querySelectorAll('.glass-panel:not(#predictorModal)');
    cards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var cx = rect.width / 2;
            var cy = rect.height / 2;
            card.style.transform = 'perspective(1000px) rotateX(' + ((y - cy) / 20) + 'deg) rotateY(' + ((cx - x) / 20) + 'deg) scale3d(1.02,1.02,1.02)';
        });
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
        });
    });
}

function initCounters() {
    var counters = document.querySelectorAll('.counter-val');

    counters.forEach(function(c, i) {
        // Disconnect previous observer to avoid multiple running instances on nav swap
        if (c._counterObs) {
            c._counterObs.disconnect();
        }

        var targetValue = parseInt(c.getAttribute('data-target'));
        
        if (isNaN(targetValue)) {
            console.warn("Counter", i, "has invalid target:", c.getAttribute('data-target'));
            return;
        }

        var obs = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {

                    var delay = 100 + i * 150;
                    setTimeout(function() {
                        animateValue(entry.target, 0, targetValue, 2000);
                    }, delay);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5, rootMargin: '0px 0px -50px 0px' }); // Trigger only when fully visible in viewport
        
        c._counterObs = obs;
        obs.observe(c);
    });
}

function animateValue(el, start, end, duration) {
    // Prevent overlapping duplicate animations
    if (el._animating === end) return;
    el._animating = end;

    var startTime = null;
    el.textContent = start.toLocaleString('en-IN'); // Reset to start value immediately

    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function step(ts) {
        if (!startTime) startTime = ts;
        var elapsed = ts - startTime;
        var prog    = Math.min(elapsed / duration, 1);
        var eased   = easeOutExpo(prog);
        var current = Math.floor(eased * (end - start) + start);

        el.textContent = current.toLocaleString('en-IN');

        if (prog < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = end.toLocaleString('en-IN');
            el._animating = false; // Reset state when completed
        }
    }
    requestAnimationFrame(step);
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
async function renderDashboard() {
    var user = window._authUser || {};
    var meta = user.user_metadata || {};
    var name = meta.full_name || meta.name || meta.display_name || (user.email ? user.email.split('@')[0] : 'Student');
    var email = user.email || 'No email';
    var mobile = '';
    
    if (user && user.id && window.supabaseClient) {
        try {
            var { data } = await window.supabaseClient.from('users').select('mobile_number').eq('id', user.id).single();
            if (data && data.mobile_number) mobile = data.mobile_number;
        } catch(err) {}
    }
    
    var mobileDisplay = mobile ? mobile : 'No Mobile Number';
    name = window.sanitizeHTML(name);
    email = window.sanitizeHTML(email);
    mobileDisplay = window.sanitizeHTML(mobileDisplay);

    var localStyles = '<style>' +
        '.dashboard-wrapper { display: flex !important; gap: 24px; padding: 120px 20px 60px; max-width: 1200px; margin: 0 auto; min-height: 80vh; }' +
        '.dashboard-sidebar { width: 320px; flex-shrink: 0; display: flex; flex-direction: column; gap: 20px; }' +
        '.dashboard-content { flex: 1; display: flex; flex-direction: column; gap: 32px; }' +
        '@media (max-width: 900px) { .dashboard-wrapper { flex-direction: column !important; padding-top: 100px; } .dashboard-sidebar { width: 100%; } }' +
    '</style>';

    var placeholderHtml = '<div class="placeholder-section">' +
        '<div class="placeholder-icon">🚀</div>' +
        '<h3>Your journey starts here</h3>' +
        '<p style="color:var(--color-text-muted);margin:10px 0 20px;">Complete your profile or book a session to get started.</p>' +
        '<button class="btn btn-primary" onclick="window.navigate(\'ebooks\')">Browse eBooks</button>' +
    '</div>';

    return localStyles + 
    '<div class="dashboard-wrapper">' +
        '<div class="dashboard-sidebar glass-panel">' +
            '<h3 class="sidebar-title">My Profile</h3>' +
            '<div class="sidebar-user-card">' +
                '<div class="sidebar-avatar">' + name.charAt(0).toUpperCase() + '</div>' +
                '<div class="sidebar-user-info">' +
                    '<div class="sidebar-user-name">' + name + '</div>' +
                    '<div class="sidebar-user-email">' + email + '</div>' +
                    '<div class="sidebar-user-mobile">' + mobileDisplay + '</div>' +
                '</div>' +
            '</div>' +
            '<nav class="sidebar-menu">' +
                '<a href="#" class="menu-item" onclick="event.preventDefault(); window.navigate(\'orders\');">' +
                    '<span class="menu-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8V21H3V8"></path><path d="M1 3H23V8H1V3Z"></path><path d="M10 12H14"></path></svg></span>' +
                    '<span class="menu-label">Order History</span>' +
                '</a>' +
            '</nav>' +
        '</div>' +
        '<div class="dashboard-content glass-panel">' +
            '<div class="content-header">' +
                '<h2>Welcome back, ' + name + '! 👋</h2>' +
                '<p style="color:var(--color-text-muted);margin-top:4px;">Manage your counselling journey and active orders here.</p>' +
            '</div>' +
            '<div class="content-body">' +
                '<h3 style="margin-bottom:10px;">Active Items</h3>' +
                placeholderHtml +
            '</div>' +
        '</div>' +
    '</div>';
}

// ─── Order History ──────────────────────────────────────────────────────────
async function renderOrders() {
    console.log('[App] Rendering Orders...');
    var user = window._authUser;
    if (!user && window.supabaseClient) {
        var { data } = await window.supabaseClient.auth.getSession();
        if (data && data.session) user = data.session.user;
    }

    if (!user || !user.id) {
        return '<div style="padding:160px 20px; text-align:center;">' +
            '<h3>Access Restricted</h3>' +
            '<p style="color:#666; margin:10px 0 20px;">Please log in to view your order history.</p>' +
            '<button class="btn btn-primary" onclick="window.navigate(\'login\')">Sign In</button>' +
        '</div>';
    }

    var orders = [];
    if (window.supabaseClient) {
        try {
            var { data: orderData, error } = await window.supabaseClient
                .from('orders')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            if (orderData) orders = orderData;
        } catch(err) {
            console.error('[App] Failed to fetch orders:', err);
            return '<div style="padding:160px 20px; text-align:center; color:#ef4444;">Error loading orders. Please try again.</div>';
        }
    }

    var html = '<div class="orders-page-wrapper" style="padding:120px 20px 60px; max-width: 1000px; margin: 0 auto; min-height: 80vh;">' +
        '<div class="glass-panel" style="padding:40px; border-radius: 24px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; flex-wrap: wrap; gap: 15px;">' +
                '<div>' +
                    '<h2 style="font-size: 28px; font-weight: 800; color: #1e40af;">Order History</h2>' +
                    '<p style="color:#666; font-size: 14px;">Review all your eBook purchases and transactions here.</p>' +
                '</div>' +
                '<button class="btn btn-ghost" style="border: 1px solid #ddd;" onclick="window.navigate(\'dashboard\')">← Back to Dashboard</button>' +
            '</div>';

    if (orders.length === 0) {
        html += '<div style="text-align:center; padding:80px 20px; background: rgba(0,0,0,0.02); border-radius: 16px; border: 2px dashed #ddd;">' +
            '<div style="font-size: 48px; margin-bottom: 20px;">📦</div>' +
            '<h3 style="font-weight: 600;">No orders yet</h3>' +
            '<p style="color:#666; margin-top: 5px;">You haven\'t made any eBook purchases yet.</p>' +
            '<button class="btn btn-primary" style="margin-top:20px;" onclick="window.navigate(\'ebooks\')">Browse eBooks</button>' +
        '</div>';
    } else {
        html += '<div style="display: flex; flex-direction: column; gap: 20px; margin-top: 20px;">';

        orders.forEach(function(order) {
            var badgeBg = '#666';
            if (order.payment_status === 'success' || order.payment_status === 'paid') badgeBg = '#22c55e'; // Green
            else if (order.payment_status === 'failed') badgeBg = '#ef4444'; // Red
            else if (order.payment_status === 'cancelled') badgeBg = '#f59e0b'; // Yellow
            else if (order.payment_status === 'initiated') badgeBg = '#3b82f6'; // Blue

            // Formatting Date to DD/MM/YYYY
            var d = new Date(order.created_at);
            var dateStr = ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear();

            html += '<div style="background: rgba(255,255,255,0.8); border: 1px solid #eee; border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">' +
                        
                        '<div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 15px;">' +
                            '<div>' +
                                '<div style="font-size: 12px; color: #94a3b8; font-family: monospace; margin-bottom: 4px; font-weight: 600;">ORDER ID: ' + (order.id || 'N/A').split('-')[0].toUpperCase() + '</div>' +
                                '<h3 style="font-size: 18px; font-weight: 700; color: #1e293b; margin: 0;">' + (order.product_name || 'Ebook') + '</h3>' +
                            '</div>' +
                            '<div style="text-align: right;">' +
                                '<span style="display: inline-block; padding: 6px 12px; border-radius: 8px; background:' + badgeBg + '; color:#fff; font-weight:700; font-size:12px; text-transform:uppercase;">' + order.payment_status + '</span>' +
                            '</div>' +
                        '</div>' +
                        
                        '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-top: 10px; padding-top: 15px; border-top: 1px dashed #e2e8f0;">' +
                            '<div>' +
                                '<div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600;">Date</div>' +
                                '<div style="font-size: 14px; color: #334155; font-weight: 500; margin-top: 4px;">' + dateStr + '</div>' +
                            '</div>' +
                            '<div>' +
                                '<div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600;">Amount</div>' +
                                '<div style="font-size: 14px; color: #334155; font-weight: 700; margin-top: 4px;">₹' + (order.amount_paid || 0) + '</div>' +
                            '</div>' +
                            '<div style="display: flex; align-items: flex-end; gap: 8px;">' +
                                '<div style="flex: 1;">' +
                                    '<div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600;">Payment ID</div>' +
                                    '<div style="font-size: 13px; color: #475569; font-family: monospace; font-weight: 500; margin-top: 4px;">' + (order.razorpay_payment_id || '—') + '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +

                        ((order.payment_status === 'success' || order.payment_status === 'paid') ? 
                        '<div style="margin-top: 5px; text-align: left; border-top: 1px dashed #e2e8f0; padding-top: 15px; font-size: 13.5px; color: #0284c7; font-weight: 600; display: flex; align-items: center; gap: 8px;">' +
                            '<span style="font-size: 16px;">📩</span> Check your WhatsApp / Email for your PDF.' +
                        '</div>' : '') +

                    '</div>';
        });

        html += '</div>';
    }

    html += '</div></div>';
    return html;
}

function simulateRazorpay() {

}

window.openAddMobileModal = function() {
    var modal = document.getElementById('addMobileModal');
    var overlay = document.getElementById('modalOverlay');
    if(modal) {
        modal.style.display = 'block';
        modal.style.zIndex = '10000001';
    }
    if(overlay) {
        overlay.style.display = 'block';
        overlay.style.zIndex = '10000000';
    }
};

window.closeAddMobileModal = function() {
    var modal = document.getElementById('addMobileModal');
    var overlay = document.getElementById('modalOverlay');
    if(modal) modal.style.display = 'none';
    if(overlay) overlay.style.display = 'none';
    
    var form = document.getElementById('addMobileForm');
    if(form) form.reset();
    
    var err = document.getElementById('addMobileError');
    if(err) err.style.display = 'none';
};

window.saveMobileNumber = async function() {
    var numInp = document.getElementById('newMobileNumber');
    var btn = document.getElementById('addMobileSubmitBtn');
    var err = document.getElementById('addMobileError');
    if (!numInp || !numInp.value) return;
    var num = numInp.value.trim();
    
    if (!window.supabaseClient || !window._authUser) {
        if(err) { err.innerText = "Auth service unavailable."; err.style.display = "block"; }
        return;
    }
    
    if(btn) { btn.disabled = true; btn.innerText = "Saving..."; }
    if(err) err.style.display = "none";
    
    try {
        var meta = window._authUser.user_metadata || {};
        var fallbackEmail = window._authUser.email || '';
        var fallbackName = meta.full_name || meta.name || meta.display_name || (fallbackEmail ? fallbackEmail.split('@')[0] : 'Student');
        
        var res = await window.supabaseClient.from('users').upsert({
            id: window._authUser.id,
            mobile_number: num,
            email: fallbackEmail,
            name: fallbackName
        }, { onConflict: 'id' });
        
        if (res.error) throw res.error;
        
        // Success Feedback
        alert("Mobile number saved successfully!");
        
        window.closeAddMobileModal();
        
        // Immediate UI Update
        if (window._authUser) {
            // Update the display field in the dropdown if it exists
            var pdMobile = document.getElementById('pdMobile');
            if (pdMobile) pdMobile.innerText = num;

            var dashEl = document.getElementById('section-dashboard');
            if (dashEl && dashEl.style.display === 'block') {
                dashEl.innerHTML = '<div style="padding:120px 20px;text-align:center;"><div class="loading-spinner"></div><br>Updating Profile...</div>';
                renderDashboard().then(html => {
                    if (html) dashEl.innerHTML = html;
                });
            }
        }
    } catch(e) {
        if(err) { err.innerText = e.message || "Failed to save number."; err.style.display = "block"; }
    } finally {
        if(btn) { btn.disabled = false; btn.innerText = "Save Number"; }
    }
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
// ─── Auth ─────────────────────────────────────────────────────────────────────
// Functions doLogout and updateNavForAuth have been natively moved to index.html to guarantee DOM load synchronization

// ─── Login Page Logic ─────────────────────────────────────────────────────────
// Tab switching is handled by the global window.switchAuthTab() in <head>.
function setupLoginPage() {
    var form = document.getElementById('pageAuthForm');
    if (form) {
        form.addEventListener('submit', window.handleEmailLogin);
    }
    
    // Google OAuth button
    var gBtn = document.getElementById('googleLoginBtn');
    if (gBtn) {
        gBtn.addEventListener('click', async function() {
            var errBox = document.getElementById('pageAuthError');
            if (errBox) errBox.style.display = 'none';
            if (!window.supabaseClient) { 
                if (errBox) { errBox.innerText = 'Auth service unavailable.'; errBox.style.display = 'block'; }
                return; 
            }
            gBtn.disabled = true;
            gBtn.innerHTML = '<span class="spinner-small"></span> Connecting to Google…';
            var result = await window.supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: { 
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent'
                    }
                }
            });
            if (result.error) {
                if (errBox) { errBox.innerText = result.error.message; errBox.style.display = 'block'; }
                gBtn.disabled = false;
                gBtn.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" height="18"> Continue with Google';
            }
        });
    }
}

window.handleEmailLogin = async function(e) {
    if (e && e.preventDefault) {
        e.preventDefault();
        e.stopPropagation();
    }

    var errBox   = document.getElementById('pageAuthError');
    var okBox    = document.getElementById('pageAuthSuccess');
    var btn      = document.getElementById('pageAuthSubmitBtn');
    var nameInp  = document.getElementById('pageAuthName');
    
    function showErr(msg) { 
        if(errBox){ 
            var lowerMsg = msg.toLowerCase();
            if (msg.includes('429') || lowerMsg.includes('too many requests') || lowerMsg.includes('rate limit exceeded')) {
                msg = '⚠️ Too many attempts. Please wait 5-10 minutes before trying again.';
            } else if (msg.includes('Email address') && msg.includes('invalid')) {
                msg = '📧 Invalid email format or restricted domain. Please try a different email.';
            }
            errBox.innerText = msg; 
            errBox.style.display = 'block'; 
        } 
        if(okBox) okBox.style.display = 'none'; 
    }
    function showOk(msg)  { if(okBox){ okBox.innerText = msg; okBox.style.display = 'block'; } if(errBox) errBox.style.display = 'none'; }
    function clearMsg()   { if(errBox) errBox.style.display = 'none'; if(okBox) okBox.style.display = 'none'; }

    clearMsg();

    var isSignUp = window._isSignUp;
    var email = document.getElementById('pageAuthEmail').value.trim();
    var pass  = document.getElementById('pageAuthPassword').value;
    var full  = nameInp ? nameInp.value.trim() : '';
    var mobile = '';

    if (!email || !pass) {
        showErr('Please enter both email and password.');
        return false;
    }
    if (isSignUp && (!full || full.length < 2)) {
        showErr('Please enter your full name.');
        return false;
    }

    // ─── Rate Limiting Check ─────────────────────────────────────────
    if (isLoginRateLimited()) {
        var secs = getLoginLockoutRemaining();
        showErr('⚠️ Too many login attempts. Please wait ' + Math.ceil(secs / 60) + ' minute(s) before trying again.');
        return false;
    }

    // ─── Strong Password Validation ──────────────────────────────────
    var passErr = validatePasswordStrength(pass);
    if (passErr) {
        showErr(passErr);
        return false;
    }

    if (btn) {
        btn.disabled = true;
        btn.innerText = isSignUp ? 'Creating…' : 'Signing In…';
    }

    if (!window.supabaseClient) {
        for (var i = 0; i < 30 && !window.supabaseClient; i++) {
            await new Promise(function(r) { setTimeout(r, 100); });
        }
    }
    if (!window.supabaseClient) {
        showErr('Auth service is still loading. Please try again in a moment.');
        alert('Error: Could not connect to Supabase backend! Please ensure your internet connection allows script loading from https://cdn.jsdelivr.net .');
        if (btn) {
            btn.disabled = false;
            btn.innerText = isSignUp ? 'Sign Up' : 'Sign In';
        }
        return false;
    }

    try {
        if (isSignUp) {

            var res = await window.supabaseClient.auth.signUp({ 
                email: email, 
                password: pass, 
                options: { 
                    data: { 
                        full_name: full 
                    } 
                } 
            });

            if (res.error) { 
                showErr(res.error.message); 
            } else if (res.data && res.data.user && res.data.user.identities && res.data.user.identities.length === 0) {
                showErr('⚠️ An account with this email already exists. Please switch to Sign In instead.');
            } else { 
                if (res.data && res.data.session) {
                    showOk('✅ Account created successfully! Returning to home...');
                    if (window.updateNavForAuth) window.updateNavForAuth(res.data.session);
                    setTimeout(function() { if (window.activeEbookContext && window.activeEbookContext.course) {
                    var dest = window.activeEbookContext.origin || 'ebooks';
                    window.navigate(dest);
                    setTimeout(function() {
                        if (window.openEbookPurchaseModal) {
                            window.openEbookPurchaseModal(window.activeEbookContext.course, window.activeEbookContext.quota, window.activeEbookContext.price, window.activeEbookContext.title);
                        }
                    }, 500);
                } else {
                    window.navigate('home');
                } }, 1000);
                } else {
                    showOk('✅ Account created! Please check your email for a confirmation link to sign in.');
                }
            }
        } else {
            recordLoginAttempt();
            var res2 = await window.supabaseClient.auth.signInWithPassword({ email: email, password: pass });

            if (res2.error) { showErr(res2.error.message); }
            else {
                // Successful login — clear rate limit history
                _loginAttempts = [];
                if (window.updateNavForAuth) window.updateNavForAuth(res2.data.session);
                window.navigate('home');
            }
        }
    } catch(err) {

        showErr(err.message || 'Something went wrong. Please verify your connection and credentials.');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerText = isSignUp ? 'Sign Up' : 'Sign In';
        }
    }
    return false;
};

// ─── Global Google Sign-In ────────────────────────────────────────────────────
async function signInWithGoogle() {
    if (!window.supabaseClient) { alert('Auth service unavailable.'); return; }
    var result = await window.supabaseClient.auth.signInWithOAuth({ 
        provider: 'google', 
        options: { 
            redirectTo: window.location.href.split('#')[0].split('?')[0],
            queryParams: {
                access_type: 'offline',
                prompt: 'consent'
            }
        } 
    });
    if (result.error) alert('Google sign-in failed: ' + result.error.message);
}

// ─── Predictor Modal ──────────────────────────────────────────────────────────
function setupPredictorModal() {
    var navBtn = document.getElementById('predictorBtn');
    if (navBtn) {
        navBtn.addEventListener('click', function() {
            document.getElementById('predictorModal').style.display = 'block';
            document.getElementById('modalOverlay').style.display = 'block';
        });
    }
    var closeBtn = document.getElementById('closePredictorBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            document.getElementById('predictorModal').style.display = 'none';
            document.getElementById('modalOverlay').style.display = 'none';
            resetPredictor();
        });
    }
}

function simulatePrediction() {
    document.getElementById('predictorInputStep').style.display = 'none';
    document.getElementById('predictorLoadingStep').style.display = 'block';
    setTimeout(function() {
        document.getElementById('predictorLoadingStep').style.display = 'none';
        document.getElementById('predictorResultStep').style.display = 'block';
        var results = [
            { name: 'MAMC, New Delhi', prob: '85%', color: '#22c55e' },
            { name: 'VMMC, New Delhi', prob: '92%', color: '#22c55e' },
            { name: 'AIIMS, New Delhi', prob: '12%', color: '#ef4444' },
            { name: 'UCMS, New Delhi', prob: '98%', color: '#3b82f6' }
        ];
        var html = '';
        results.forEach(function(r) {
            html += '<div class="result-card" style="background:rgba(255,255,255,.03);border:1px solid var(--glass-border);border-radius:var(--radius-md);padding:15px;margin-bottom:10px;">' +
                '<div style="display:flex;justify-content:space-between;margin-bottom:5px;">' +
                '<span style="font-weight:600;">' + r.name + '</span>' +
                '<span style="color:' + r.color + ';font-weight:700;">' + r.prob + '</span></div>' +
                '<div style="width:100%;height:6px;background:rgba(0,0,0,.3);border-radius:10px;overflow:hidden;">' +
                '<div class="progress-bar" style="width:0%;height:100%;background:' + r.color + ';border-radius:10px;transition:width 1s ease-out;"></div></div></div>';
        });
        document.getElementById('resultsContainer').innerHTML = html;
        setTimeout(function() {
            var bars = document.querySelectorAll('#resultsContainer .progress-bar');
            bars.forEach(function(bar, i) { bar.style.width = results[i].prob; });
        }, 50);
    }, 2000);
}

function resetPredictor() {
    document.getElementById('predictorInputStep').style.display = 'block';
    document.getElementById('predictorLoadingStep').style.display = 'none';
    document.getElementById('predictorResultStep').style.display = 'none';
    document.getElementById('predictorForm').reset();
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

bootApp();

// ─── Counselling Booking Handlers ──────────────────────────────────────────────

window.activeCounsellingContext = null;

window.openCounsellingBooking = function(planId) {
    const meta = COUNSELLING_META[planId];
    if (!meta) {
        console.error("Invalid Counselling Plan:", planId);
        return;
    }

    if (!window._authUser && window.supabaseClient) {
        alert("Please login first to book your counselling plan.");
        window.navigate('login');
        return;
    }

    window.activeCounsellingContext = { planId, ...meta };

    // Fill user data
    if (window._authUser) {
        const userMeta = window._authUser.user_metadata || {};
        const fullNameInput = document.querySelector('input[name="full_name"]') || document.getElementById('cb_full_name');
        const emailInput = document.querySelector('input[name="email"]') || document.getElementById('cb_email');
        if (fullNameInput) fullNameInput.value = userMeta.full_name || userMeta.name || '';
        if (emailInput) emailInput.value = window._authUser.email || '';
    }

    // Modal Display
    document.getElementById('modalOverlay').style.display = 'block';
    document.getElementById('counsellingBookingModal').style.display = 'block';
    
    // Update labels
    const titleEl = document.querySelector('#counsellingBookingModal h2');
    if (titleEl) titleEl.innerText = "Book: " + meta.title;
};

window.closeCounsellingBookingModal = function() {
    document.getElementById('modalOverlay').style.display = 'none';
    document.getElementById('counsellingBookingModal').style.display = 'none';
};

window.submitCounsellingBooking = async function(form) {
    let submitBtn = document.querySelector('#counsellingBookingModal .eb-btn');
    if (form) submitBtn = form.querySelector('[name=submit_button]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "Processing...";
    submitBtn.disabled = true;

    try {
        const formData = form ? new FormData(form) : new FormData(document.getElementById('bookingForm'));
        const obj = Object.fromEntries(formData.entries());

        const ctx = window.activeCounsellingContext;
        
        let finalAmount = ctx.price;
        let appliedCoupon = null;

        if (obj.coupon_code && obj.coupon_code.trim() !== '') {
            if (window.supabaseClient) {
                const { data: coupon, error } = await window.supabaseClient
                    .from('coupons')
                    .select('*')
                    .eq('code', obj.coupon_code.trim().toUpperCase())
                    .eq('is_active', true)
                    .single();
                
                if (error || !coupon) {
                    alert("Invalid or inactive coupon code.");
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    return;
                }
                
                appliedCoupon = coupon;
                let discount = 0;
                if (coupon.discount_type === 'percentage') {
                    // Safe parsing just in case it is stored as string
                    discount = Math.round(ctx.price * (parseFloat(coupon.discount_value) / 100));
                } else {
                    discount = parseFloat(coupon.discount_value);
                }
                finalAmount = ctx.price - discount;
                if (finalAmount < 0) finalAmount = 0;
            }
        }
        
        const recordData = {
            user_id: window._authUser ? window._authUser.id : null,
            full_name: obj.full_name,
            email: obj.email,
            mobile: obj.mobile_number,
            category: obj.category,
            domicile_state: obj.domicile_state,
            neet_score: parseInt(obj.neet_score) || null,
            rank: parseInt(obj.all_india_rank) || null,
            plan_type: ctx.planId,
            plan_name: ctx.title,
            plan_price: ctx.price,
            counselling_type: ctx.type,
            coupon_code: obj.coupon_code ? obj.coupon_code.toUpperCase() : null,
            discounted_price: finalAmount !== ctx.price ? finalAmount : null,
            amount_paid: finalAmount,
            payment_status: 'initiated'
        };

        let insertRes = null;
        if (window.supabaseClient) {
            const { data, error } = await window.supabaseClient.from('counselling_bookings').insert(recordData).select('id').single();
            if (error) {
                console.error("Booking Table Error:", error);
                alert("Server busy. Please try again in a moment.");
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                return;
            }
            insertRes = data;
        }

        // Razorpay Integration
        const options = {
            "key": "rzp_live_SebrDtxMirg67M",
            "amount": Math.round(finalAmount * 100), // paisa
            "currency": "INR",
            "name": "DC Neet Counselling",
            "description": ctx.title,
            "handler": async function (response) {
                if (window.supabaseClient && insertRes && insertRes.id) {
                    await window.supabaseClient.from('counselling_bookings').update({
                        payment_status: 'completed',
                        razorpay_payment_id: response.razorpay_payment_id
                    }).eq('id', insertRes.id);

                    // ─── Record Coupon Usage (Counselling) ───
                    if (appliedCoupon) {
                        const commission = finalAmount * 0.20;
                        await window.supabaseClient.from('coupon_usages').insert({
                            coupon_id: appliedCoupon.id,
                            user_email: obj.email,
                            amount_before: ctx.price,
                            discount_applied: ctx.price - finalAmount,
                            final_amount: finalAmount,
                            commission: commission
                        });
                    }
                }
                alert("Success! Your booking for " + ctx.title + " has been confirmed. Our team will contact you shortly.");
                window.closeCounsellingBookingModal();
            },
            "prefill": {
                "name": obj.full_name,
                "email": obj.email,
                "contact": obj.mobile_number
            },
            "theme": { "color": "#2563eb" }
        };

        const rzp = new Razorpay(options);
        rzp.on('payment.failed', async function (response) {
            if (window.supabaseClient && insertRes && insertRes.id) {
                await window.supabaseClient.from('counselling_bookings').update({
                    payment_status: 'failed'
                }).eq('id', insertRes.id);
            }
            alert("Payment failed. Please try again.");
        });
        rzp.open();

    } catch (e) {
        console.error(e);
        alert("Unexpected error. Please try again.");
    } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
};

window.submitNewCounsellingForm = async function(form) {
    const btn = form.querySelector('[name=submit_button]');
    const originalText = btn.innerText;
    btn.innerText = "Processing...";
    btn.disabled = true;

    try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        if (window.activeCounsellingContext) {
            data.selected_plan = window.activeCounsellingContext.planId;
            data.plan_name = window.activeCounsellingContext.title;
            data.plan_price = window.activeCounsellingContext.price;
            data.counselling_type = window.activeCounsellingContext.type;
        }

        const response = await fetch('http://localhost:3000/submit-counseling-booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok && result.success) {
            alert("Counseling session booked successfully!");
            form.reset();
            window.closeCounsellingBookingModal();
        } else {
            alert(result.error || "Failed to book counseling session.");
        }
    } catch (error) {
        console.error("Form Submit Error:", error);
        alert("Unexpected error submitting form.");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
};
