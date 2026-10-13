const sharp = require('sharp');
const fs = require('fs');

const svgMetrotimes = Buffer.from(`
<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a192f" />
      <stop offset="45%" stop-color="#0f2744" />
      <stop offset="100%" stop-color="#1b3a5b" />
    </linearGradient>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E30613" />
      <stop offset="100%" stop-color="#FF334B" />
    </linearGradient>
    
  </defs>

  <!-- Deep Slate/Navy Background -->
  <rect width="1280" height="720" fill="url(#bgGrad)" />

  <!-- Subtle Concentric Circular Grid -->
  <circle cx="640" cy="330" r="280" stroke="rgba(255,255,255,0.03)" stroke-width="60" fill="none" />
  <circle cx="640" cy="330" r="160" stroke="rgba(227,6,19,0.18)" stroke-width="3" fill="none" />

  <!-- Geometric Brand M Symbol -->
  <g transform="translate(560, 160)">
    <path d="M15 130 L55 35 L80 95 L105 35 L145 130 L115 130 L95 75 L80 115 L65 75 L45 130 Z" fill="url(#redGrad)" />
    <circle cx="80" cy="20" r="8" fill="#FFFFFF" />
  </g>

  <!-- Metrotimes Main Brand Title -->
  <text x="640" y="380" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="64" fill="#FFFFFF" text-anchor="middle" letter-spacing="8">
    METROTIMES
  </text>

  <!-- Red Accent Divider Line -->
  <rect x="540" y="415" width="200" height="6" rx="3" fill="url(#redGrad)" />

  <!-- Tagline -->
  <text x="640" y="465" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="20" fill="#94A3B8" text-anchor="middle" letter-spacing="5">
    NEWS NETWORK • DIGITAL EDITION
  </text>
</svg>
`);

async function generate() {
  await sharp(svgMetrotimes)
    .png()
    .toFile('d:/abpnews/abpnews-website/public/metrotimes_default.png');

  fs.copyFileSync('d:/abpnews/abpnews-website/public/metrotimes_default.png', 'd:/abpnews/abpnews-admin/public/metrotimes_default.png');
  fs.copyFileSync('d:/abpnews/abpnews-website/public/metrotimes_default.png', 'd:/abpnews/abpnews-website/public/uploads/default_news.jpg');
  fs.copyFileSync('d:/abpnews/abpnews-website/public/metrotimes_default.png', 'd:/abpnews/abpnews-admin/public/uploads/default_news.jpg');
  console.log('Created and copied metrotimes_default.png!');
}

generate().catch(console.error);
