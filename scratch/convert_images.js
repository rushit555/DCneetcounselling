const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, '../frontend/web/assets');

async function processImages() {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    if (file.match(/\.(png|jpg|jpeg)$/i)) {
      const ext = path.extname(file);
      const baseName = path.basename(file, ext);
      const inputPath = path.join(dir, file);
      const outputPath = path.join(dir, `${baseName}.webp`);

      const metadata = await sharp(inputPath).metadata();
      let width = metadata.width;
      
      // Resize logic
      // Hero/LCP usually around 800-1200px width max for mobile first
      if (width > 1200) {
        width = 1200;
      }

      await sharp(inputPath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);
      
      console.log(`Converted ${file} to ${baseName}.webp (Original: ${metadata.width}px -> Resized: ${width}px)`);
    }
  }
}

processImages().catch(console.error);
