// ─── Supabase Configuration ───────────────────────────────────────────────────
console.log("APP.JS LOADED - STARTING EXECUTION");

const SUPABASE_URL  = 'https://qlaewtlbielpzlxyfrhg.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsYWV3dGxiaWVscHpseHlmcmhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMjEwMjEsImV4cCI6MjA5MDU5NzAyMX0.YNobjm1U1bkflgQ5hRUbxXMo6LC9GPOFeuFXpN9vWKM';

let supabase = null;
const REDIRECT_URL = window.location.origin;

// ─── Core Router (Upgraded) ──────────────────────────────────────────────────
// Enhance the stub navigation with animations and dynamic features
var originalStub = window.navigate;
window.navigate = function(route) {
    if (route === 'dashboard') {
        var dashEl = document.getElementById('section-dashboard');
        if (dashEl && typeof renderDashboard === 'function') {
            dashEl.innerHTML = renderDashboard();
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

    // Init Supabase safely with retries if CDN is slow
    function initSupa() {
        if (window.supabase) {
            try {
                var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
                window.supabaseClient = supabase; // expose
                supabase.auth.onAuthStateChange(function(event, session) {
                    updateNavForAuth(session);
                    if (event === 'SIGNED_IN' && session && window.location.hash.includes('login')) {
                        window.navigate('home');
                    }
                });
                supabase.auth.getSession().then(function(res) {
                    if(res.data.session) updateNavForAuth(res.data.session);
                });
            } catch (e) {
                console.warn('Supabase init failed:', e.message);
            }
        } else {
            setTimeout(initSupa, 50); // Poll until script loads
        }
    }
    initSupa();

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

    initCounters();
    initTiltEffects();
    initCarousel();
}

function initCarousel() {
    var track = document.getElementById('notifications-track');
    var leftBtn = document.getElementById('carousel-left');
    var rightBtn = document.getElementById('carousel-right');
    if (!track || !leftBtn || !rightBtn) return;
    if (leftBtn._carouselInit) return;
    leftBtn._carouselInit = true;

    var scrollAmt = 350;
    leftBtn.addEventListener('click', function() { track.scrollBy({ left: -scrollAmt, behavior: 'smooth' }); });

    var scrollRight = function() {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            track.scrollBy({ left: scrollAmt, behavior: 'smooth' });
        }
    };
    rightBtn.addEventListener('click', scrollRight);

    if (window._carouselInterval) clearInterval(window._carouselInterval);
    window._carouselInterval = setInterval(scrollRight, 3000);

    var wrapper = document.querySelector('.carousel-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', function() { clearInterval(window._carouselInterval); });
        wrapper.addEventListener('mouseleave', function() {
            clearInterval(window._carouselInterval);
            window._carouselInterval = setInterval(scrollRight, 3000);
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
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateValue(entry.target, 0, parseInt(entry.target.getAttribute('data-target')), 2000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(function(c) { observer.observe(c); });
}

function animateValue(el, start, end, duration) {
    var startTime = null;
    function step(ts) {
        if (!startTime) startTime = ts;
        var prog = Math.min((ts - startTime) / duration, 1);
        el.innerHTML = Math.floor(prog * (end - start) + start);
        if (prog < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function renderDashboard() {
    var user = window._authUser || {};
    var name = user.full_name || (user.email ? user.email.split('@')[0] : 'Student');
    return '<section style="padding: 100px 0; min-height: 80vh;">' +
        '<div class="container">' +
        '<div style="display:flex;gap:30px;margin-top:20px;flex-wrap:wrap;">' +
        '<div class="glass-panel" style="width:240px;padding:25px;flex-shrink:0;">' +
        '<h3 style="margin-bottom:25px;font-weight:800;">Dashboard</h3>' +
        '<ul style="list-style:none;">' +
        '<li style="margin-bottom:15px;"><a href="#" style="color:var(--color-text);font-weight:600;text-decoration:none;">👤 My Profile</a></li>' +
        '<li style="margin-bottom:15px;"><a href="#" style="color:var(--color-text-muted);text-decoration:none;">🎯 Predictor Results</a></li>' +
        '<li style="margin-bottom:15px;"><a href="#" style="color:var(--color-text-muted);text-decoration:none;">📅 Booked Sessions</a></li>' +
        '<li style="margin-bottom:15px;"><a href="#" style="color:var(--color-text-muted);text-decoration:none;">💳 My Payments</a></li>' +
        '</ul></div>' +
        '<div class="glass-panel" style="flex:1;min-width:280px;padding:40px;">' +
        '<h2>Welcome back, ' + name + '! 👋</h2>' +
        '<p style="color:var(--color-text-muted);margin-top:10px;">Here is your counselling overview.</p>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-top:30px;">' +
        '<div class="glass-panel" style="padding:25px;">' +
        '<h4>📞 Book a Session</h4>' +
        '<p style="font-size:.9rem;color:var(--color-text-muted);margin:10px 0;">Schedule your 1-on-1 expert counselling.</p>' +
        '<button class="btn btn-primary" style="padding:8px 20px;font-size:.9rem;">Book Now</button>' +
        '</div>' +
        '<div class="glass-panel" style="padding:25px;">' +
        '<h4>⬆️ Upgrade Plan</h4>' +
        '<p style="font-size:.9rem;color:var(--color-text-muted);margin:10px 0;">Get premium choice filling support.</p>' +
        '<button class="btn btn-primary" style="padding:8px 20px;font-size:.9rem;" onclick="simulateRazorpay()">Pay with Razorpay</button>' +
        '</div></div></div></div></div></section>';
}

function simulateRazorpay() {
    alert('Razorpay Checkout Simulated!');
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
function updateNavForAuth(session) {
    var loginBtn = document.getElementById('loginBtn');
    if (!loginBtn) return;

    if (session && session.user) {
        window._authUser = session.user;
        var name = (session.user.user_metadata && session.user.user_metadata.full_name) || session.user.email.split('@')[0];
        loginBtn.innerText = '👤 ' + name;
        loginBtn.removeAttribute('data-route');
        loginBtn.onclick = function(e) {
            e.preventDefault();
            if (confirm('👤 Profile: ' + name + '\n✉️ Email: ' + session.user.email + '\n\nDo you want to log out?')) {
                if (window.supabaseClient) {
                    window.supabaseClient.auth.signOut().then(function() { 
                        window.location.hash = 'home';
                        window.location.reload(); 
                    });
                }
            }
        };
    } else {
        window._authUser = null;
        loginBtn.innerHTML = 'Login';
        loginBtn.setAttribute('data-route', 'login');
        // Restore standard navigation
        loginBtn.onclick = function(e) {
            e.preventDefault();
            window.navigate('login');
        };
    }
}

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
            var redirectSafe = window.location.href.split('#')[0];
            var result = await window.supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: { 
                    redirectTo: redirectSafe,
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
                    updateNavForAuth(res.data.session);
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
                updateNavForAuth(res2.data.session);
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
    if (!supabase) { alert('Auth service unavailable.'); return; }
    var redirectSafe = window.location.href.split('#')[0];
    var result = await supabase.auth.signInWithOAuth({ 
        provider: 'google', 
        options: { 
            redirectTo: redirectSafe,
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
