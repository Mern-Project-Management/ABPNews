const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location;
        if (loc.startsWith('/')) loc = new URL(loc, url).toString();
        return fetchUrl(loc).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function test() {
  const url = 'https://www.aninews.in/news/national/general-news/killing-of-anti-drug-activist-parminder-jhota-in-punjab-ignited-political-firestorm-opposition-alleges-failure-of-mann-govt16020261013121400/';
  const html = await fetchUrl(url);
  const m = html.match(/property="og:image"\s+content="([^"]+)"/i) || html.match(/content="([^"]+)"\s+property="og:image"/i);
  console.log('OG image match:', m ? m[1] : 'NOT FOUND');
  if (!m) {
    // look for cloudfront or media
    const imgMatches = html.match(/https:\/\/[^"'\s>]+\.(?:jpg|jpeg|png)/gi);
    console.log('Images found in html:', imgMatches ? imgMatches.slice(0, 10) : 'none');
  }
}

test();
