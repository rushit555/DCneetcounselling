const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://rlqmdylbzapyepuwncwt.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscW1keWxiemFweWVwdXduY3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTcwNzYsImV4cCI6MjA5MTgzMzA3Nn0.oNNK1pwLnykQlNfUkw7IdB-ZBkKDoWxszsKDSIjsLeo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

async function run() {
  const { data: colleges, error: fetchError } = await supabase
    .from('colleges')
    .select('id, name, slug');

  if (fetchError || !colleges) {
    console.error("Error fetching colleges", fetchError);
    return;
  }

  const college = colleges.find(c => c.slug === 'aiims-delhi' || c.name.toLowerCase().includes('aiims') || c.name.toLowerCase().includes('delhi'));

  if (!college) {
    console.error("College not found. Available colleges:", colleges.map(c => c.name));
    return;
  }

  const collegeId = college.id;
  console.log("Found college:", college.name, collegeId);

  const images = [
    "https://rlqmdylbzapyepuwncwt.supabase.co/storage/v1/object/public/college-media/gallery/aiims%20delhi/aiims%201.jpg",
    "https://rlqmdylbzapyepuwncwt.supabase.co/storage/v1/object/public/college-media/gallery/aiims%20delhi/aiims%202.jpg",
    "https://rlqmdylbzapyepuwncwt.supabase.co/storage/v1/object/public/college-media/gallery/aiims%20delhi/aiims%203.webp",
    "https://rlqmdylbzapyepuwncwt.supabase.co/storage/v1/object/public/college-media/gallery/aiims%20delhi/aiims%204.jfif"
  ];

  // Delete existing ones to avoid duplicates
  await supabase.from('gallery').delete().eq('college_id', collegeId);

  const inserts = images.map(url => ({
    college_id: collegeId,
    image_url: url
  }));

  const { data, error } = await supabase
    .from('gallery')
    .insert(inserts);

  if (error) {
    console.error("Error inserting", error);
  } else {
    console.log("Success inserting images", data);
  }
}
run();
