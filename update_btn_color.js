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
  
  // Replace the background color of the button
  content = content.replace(/background-color: #5b21b6;/g, 'background-color: #16a34a;');
  content = content.replace(/background-color='#4c1d95'/g, "background-color='#15803d'"); // For hover effect if we added one (we didn't but just in case)
  content = content.replace(/background-color='#5b21b6'/g, "background-color='#16a34a'"); 

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
    console.log('Successfully updated the button color to green');
  } else {
    console.error('Failed to update blog post', await patchRes.text());
  }
}

run();
