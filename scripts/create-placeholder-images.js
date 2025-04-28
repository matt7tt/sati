// This script creates placeholder images for the homepage
// Run it with Node.js: node scripts/create-placeholder-images.js

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const imageDir = path.join(__dirname, '../public/images');

// Ensure the directory exists
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Function to create a placeholder image
function createPlaceholderImage(filename, width, height, bgColor, text) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  
  // Add text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  // Save the image
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(path.join(imageDir, filename), buffer);
  
  console.log(`Created ${filename}`);
}

// Create placeholder images
createPlaceholderImage('silhouette-sunset.jpg', 600, 300, '#FFA07A', 'Sunset Silhouette');
createPlaceholderImage('woman-smiling.jpg', 200, 200, '#8A6A5E', 'Woman Smiling');
createPlaceholderImage('nutrition.jpg', 200, 200, '#90EE90', 'Nutrition');
createPlaceholderImage('supplements.jpg', 200, 200, '#20B2AA', 'Supplements');
createPlaceholderImage('woman-happy.jpg', 800, 500, '#CD853F', 'Happy Woman');
createPlaceholderImage('sunset-silhouette.jpg', 800, 400, '#4682B4', 'Sunset View');

console.log('All placeholder images created successfully!'); 