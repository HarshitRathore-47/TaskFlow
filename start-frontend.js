import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT) || 3000;

// Minimal Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

const distPath = path.join(__dirname, 'client/dist');

// Serve static files with proper caching
app.use(express.static(distPath, {
  maxAge: '1d',
  etag: true
}));

// Professional SPA Catch-all: Version-agnostic (Works with Express 4 and 5)
// We use a regex here to avoid the Express 5 wildcard parameter requirement
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      console.error(`❌ Error: ${err.message}`);
      if (!res.headersSent) {
        res.status(500).send("Application Error: Build folder not found.");
      }
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Frontend Live: http://0.0.0.0:${PORT}`);
});
