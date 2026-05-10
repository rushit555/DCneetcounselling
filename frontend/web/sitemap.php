<?php
// Dynamic Sitemap Generator for DC NEET Counselling
header('Content-Type: application/xml; charset=utf-8');

$supabase_url = 'https://anqqmulbmeydetwpeudh.supabase.co';
$supabase_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFucXFtdWxibWV5ZGV0d3BldWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODY1MTMsImV4cCI6MjA5Mzk2MjUxM30.AbfUID7hy1gg88C_j0OUk09G0XEW8uEqvJzD17u96ZA';

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

$base_url = 'https://dcneetcounselling.com';

// Core Application Pages
$core_pages = [
    '/' => '1.0',
    '/#blog' => '0.8',
    '/#news' => '0.8',
    '/#contact' => '0.5'
];

foreach ($core_pages as $path => $priority) {
    echo "  <url>\n";
    echo "    <loc>{$base_url}{$path}</loc>\n";
    echo "    <changefreq>daily</changefreq>\n";
    echo "    <priority>{$priority}</priority>\n";
    echo "  </url>\n";
}

// Fetch published blogs from Supabase REST API
$ch = curl_init("{$supabase_url}/rest/v1/blog_posts?select=slug,updated_at,created_at&is_published=eq.true");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "apikey: {$supabase_key}",
    "Authorization: Bearer {$supabase_key}"
]);
$response = curl_exec($ch);
curl_close($ch);

if ($response) {
    $blogs = json_decode($response, true);
    if (is_array($blogs)) {
        foreach ($blogs as $blog) {
            if (!empty($blog['slug'])) {
                // Prefer updated_at, fallback to created_at
                $date_str = !empty($blog['updated_at']) ? $blog['updated_at'] : $blog['created_at'];
                $lastmod = substr($date_str, 0, 10);
                
                echo "  <url>\n";
                echo "    <loc>{$base_url}/#blog/" . htmlspecialchars($blog['slug']) . "</loc>\n";
                if ($lastmod) {
                    echo "    <lastmod>{$lastmod}</lastmod>\n";
                }
                echo "    <changefreq>weekly</changefreq>\n";
                echo "    <priority>0.7</priority>\n";
                echo "  </url>\n";
            }
        }
    }
}

echo '</urlset>';
?>
