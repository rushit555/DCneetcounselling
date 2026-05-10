const SUPABASE_URL = 'https://rlqmdylbzapyepuwncwt.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscW1keWxiemFweWVwdXduY3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTcwNzYsImV4cCI6MjA5MTgzMzA3Nn0.oNNK1pwLnykQlNfUkw7IdB-ZBkKDoWxszsKDSIjsLeo';
const postId = 'ae4a0d2d-a5b0-44fa-ac23-0a03a7f2a54d';
const downloadUrl = 'https://drive.google.com/file/d/14sc8kcAE4HXKImGJt6vFzOb-E9PEIGib/view?usp=sharing';

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
  
  // Appending the download section
  const downloadSection = `
<div style="margin-top: 40px; text-align: center;">
  <h2>Download Complete pdf</h2>
  <a href="${downloadUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12px 24px; background-color: #5b21b6; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; margin-top: 10px;">Download</a>
</div>
`;

  content += downloadSection;

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
    console.log('Successfully added download button to post');
  } else {
    console.error('Failed to update blog post', await patchRes.text());
  }
}

run();
