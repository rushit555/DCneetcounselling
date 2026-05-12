const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rlqmdylbzapyepuwncwt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscW1keWxiemFweWVwdXduY3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTcwNzYsImV4cCI6MjA5MTgzMzA3Nn0.oNNK1pwLnykQlNfUkw7IdB-ZBkKDoWxszsKDSIjsLeo';

const supabase = createClient(supabaseUrl, supabaseKey);

const content = `<h1>NEET (UG) 2026 Cancelled: NTA Announces Re-Conduct Examination After Investigation</h1>

<p><strong>Published Date:</strong> 12 May 2026</p>
<p><strong>Category:</strong> NEET UG 2026 Update</p>

<p>
The National Testing Agency (NTA) has officially announced the cancellation of the 
<strong>NEET (UG) 2026 examination conducted on 3 May 2026</strong>. 
The decision was taken after inputs received from central agencies and findings shared by law enforcement authorities regarding concerns related to the examination process.
</p>

<p>
According to the official notice released on 12 May 2026, the Government of India has approved the decision to 
<strong>re-conduct NEET UG 2026</strong> on fresh dates, which will be announced separately through official channels.
</p>

<p>
Students and parents can check the official notice on 
<a href="https://neet.nta.nic.in/" target="_blank">NTA NEET Official Website</a>.
</p>

<h2>Why Was NEET UG 2026 Cancelled?</h2>

<p>
NTA stated that after reviewing investigative inputs and reports from central agencies, it was concluded that the integrity and transparency of the examination process had been affected.
</p>

<p>
To maintain trust in the national examination system, the agency decided that the current examination could not be allowed to stand.
</p>

<p>
The notice mentions that although the re-examination may cause inconvenience to students and families, the decision was necessary to protect the credibility of the examination process.
</p>

<h2>CBI Inquiry Ordered</h2>

<p>
The Government of India has also decided to transfer the matter to the 
<strong>Central Bureau of Investigation (CBI)</strong> for a detailed inquiry into the allegations related to NEET UG 2026.
</p>

<p>
NTA confirmed that it will fully cooperate with the investigation and provide all necessary records and materials required by the agency.
</p>

<h2>Important Updates for Students</h2>

<ul>
<li><strong>No fresh registration will be required</strong></li>
<li>Existing application data will be carried forward</li>
<li>Previously selected examination centres will remain valid</li>
<li>No additional examination fee will be charged</li>
<li>Fees already paid by candidates will be refunded</li>
<li>Fresh admit cards will be issued before the re-exam</li>
</ul>

<p>
The agency also stated that the re-conducted examination will be organized using NTA’s internal resources.
</p>

<h2>When Will the New NEET UG 2026 Exam Date Be Announced?</h2>

<p>
As of now, NTA has not announced the new examination date. The revised exam schedule and admit card release dates will be shared soon through official NTA communication channels.
</p>

<p>
Students are advised to regularly check the official website and avoid relying on rumours or unverified social media posts.
</p>

<h2>Official Notice Summary</h2>

<ul>
<li>NEET UG 2026 conducted on 3 May 2026 has been cancelled</li>
<li>Re-examination will be conducted on new dates</li>
<li>CBI inquiry has been initiated</li>
<li>No new application form required</li>
<li>Fees will be refunded</li>
<li>Fresh admit cards will be issued</li>
</ul>

<h2>Advice for NEET 2026 Aspirants</h2>

<p>
Students should remain calm and continue their preparation seriously. Since all candidates will appear under the same conditions again, consistent revision and mock test practice will remain important during this additional preparation period.
</p>

<p>
Candidates are strongly advised to follow only official updates from 
<a href="https://neet.nta.nic.in/" target="_blank">NTA NEET Official Portal</a> 
for accurate information regarding the re-examination schedule and further announcements.
</p>`;

async function insertNews() {
  const { data, error } = await supabase
    .from('news_updates')
    .insert([
      {
        title: 'NEET (UG) 2026 Cancelled: NTA Announces Re-Conduct Examination After Investigation',
        description: 'The NTA has announced the cancellation of the NEET UG 2026 examination conducted on 3 May 2026, with a re-examination to be conducted on fresh dates. A CBI inquiry has also been ordered.',
        content: content,
        date: '2026-05-12',
        category: 'NEET UG 2026 Update',
        icon: 'fa-bell',
        link: '',
        is_featured: true,
        image_url: 'https://rlqmdylbzapyepuwncwt.supabase.co/storage/v1/object/public/news-images/ChatGPT%20Image%20May%2012,%202026,%2005_42_09%20PM.webp',
        youtube_url: ''
      }
    ]);

  if (error) {
    console.error('Error inserting news update:', error);
  } else {
    console.log('Successfully inserted news update into main DB:', data);
  }
}

insertNews();
