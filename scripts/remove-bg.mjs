import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.join(__dirname, '..', 'public', 'images', 'piko-original.png');
const outputPath = path.join(__dirname, '..', 'public', 'images', 'piko.png');

async function removeWhiteBackground() {
  const image = sharp(inputPath);
  const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  
  const threshold = 220; // Pixels with R,G,B all above this are considered "white"
  const edgeSmooth = 30; // Smooth transition range
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Check if pixel is "white-ish"
    if (r > threshold && g > threshold && b > threshold) {
      // Make white pixels fully transparent
      data[i + 3] = 0;
    } else if (r > (threshold - edgeSmooth) && g > (threshold - edgeSmooth) && b > (threshold - edgeSmooth)) {
      // Semi-transparent for edge pixels (anti-aliasing)
      const minVal = Math.min(r, g, b);
      const alpha = Math.round(255 * (1 - (minVal - (threshold - edgeSmooth)) / edgeSmooth));
      data[i + 3] = Math.min(data[i + 3], alpha);
    }
    // Non-white pixels keep their original alpha
  }
  
  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png()
    .toFile(outputPath);
  
  console.log(`✅ Background removed! Output: ${outputPath}`);
  console.log(`   Dimensions: ${info.width}x${info.height}`);
}

removeWhiteBackground().catch(console.error);
