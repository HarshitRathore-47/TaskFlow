import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Logging middleware for all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const distPath = path.join(__dirname, 'client/dist');

// Debugging: Check if dist folder exists
if (!fs.existsSync(distPath)) {
  console.error(`❌ ERROR: Dist folder not found at ${distPath}`);
  console.error("Make sure 'npm run build-client' completed successfully.");
} else {
  console.log(`✅ Found dist folder at ${distPath}`);
}

// Serve static files
app.use(express.static(distPath));

// Express 5 compatible catch-all route: Named wildcard is MANDATORY
// Syntax: *parameterName (e.g., *path)
app.get('*path', (req, res) => {
  const filePath = path.join(distPath, 'index.html');
  console.log(`[SPA Redirect] Serving: ${req.url} -> index.html`);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`❌ Error sending index.html: ${err.message}`);
      if (!res.headersSent) {
        res.status(500).send("Frontend build not found. Please check deployment logs.");
      }
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend production server running on port ${PORT}`);
});
