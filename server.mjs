import path from 'node:path';
import fs from 'node:fs';

const PORT = 8080;
const BASE_DIR = path.resolve('.');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.ttf': 'font/ttf',
  '.svg': 'image/svg+xml'
};

const server = Bun.serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    let filePath = url.pathname;
    if (filePath === '/' || filePath === '') filePath = '/index.html';

    const fullPath = path.join(BASE_DIR, decodeURIComponent(filePath));

    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
      return new Response('404 Not Found: ' + filePath, { status: 404 });
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const file = Bun.file(fullPath);
    return new Response(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
});

console.log(`🎮 ACE FUN RUN Browser Game Server läuft auf: http://localhost:${server.port}`);
