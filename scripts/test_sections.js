const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

const sections = [
  { slug: 'news', name: 'News', url: 'https://www.aninews.in/category/national/' },
  { slug: 'business', name: 'Business', url: 'https://www.aninews.in/category/business/' },
  { slug: 'entertainment', name: 'Entertainment', url: 'https://www.aninews.in/category/entertainment/' },
  { slug: 'sports', name: 'Sports', url: 'https://www.aninews.in/category/sports/' },
  { slug: 'technology', name: 'Technology', url: 'https://www.aninews.in/category/tech/' }
];

async function testSections() {
  for (const s of sections) {
    try {
      const html = await fetchUrl(s.url);
      console.log(`\n=== Section: ${s.name} (${s.url}) === [Length: ${html.length}]`);
      const linkRegex = /href="(\/news\/[a-z0-9\/-]+)"/g;
      const links = [];
      let m;
      while ((m = linkRegex.exec(html)) !== null) {
        if (!links.includes(m[1]) && !m[1].includes('/category/')) links.push(m[1]);
      }
      console.log(`Found ${links.length} links. First 5:`);
      links.slice(0, 5).forEach(l => console.log('  ', l));
    } catch (err) {
      console.error(`Failed ${s.name}:`, err.message);
    }
  }
}

testSections();
