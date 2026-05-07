
const fs = require('fs');
const path = require('path');

const inputFilePath = 'C:/Users/rushi/.gemini/antigravity/brain/a868a71e-9c7f-4b74-8433-89706011a015/.system_generated/steps/72/output.txt';
const outputFilePath = 'c:/Users/rushi/Downloads/DCneetcounselling/scratch/restore_and_fix_headers.sql';

const rawData = fs.readFileSync(inputFilePath, 'utf8');
const jsonStart = rawData.indexOf('[{"id":');
const jsonEnd = rawData.lastIndexOf('}]') + 2;
const jsonStr = rawData.substring(jsonStart, jsonEnd);
const posts = JSON.parse(jsonStr);

let sqlStatements = [];

posts.forEach(post => {
    let content = post.content;
    
    // Robust regex to add arrow to h2 and h3 if not present
    // It captures:
    // 1: Tag name (h2/h3)
    // 2: Attributes
    // 3: Leading space/newlines
    // 4: First character (non-arrow, non-tag, non-space)
    // 5: Remaining content
    const regex = /<(h[23])([^>]*)>([\s\n]*)([^➤<\s\n])(.*?)([\s\n]*)<\/h\1>/gi;
    
    let updatedContent = content.replace(regex, (match, tag, attrs, leading, firstChar, rest, trailing) => {
        return `<${tag}${attrs}>${leading}➤ ${firstChar}${rest}${trailing}</${tag}>`;
    });

    // Special case for headers that might be empty or start with a tag (unlikely for these posts but safe)
    // If it starts with a tag like <b>, we capture the < and add the arrow before it if it doesn't have one
    const tagRegex = /<(h[23])([^>]*)>([\s\n]*)(<[^➤])(.*?)([\s\n]*)<\/h\1>/gi;
    updatedContent = updatedContent.replace(tagRegex, (match, tag, attrs, leading, firstTagChar, rest, trailing) => {
        return `<${tag}${attrs}>${leading}➤ ${firstTagChar}${rest}${trailing}</${tag}>`;
    });

    // Escape single quotes for SQL
    const escapedContent = updatedContent.replace(/'/g, "''");
    sqlStatements.push(`UPDATE public.blog_posts SET content = '${escapedContent}' WHERE id = '${post.id}';`);
});

fs.writeFileSync(outputFilePath, sqlStatements.join('\n\n'));
console.log(`Generated SQL for ${posts.length} posts.`);
