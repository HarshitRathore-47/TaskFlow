import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT) || 3000;

// Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

const distPath = path.join(__dirname, 'client/dist');

// Serve static files
app.use(express.static(distPath));

// Final Catch-all for SPA: Most compatible way for Express 5
// This avoids PathError by not using a route string with wildcards
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Frontend production server running on port ${PORT}`);
});
