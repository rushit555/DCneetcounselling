const SUPABASE_URL = 'https://rlqmdylbzapyepuwncwt.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscW1keWxiemFweWVwdXduY3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTcwNzYsImV4cCI6MjA5MTgzMzA3Nn0.oNNK1pwLnykQlNfUkw7IdB-ZBkKDoWxszsKDSIjsLeo';
const postId = 'dbe9ed24-6b2d-4619-ad87-3f3fcd9007c2';

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
  content = content.replace('color: white;', 'color: #ffffff !important;');

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
    console.log('Successfully updated the button text color to white (!important)');
  } else {
    console.error('Failed to update blog post', await patchRes.text());
  }
}

run();
