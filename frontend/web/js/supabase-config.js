/**
 * Supabase Environment Configuration
 * ====================================
 * THIS IS THE ONLY FILE that should change between branches.
 *
 * PRODUCTION (main branch):
 *   window.__SUPABASE_URL = 'https://rlqmdylbzapyepuwncwt.supabase.co';
 *   window.__SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscW1keWxiemFweWVwdXduY3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTcwNzYsImV4cCI6MjA5MTgzMzA3Nn0.oNNK1pwLnykQlNfUkw7IdB-ZBkKDoWxszsKDSIjsLeo';
 *
 * TESTING (referral-system-testing branch):
 *   window.__SUPABASE_URL = 'https://anqqmulbmeydetwpeudh.supabase.co';
 *   window.__SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIs...AbfUID7hy1gg88C...';
 *
 * MERGE INSTRUCTIONS:
 * When merging to main, resolve this file's conflict by keeping the PRODUCTION values.
 */

// ═══════════════════════════════════════════════════
// CURRENT: PRODUCTION DATABASE
// ═══════════════════════════════════════════════════
window.__SUPABASE_URL = 'https://rlqmdylbzapyepuwncwt.supabase.co';
window.__SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscW1keWxiemFweWVwdXduY3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTcwNzYsImV4cCI6MjA5MTgzMzA3Nn0.oNNK1pwLnykQlNfUkw7IdB-ZBkKDoWxszsKDSIjsLeo';

console.log('%c[ENV] Using ' + (window.__SUPABASE_URL.includes('anqqmul') ? 'TESTING' : 'PRODUCTION') + ' database', 'color: #facc15; font-weight: bold;');
