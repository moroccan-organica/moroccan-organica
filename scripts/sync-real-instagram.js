const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'instagram');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const reels = [
  {
    code: 'DVhO0SiDLNb',
    caption: 'Coffee & Cacao Scrub • Natural Exfoliating & Glowing Skin',
  },
  {
    code: 'DVhObbxDOLh',
    caption: 'Clay Mask with Orange Blossom 🌸 Purifies & Refreshes',
  },
  {
    code: 'DVhOIdkjJbK',
    caption: 'Nourishing Clay Mask with Natural Moroccan Honey ✨',
  },
  {
    code: 'DU5kA1GDCe9',
    caption: 'Authentic Aker Fassi Moroccan Black Soap • Traditional Spa Ritual',
  },
  {
    code: 'DU5jkPoDE9c',
    caption: 'Moroccan Nila Sabounia Traditional Black Soap from the Sahara',
  },
  {
    code: 'DUEAH1hjPzk',
    caption: 'Authentic Moroccan Cosmetics Supplier • Direct from Source',
  },
  {
    code: 'DUD-DsbDJs5',
    caption: 'Crème au Beurre Corporel • Intense Hydration & Softness',
  },
  {
    code: 'DUD9fXLDKvr',
    caption: 'Moroccan Nila Cream • Natural Brightening & Radiance',
  },
  {
    code: 'DUD82pUjFM9',
    caption: 'Moroccan Sidr Herbal Body Scrub • Pure Herbal Care',
  },
  {
    code: 'DUD7ftRjLrE',
    caption: 'Moroccan Prickly Pear Scrub • Youthful Firming Glow',
  },
  {
    code: 'DTdKc40jL1M',
    caption: 'Timeless Moroccan Aker Fassi Lip & Cheek Stain',
  },
  {
    code: 'DTbKEnciOsu',
    caption: 'Traditional Blue Nila Sabounia Exfoliating Soap',
  },
];

async function fetchReelData(reel, index) {
  const url = `https://www.instagram.com/reel/${reel.code}/`;
  console.log(`[${index + 1}/${reels.length}] Fetching ${url}...`);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    const html = await res.text();
    const ogImgMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    const ogDescMatch = html.match(/<meta property="og:description" content="([^"]+)"/);

    let likes = '';
    if (ogDescMatch) {
      const likesMatch = ogDescMatch[1].match(/^([\d,kK\.\+]+)\s+likes/i);
      if (likesMatch) likes = likesMatch[1];
    }

    if (!ogImgMatch) {
      console.warn(`Could not find og:image for ${reel.code}`);
      return null;
    }

    const cleanImgUrl = ogImgMatch[1].replace(/&amp;/g, '&');
    const imgRes = await fetch(cleanImgUrl, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1'
      }
    });

    if (imgRes.status !== 200) {
      console.warn(`Failed to download image for ${reel.code}, status: ${imgRes.status}`);
      return null;
    }

    const imgFilename = `reel-${reel.code}.jpg`;
    const imgPath = path.join(targetDir, imgFilename);
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    fs.writeFileSync(imgPath, buffer);
    console.log(`Saved ${imgFilename} (${buffer.length} bytes)`);

    return {
      id: String(index + 1),
      type: 'reel',
      image: `/images/instagram/${imgFilename}`,
      url: `https://www.instagram.com/reel/${reel.code}/`,
      caption: reel.caption,
      likes: likes || undefined
    };
  } catch (err) {
    console.error(`Error fetching ${reel.code}:`, err.message);
    return null;
  }
}

async function run() {
  const results = [];
  for (let i = 0; i < reels.length; i++) {
    const item = await fetchReelData(reels[i], i);
    if (item) results.push(item);
    // tiny delay
    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`Successfully fetched and saved ${results.length} reels!`);
  fs.writeFileSync(
    path.join(__dirname, '..', 'src', 'data', 'instagram.ts'),
    `export interface InstagramPost {\n  id: string;\n  type: "reel" | "post";\n  image: string;\n  url: string;\n  caption: string;\n  likes?: string;\n}\n\nexport const instagramPosts: InstagramPost[] = ${JSON.stringify(results, null, 2)};\n`
  );
  console.log('Updated src/data/instagram.ts with real Instagram posts!');
}

run();

