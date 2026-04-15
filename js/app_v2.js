// ─── Supabase Configuration ───────────────────────────────────────────────────
console.log("APP.JS LOADED - STARTING EXECUTION");

const SUPABASE_URL  = 'https://rlqmdylbzapyepuwncwt.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscW1keWxiemFweWVwdXduY3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTcwNzYsImV4cCI6MjA5MTgzMzA3Nn0.oNNK1pwLnykQlNfUkw7IdB-ZBkKDoWxszsKDSIjsLeo';


const REDIRECT_URL = window.location.href.split('#')[0].split('?')[0];

// ─── Core Router (Upgraded) ──────────────────────────────────────────────────
// Enhance the stub navigation with animations and dynamic features
var originalStub = window.navigate;
window.navigate = function(route) {
    if (route === 'dashboard') {
        var dashEl = document.getElementById('section-dashboard');
        if (dashEl && typeof renderDashboard === 'function') {
            dashEl.innerHTML = '<div style="padding:120px 20px;text-align:center;">Loading...</div>';
            renderDashboard().then(html => {
                if (html) dashEl.innerHTML = html;
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
    console.log("bootApp() EXECUTION STARTED");
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
            console.log('🔔 Auth event:', event, session ? '(session exists)' : '(no session)');

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

        console.log('✅ Auth sync active');
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
        setTimeout(() => {
            var errStr = decodeURIComponent(rawHash.split('error_description=')[1] || rawHash);
            alert('Supabase Auth Error: ' + errStr);
        }, 800);
        window.navigate('login');
    } else if (rawHash.includes('access_token=')) {
        // Do not navigate immediately, let Supabase process the token
        setTimeout(() => window.navigate('home'), 1500); 
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
    var fadeUpEls = document.querySelectorAll('.fade-up');
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

    console.log("INITIALIZING ANIMATIONS");
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
    console.log("InitCounters found:", counters.length, "elements");

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
                    console.log("Counter", i, "intersected - starting animation");
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
    // Robust name detection: check metadata properties commonly used by Supabase/Google Auth
    var meta = user.user_metadata || {};
    var name = meta.full_name || meta.name || meta.display_name || (user.email ? user.email.split('@')[0] : 'Student');
    var email = user.email || 'No email';
    var mobile = '';
    
    // Fetch mobile number from the database 'users' table
    if (user && user.id && window.supabaseClient) {
        try {
            var { data, error } = await window.supabaseClient.from('users').select('mobile_number').eq('id', user.id).single();
            if (data && data.mobile_number) {
                mobile = data.mobile_number;
            }
        } catch(err) {
            console.error('Failed to fetch user profile:', err);
        }
    }
    
    var mobileDisplay = mobile ? mobile : 'No Mobile Number';
    
    // Inject local fallback styles to guarantee layout even if external CSS has issues
    var localStyles = '<style>' +
        '.dashboard-wrapper { display: flex !important; gap: 24px; padding: 120px 20px 60px; max-width: 1200px; margin: 0 auto; min-height: 80vh; }' +
        '.dashboard-sidebar { width: 320px; flex-shrink: 0; display: flex; flex-direction: column; gap: 20px; }' +
        '.dashboard-content { flex: 1; display: flex; flex-direction: column; gap: 32px; }' +
        '@media (max-width: 900px) { .dashboard-wrapper { flex-direction: column !important; padding-top: 100px; } .dashboard-sidebar { width: 100%; } }' +
    '</style>';

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
                '<a href="#" class="menu-item" onclick="event.preventDefault(); window.openAddMobileModal();">' +
                    '<span class="menu-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></span>' +
                    '<span class="menu-label">Add Mobile Number</span>' +
                '</a>' +
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
                '<div class="placeholder-section">' +
                    '<div class="placeholder-icon">🚀</div>' +
                    '<h3>Your journey starts here</h3>' +
                    '<p style="color:var(--color-text-muted);margin:10px 0 20px;">Complete your profile or book a session to get started.</p>' +
                    '<button class="btn btn-primary" onclick="window.navigate(\'counselling\')">Explore Services</button>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>';
}

function simulateRazorpay() {
    console.log('Razorpay Checkout Simulated (No UI Alert)');
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
    console.log("handleEmailLogin triggered!");
    
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

    if (!email || !pass) {
        showErr('Please enter both email and password.');
        return false;
    }
    if (isSignUp && (!full || full.length < 2)) {
        showErr('Please enter your full name.');
        return false;
    }
    if (pass.length < 6) {
        showErr('Password must be at least 6 characters.');
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
            console.log('Attempting sign up for:', email);
            var res = await window.supabaseClient.auth.signUp({ email: email, password: pass, options: { data: { full_name: full } } });
            console.log('Sign up result:', res);
            
            if (res.error) { 
                showErr(res.error.message); 
            } else if (res.data && res.data.user && res.data.user.identities && res.data.user.identities.length === 0) {
                showErr('⚠️ An account with this email already exists. Please switch to Sign In instead.');
            } else { 
                if (res.data && res.data.session) {
                    showOk('✅ Account created successfully! Returning to home...');
                    if (window.updateNavForAuth) window.updateNavForAuth(res.data.session);
                    setTimeout(function() { window.navigate('home'); }, 1000);
                } else {
                    showOk('✅ Account created! Please check your email for a confirmation link to sign in.');
                }
            }
        } else {
            console.log('Attempting sign in for:', email);
            var res2 = await window.supabaseClient.auth.signInWithPassword({ email: email, password: pass });
            console.log('Sign in result:', res2);
            if (res2.error) { showErr(res2.error.message); }
            else {
                if (window.updateNavForAuth) window.updateNavForAuth(res2.data.session);
                window.navigate('home');
            }
        }
    } catch(err) {
        console.error("Auth Exception:", err);
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
console.log("APP.JS FINAL EXECUTION - BOOTING");
bootApp();
