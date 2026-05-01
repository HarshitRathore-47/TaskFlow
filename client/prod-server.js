import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;

// --- RE-DEPLOYMENT TRIGGER: ${new Date().getTime()} ---
// Log every request to see if it reaches the server
app.use((req, res, next) => {
  console.log(`[REQUEST] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const distPath = path.join(__dirname, 'dist');
console.log(`[INFO] Current working directory: ${process.cwd()}`);
console.log(`[INFO] Serving files from: ${distPath}`);

import fs from 'fs';
if (fs.existsSync(distPath)) {
    console.log(`[SUCCESS] dist folder exists`);
    console.log(`[INFO] Contents of dist: ${fs.readdirSync(distPath)}`);
} else {
    console.log(`[ERROR] dist folder NOT FOUND at ${distPath}`);
}

// Serve static files from the 'dist' directory
app.use(express.static(distPath));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend server is running on port ${PORT}`);
});
