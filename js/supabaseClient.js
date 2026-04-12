/**
 * Centralized Supabase Client Initialization
 * This file ensures only ONE instance of the Supabase client is created
 * and that session persistence is correctly configured.
 */

(function() {
    const SUPABASE_URL  = 'https://qlaewtlbielpzlxyfrhg.supabase.co';
    const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsYWV3dGxiaWVscHpseHlmcmhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMjEwMjEsImV4cCI6MjA5MDU5NzAyMX0.YNobjm1U1bkflgQ5hRUbxXMo6LC9GPOFeuFXpN9vWKM';

    function initClient() {
        if (!window.supabase) {
            console.warn('⏳ Supabase SDK not loaded yet, retrying...');
            setTimeout(initClient, 50);
            return;
        }

        if (!window.supabaseClient) {
            try {
                window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
                    auth: {
                        persistSession: true,
                        autoRefreshToken: true,
                        detectSessionInUrl: true,
                        storage: window.localStorage
                    }
                });
                console.log('✅ Supabase Client Initialized (Persistent)');
                
                // Start auto-refresh cycle
                if (window.supabaseClient.auth.startAutoRefresh) {
                    window.supabaseClient.auth.startAutoRefresh();
                }
            } catch (err) {
                console.error('❌ Failed to initialize Supabase client:', err);
            }
        }
    }

    // Initialize immediately
    initClient();
})();
