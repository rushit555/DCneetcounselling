
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function addArrows() {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, slug, content');

  if (error) {
    console.error('Error fetching posts:', error);
    return;
  }

  for (const post of posts) {
    let updatedContent = post.content;
    
    // Regex to match h2 and h3 tags and add arrow if not present
    // It handles tags with attributes and checks if it already starts with the arrow
    const h2h3Regex = /<(h[23])([^>]*)>(?![\s\n]*➤)([\s\n]*)(.*?)([\s\n]*)<\/h[23]>/gi;
    
    // We use a replacer function to preserve attributes and inner content
    updatedContent = updatedContent.replace(h2h3Regex, (match, tag, attrs, leadingSpace, innerContent, trailingSpace) => {
        // If innerContent starts with an emoji or other special character, we might still want the arrow
        // The lookahead (?![\s\n]*➤) already ensures we don't double add
        return `<${tag}${attrs}>${leadingSpace}➤ ${innerContent}${trailingSpace}</${tag}>`;
    });

    if (updatedContent !== post.content) {
      console.log(`Updating post: ${post.slug}`);
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({ content: updatedContent })
        .eq('id', post.id);

      if (updateError) {
        console.error(`Error updating post ${post.slug}:`, updateError);
      }
    } else {
      console.log(`No changes needed for post: ${post.slug}`);
    }
  }
}

addArrows();
