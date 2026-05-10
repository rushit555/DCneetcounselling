const { createClient } = require('@supabase/supabase-js');

const url = 'https://anqqmulbmeydetwpeudh.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFucXFtdWxibWV5ZGV0d3BldWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODY1MTMsImV4cCI6MjA5Mzk2MjUxM30.AbfUID7hy1gg88C_j0OUk09G0XEW8uEqvJzD17u96ZA';

const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase.from('users').insert([{ id: '00000000-0000-0000-0000-000000000000', email: 'test@example.com', full_name: 'Test' }]);
  console.log('Insert test:');
  if (error) console.log('Error:', error);
  else console.log('Data:', data);
}

test();
