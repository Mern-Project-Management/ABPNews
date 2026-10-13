const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://parthchampanerirndtechnosoft_db_user:qwaszx123@cluster0.fn1bc3b.mongodb.net/abpnews_admin?retryWrites=true&w=majority';

// Paths
const ADMIN_UPLOADS = path.join(__dirname, '..', '..', 'abpnews-admin', 'public', 'uploads');
const WEBSITE_UPLOADS = path.join(__dirname, '..', 'public', 'uploads');

if (!fs.existsSync(ADMIN_UPLOADS)) fs.mkdirSync(ADMIN_UPLOADS, { recursive: true });
if (!fs.existsSync(WEBSITE_UPLOADS)) fs.mkdirSync(WEBSITE_UPLOADS, { recursive: true });

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) {
          redirectUrl = new URL(redirectUrl, url).toString();
        }
        return fetchUrl(redirectUrl).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });
  });
}

function downloadImage(url, destFilename) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const adminPath = path.join(ADMIN_UPLOADS, destFilename);
    const websitePath = path.join(WEBSITE_UPLOADS, destFilename);

    client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) {
          redirectUrl = new URL(redirectUrl, url).toString();
        }
        return downloadImage(redirectUrl, destFilename).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download image: HTTP ${res.statusCode}`));
      }

      const fileStream = fs.createWriteStream(adminPath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close(() => {
          try {
            // Also copy to website uploads
            fs.copyFileSync(adminPath, websitePath);
            resolve(`/uploads/${destFilename}`);
          } catch (e) {
            resolve(`/uploads/${destFilename}`);
          }
        });
      });
    }).on('error', reject);
  });
}

function decodeHtml(html) {
  if (!html) return '';
  return html
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function cleanMetrotimesContent(text) {
  if (!text) return '';
  let clean = decodeHtml(text);

  // Clean out datelines and news agency mentions
  clean = clean
    .replace(/\s*\(ANI\):?/gi, '')
    .replace(/\s*\[ANI\]:?/gi, '')
    .replace(/\bANI\b/g, 'Metrotimes')
    .replace(/\bANINEWS\b/gi, 'Metrotimes')
    .replace(/\baninews\.in\b/gi, 'metrotimes.com')
    .replace(/#ANI\b/gi, '#Metrotimes')
    .replace(/#ANINews\b/gi, '#MetrotimesNews')
    .replace(/^([A-Za-z\s,\(\)\[\]]+\[India\],\s*[A-Za-z0-9\s,]+:\s*)/i, (m) => {
      // Replace dateline to clean format
      return m.replace(/\s*\(ANI\):?/gi, '').replace(/\bANI\b/g, 'Metrotimes');
    });

  return clean.trim();
}

const SECTIONS = [
  {
    categorySlug: 'news',
    categoryName: 'News',
    url: 'https://www.aninews.in/category/national/',
    filterPrefix: '/news/national/'
  },
  {
    categorySlug: 'business',
    categoryName: 'Business',
    url: 'https://www.aninews.in/category/business/',
    filterPrefix: '/news/business/'
  },
  {
    categorySlug: 'entertainment',
    categoryName: 'Entertainment',
    url: 'https://www.aninews.in/category/entertainment/',
    filterPrefix: '/news/entertainment/'
  },
  {
    categorySlug: 'sports',
    categoryName: 'Sports',
    url: 'https://www.aninews.in/category/sports/',
    filterPrefix: '/news/sports/'
  },
  {
    categorySlug: 'technology',
    categoryName: 'Technology',
    url: 'https://www.aninews.in/category/tech/',
    filterPrefix: '/news/tech/'
  }
];

async function parseArticle(articleUrl) {
  const html = await fetchUrl(articleUrl);

  // 1. Title
  let title = '';
  const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
  if (titleMatch) {
    title = cleanMetrotimesContent(titleMatch[1].replace(/<[^>]+>/g, ''));
  }

  // 2. Summary
  let summary = '';
  const descMatch = html.match(/<meta\s+(?:name|property)="(?:og:)?description"\s+content="([^"]+)"/i);
  if (descMatch) {
    summary = cleanMetrotimesContent(descMatch[1]);
  }

  // 3. Keywords / Hashtags
  let keywords = '';
  const kwMatch = html.match(/<meta\s+name="keywords"\s+content="([^"]+)"/i);
  if (kwMatch) {
    keywords = decodeHtml(kwMatch[1])
      .split(',')
      .map(k => k.trim())
      .filter(k => k && !k.toLowerCase().includes('ani'))
      .join(', ');
  }
  if (!keywords) {
    keywords = 'Metrotimes, India News, Latest Updates, Breaking News';
  }

  // 4. Image
  let imageUrl = '';
  const imgMatch =
    html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i) ||
    html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i) ||
    html.match(/<meta[^>]+name="twitter:image"[^>]+content="([^"]+)"/i) ||
    html.match(/itemprop="image"\s+content="([^"]+)"/i);

  if (imgMatch && imgMatch[1]) {
    imageUrl = imgMatch[1];
    // Upgrade sized thumbnail to full resolution image if applicable
    if (imageUrl.includes('__sized__') && imageUrl.includes('-thumbnail-')) {
      const fullUrl = imageUrl.replace('/__sized__', '').replace(/-thumbnail-[0-9x]+-[0-9]+\./, '.');
      imageUrl = fullUrl;
    }
  }

  // 5. Body Content Paragraphs
  const content = [];
  const bodyMatch = html.match(/<div class="content[^"]*"[^>]*itemprop="articleBody"[^>]*>([\s\S]*?)<\/div>/i);
  if (bodyMatch) {
    const rawBody = bodyMatch[1];
    // split by <br /> or </p>
    const chunks = rawBody
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .split('\n')
      .map(chunk => cleanMetrotimesContent(chunk.replace(/<[^>]+>/g, '')))
      .filter(chunk => chunk.length > 25);

    content.push(...chunks);
  }

  if (content.length === 0 && summary) {
    content.push(summary);
  }

  return {
    title,
    summary: summary || (content[0] || '').substring(0, 200),
    content: content.length > 0 ? content : [summary],
    imageUrl,
    keywords
  };
}

async function run() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB.');

  const db = mongoose.connection.db;
  const categoriesCol = db.collection('categories');
  const newsCol = db.collection('news');

  const categories = await categoriesCol.find({}).toArray();
  const catMap = {};
  categories.forEach(c => {
    catMap[c.slug] = c._id;
  });

  const scrapedArticles = [];
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  for (const sec of SECTIONS) {
    console.log(`\n========================================`);
    console.log(`Scraping Section: ${sec.categoryName} (${sec.url})`);
    console.log(`========================================`);

    const html = await fetchUrl(sec.url);
    const linkRegex = /href="(\/news\/[a-z0-9\/-]+)"/g;
    const links = [];
    let m;
    while ((m = linkRegex.exec(html)) !== null) {
      const link = m[1];
      if (link.startsWith(sec.filterPrefix) && !links.includes(link)) {
        links.push(link);
      }
    }

    // Fallback if filterPrefix is too strict: take top links
    if (links.length < 3) {
      let m2;
      linkRegex.lastIndex = 0;
      while ((m2 = linkRegex.exec(html)) !== null) {
        const link = m2[1];
        if (!links.includes(link) && !link.includes('/category/')) {
          links.push(link);
        }
      }
    }

    const targetLinks = links.slice(0, 3);
    console.log(`Found target links for ${sec.categoryName}:`, targetLinks);

    for (let i = 0; i < targetLinks.length; i++) {
      const artUrl = 'https://www.aninews.in' + targetLinks[i];
      try {
        console.log(`[${i + 1}/3] Parsing: ${artUrl}`);
        const parsed = await parseArticle(artUrl);

        if (!parsed.title) {
          console.log(`Skipping: empty title`);
          continue;
        }

        // Generate local image filename
        const ext = parsed.imageUrl.endsWith('.png') ? 'png' : 'jpg';
        const imgFilename = `metrotimes_${sec.categorySlug}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.${ext}`;

        let localImagePath = '/uploads/default_news.jpg';
        if (parsed.imageUrl) {
          try {
            console.log(`  Downloading image: ${parsed.imageUrl}`);
            localImagePath = await downloadImage(parsed.imageUrl, imgFilename);
          } catch (err) {
            console.warn(`  Failed downloading full image, trying fallback URL: ${err.message}`);
            localImagePath = parsed.imageUrl;
          }
        }

        // Create SEO slug
        const slug = parsed.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
          .substring(0, 100);

        const categoryId = catMap[sec.categorySlug] || catMap['news'];

        const articleDoc = {
          title: parsed.title,
          slug: `${slug}-${Math.random().toString(36).substring(2, 6)}`,
          originalId: '',
          summary: parsed.summary,
          content: parsed.content,
          image: localImagePath,
          originalImageLink: parsed.imageUrl,
          categoryId: categoryId,
          subCategoryId: null,
          author: 'Metrotimes News Bureau',
          readTime: `${Math.max(2, Math.ceil(parsed.content.join(' ').split(/\s+/).length / 180))} min read`,
          publishedDate: dateStr,
          timeAgo: 'Just now',
          isFeatured: (scrapedArticles.length === 0), // Make 1st article overall the featured lead story
          isTrending: (i === 0), // Top story of each section is trending
          isBreaking: (scrapedArticles.length < 2),
          status: 'published',
          views: Math.floor(Math.random() * 500) + 120,
          metaTitle: `${parsed.title} | Metrotimes`,
          metaDescription: parsed.summary,
          metaKeywords: parsed.keywords,
          canonicalUrl: `https://metrotimes.com/${sec.categorySlug}/${slug}`,
          schemaScript: '',
          ogTitle: `${parsed.title} | Metrotimes`,
          ogDescription: parsed.summary,
          ogImage: localImagePath,
          createdAt: new Date(Date.now() - i * 15 * 60 * 1000),
          updatedAt: new Date()
        };

        scrapedArticles.push(articleDoc);
        console.log(`  ✓ Successfully prepared: "${parsed.title.substring(0, 50)}..."`);
      } catch (err) {
        console.error(`  Error parsing article ${artUrl}:`, err.message);
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`Total Scraped Articles Ready: ${scrapedArticles.length}`);
  console.log(`========================================`);

  if (scrapedArticles.length > 0) {
    // 1. Remove old articles in database
    console.log('Clearing old articles from database collection...');
    const deleteRes = await newsCol.deleteMany({});
    console.log(`Deleted ${deleteRes.deletedCount} old articles.`);

    // 2. Insert fresh scraped articles
    console.log('Inserting fresh scraped articles...');
    const insertRes = await newsCol.insertMany(scrapedArticles);
    console.log(`Inserted ${insertRes.insertedCount} fresh articles into MongoDB!`);

    // 3. Keep newsData.json fallback file perfectly in sync so refreshes never flash old data
    try {
      const jsonPath = path.join(__dirname, '..', 'src', 'data', 'newsData.json');
      if (fs.existsSync(jsonPath)) {
        const existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        const leadStory = scrapedArticles.find(a => a.isFeatured) || scrapedArticles[0];
        const trendingNews = scrapedArticles.filter(a => a.isTrending);

        const updatedJson = {
          ...existingData,
          leadStory: {
            ...leadStory,
            id: leadStory._id ? leadStory._id.toString() : leadStory.slug,
            link: `/${leadStory.categorySlug || 'news'}/${leadStory.slug}`
          },
          trendingNews: trendingNews.length > 0 ? trendingNews : scrapedArticles.slice(0, 5),
          allArticles: scrapedArticles.map((a, idx) => ({
            ...a,
            id: a._id ? a._id.toString() : `art-${idx}`,
            link: `/${a.categorySlug || 'news'}/${a.slug}`
          }))
        };
        fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 2), 'utf8');
        console.log('✓ Successfully synchronized newsData.json fallback file!');
      }
    } catch (syncErr) {
      console.warn('Could not sync newsData.json:', syncErr.message);
    }
  }

  await mongoose.disconnect();
  console.log('Finished successfully.');
  process.exit(0);
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
