const SUPABASE_URL = 'https://rlqmdylbzapyepuwncwt.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscW1keWxiemFweWVwdXduY3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTcwNzYsImV4cCI6MjA5MTgzMzA3Nn0.oNNK1pwLnykQlNfUkw7IdB-ZBkKDoWxszsKDSIjsLeo';
const postId = 'ae4a0d2d-a5b0-44fa-ac23-0a03a7f2a54d';

async function run() {
  const getRes = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?id=eq.${postId}`, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_ANON,
      'Authorization': `Bearer ${SUPABASE_ANON}`
    }
  });

  const posts = await getRes.json();
  if (!posts || posts.length === 0) {
    console.error('Post not found');
    return;
  }

  const post = posts[0];
  let content = post.content;
  
  // Replace ? with ₹ specifically in the fee amounts. Let's find specific ones to avoid messing up other ?.
  // Or just replace "?24,000", "?1,00,000", "?10,000", "?13,940", "?33,940", "?49,000", "?1,08,940", "?1,25,000" etc.
  // The content might have literal `?` or `` that was parsed as `?`. Let's try replacing `?` followed by a digit.
  
  // Regex to match ? followed by digits and commas
  // e.g., ?24,000 -> ₹24,000
  content = content.replace(/\?(\d{1,3}(,\d{2,3})*)/g, '₹$1');

  const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?id=eq.${postId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON,
      'Authorization': `Bearer ${SUPABASE_ANON}`
    },
    body: JSON.stringify({ content })
  });

  if (patchRes.ok) {
    console.log('Successfully updated the ? marks to ₹');
  } else {
    console.error('Failed to update blog post', await patchRes.text());
  }
}

run();
