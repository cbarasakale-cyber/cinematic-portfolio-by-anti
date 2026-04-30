const fs = require('fs');
const path = require('path');

const CITIES_FILE = path.join(__dirname, 'cities.json');
const INDEX_FILE = path.join(__dirname, '../index.html');
const LOCATIONS_DIR = path.join(__dirname, '../locations');
const SITEMAP_FILE = path.join(__dirname, '../sitemap.xml');
const BASE_URL = 'https://chandrakantpb.co.in';

// 1. Read files
const cities = JSON.parse(fs.readFileSync(CITIES_FILE, 'utf8'));
let baseHtml = fs.readFileSync(INDEX_FILE, 'utf8');

// 2. Prepare locations directory
if (!fs.existsSync(LOCATIONS_DIR)) {
    fs.mkdirSync(LOCATIONS_DIR);
}

// 3. Fix relative paths in baseHtml so they work inside /locations/ folder
baseHtml = baseHtml.replace(/href="style\.css"/g, 'href="../style.css"');
baseHtml = baseHtml.replace(/src="main\.js"/g, 'src="../main.js"');
baseHtml = baseHtml.replace(/href="https:\/\/chandrakantpb\.co\.in\/"/g, 'href="https://chandrakantpb.co.in/"'); 

// 4. Generate Pages
let sitemapUrls = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
sitemapUrls += `  <url>\n    <loc>${BASE_URL}/</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

console.log(`Starting generation of ${cities.length} location pages...`);

cities.forEach(city => {
    // URL friendly slug
    const citySlug = city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const pageUrl = `${BASE_URL}/locations/${citySlug}.html`;
    
    let html = baseHtml;
    
    // SEO Replacements
    html = html.replace(
        /<title>.*?<\/title>/, 
        `<title>Freelance Video Editor in ${city} | Cinematic Reels & Graphic Design</title>`
    );
    
    html = html.replace(
        /<meta name="description" content=".*?" \/>/,
        `<meta name="description" content="Hire the best freelance cinematic video editor in ${city}. Specializing in high-retention YouTube editing, Instagram Reels, and premium brand identities for clients in ${city}." />`
    );

    html = html.replace(
        /<meta property="og:title" content=".*?" \/>/,
        `<meta property="og:title" content="Freelance Video Editor & Graphic Designer in ${city}" />`
    );

    html = html.replace(
        /<meta property="og:url" content=".*?" \/>/,
        `<meta property="og:url" content="${pageUrl}" />`
    );
    
    html = html.replace(
        /<link rel="canonical" href=".*?" \/>/,
        `<link rel="canonical" href="${pageUrl}" />`
    );
    
    // Save File
    const outputPath = path.join(LOCATIONS_DIR, `${citySlug}.html`);
    fs.writeFileSync(outputPath, html, 'utf8');
    
    // Add to Sitemap
    sitemapUrls += `  <url>\n    <loc>${pageUrl}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
});

sitemapUrls += `</urlset>`;
fs.writeFileSync(SITEMAP_FILE, sitemapUrls, 'utf8');

console.log(`Successfully generated ${cities.length} pages in /locations/ and updated sitemap.xml.`);
