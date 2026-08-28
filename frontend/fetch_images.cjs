const https = require('https');

https.get('https://html.duckduckgo.com/html/?q=indian+software+developer+office+unsplash', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const urls = [...data.matchAll(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+/g)].map(m => m[0]);
    console.log(Array.from(new Set(urls)).slice(0, 10));
  });
}).on('error', err => console.log('Error:', err.message));
