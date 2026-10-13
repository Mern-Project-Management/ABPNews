const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function test() {
  try {
    const html = await fetchUrl('https://www.aninews.in/category/national/');
    console.log('Fetched National HTML length:', html.length);
    // extract some articles
    const articleRegex = /<div class="card[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/g;
    const links = [];
    const linkRegex = /href="(\/news\/[a-z0-9\/-]+)"/g;
    let m;
    while ((m = linkRegex.exec(html)) !== null) {
      if (!links.includes(m[1])) links.push(m[1]);
    }
    console.log('Found article links:', links.slice(0, 10));
  } catch (e) {
    console.error('Error:', e);
  }
}

test();
