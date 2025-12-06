#!/usr/bin/env node

import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 62776;

const server = createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    const html = readFileSync(join(__dirname, 'web-cli.html'), 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`BFG CLI Web App running on http://localhost:${PORT}`);
});

