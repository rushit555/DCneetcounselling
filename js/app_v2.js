// ─── Supabase Configuration ───────────────────────────────────────────────────
console.log("APP.JS LOADED - STARTING EXECUTION");

const SUPABASE_URL  = 'https://qlaewtlbielpzlxyfrhg.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsYWV3dGxiaWVscHpseHlmcmhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMjEwMjEsImV4cCI6MjA5MDU5NzAyMX0.YNobjm1U1bkflgQ5hRUbxXMo6LC9GPOFeuFXpN9vWKM';

let supabase = null;
const REDIRECT_URL = window.location.href.split('#')[0].split('?')[0];

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

    // ══════════════════════════════════════════════════════════════════════
    // BULLETPROOF SUPABASE INIT + SESSION PERSISTENCE
    // ══════════════════════════════════════════════════════════════════════
    (function initSupabaseAndAuth() {
        // Step 1: Poll until the Supabase UMD SDK is loaded
        if (!window.supabase || !window.supabase.createClient) {
            console.log('⏳ Waiting for Supabase SDK...');
            setTimeout(initSupabaseAndAuth, 100);
            return;
        }

        // Step 2: Create the client ONCE (skip if already created)
        if (!window.supabaseClient) {
            try {
                window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
                    auth: {
                        persistSession: true,
                        autoRefreshToken: true,
                        detectSessionInUrl: true
                    }
                });
                supabase = window.supabaseClient;
                console.log('✅ Supabase client created');
            } catch (e) {
                console.error('❌ Supabase client creation failed:', e);
                return;
            }
        }

        var client = window.supabaseClient;

        // Step 3: Start auto-refresh (critical for page reloads!)
        // This ensures the SDK picks up the stored refresh token and
        // starts the background refresh timer.
        if (client.auth.startAutoRefresh) {
            client.auth.startAutoRefresh();
            console.log('🔄 Auto-refresh started');
        }

        // Step 4: Use onAuthStateChange as SINGLE SOURCE OF TRUTH
        // The INITIAL_SESSION event fires on first load with the
        // restored session (or null if none). This replaces the
        // separate getSession() call that caused race conditions.
        client.auth.onAuthStateChange(function(event, session) {
            console.log('🔔 Auth event:', event, session ? '(session exists)' : '(no session)');

            if (window.updateNavForAuth) {
                window.updateNavForAuth(session);
            }
        });

        console.log('✅ Auth listener registered, waiting for INITIAL_SESSION...');
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
        initTiltEffects();
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
function renderDashboard() {
    var user = window._authUser || {};
    var name = (user.user_metadata && user.user_metadata.full_name) || (user.email ? user.email.split('@')[0] : 'Student');
    return '<section style="padding: 100px 0; min-height: 80vh;">' +
        '<div class="container">' +
        '<div style="display:flex;gap:30px;margin-top:20px;flex-wrap:wrap;">' +
        '<div class="glass-panel" style="width:240px;padding:25px;flex-shrink:0;">' +
        '<h3 style="margin-bottom:25px;font-weight:800;">My Profile</h3>' +
        '<ul style="list-style:none;">' +
        '<li style="margin-bottom:15px;"><a href="#" style="color:var(--color-primary);font-weight:600;text-decoration:none;">👤 ' + name + '</a></li>' +
        '<li style="margin-bottom:15px; font-size:0.9rem; color:var(--color-text-muted);">' + (user.email || 'No email') + '</li>' +
        '<hr style="border:0; border-top:1px solid var(--glass-border); margin:20px 0;">' +
        '<li style="margin-bottom:15px;"><a href="#" style="color:var(--color-text-muted);text-decoration:none;">🎯 Predictor Results</a></li>' +
        '<li style="margin-bottom:15px;"><a href="#" style="color:var(--color-text-muted);text-decoration:none;">📅 Booked Sessions</a></li>' +
        '<li style="margin-bottom:15px;"><a href="#" style="color:var(--color-text-muted);text-decoration:none;">💳 My Payments</a></li>' +
        '</ul></div>' +
        '<div class="glass-panel" style="flex:1;min-width:280px;padding:40px;">' +
        '<h2>Welcome back, ' + name + '! 👋</h2>' +
        '<p style="color:var(--color-text-muted);margin-top:10px;">Here is your counselling overview and active orders.</p>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-top:30px;">' +
        '<div class="glass-panel" style="padding:25px;">' +
        '<h4>📞 Book a Session</h4>' +
        '<p style="font-size:.9rem;color:var(--color-text-muted);margin:10px 0;">Schedule your 1-on-1 expert counselling.</p>' +
        '<button class="btn btn-primary" style="padding:8px 20px;font-size:.9rem;" onclick="window.navigate(\'counselling\')">Book Now</button>' +
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
                    window.localStorage.setItem('sb-session', JSON.stringify(res.data.session));
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
                if (res2.data && res2.data.session) {
                    window.localStorage.setItem('sb-session', JSON.stringify(res2.data.session));
                }
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
    var result = await supabase.auth.signInWithOAuth({ 
        provider: 'google', 
        options: { 
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
