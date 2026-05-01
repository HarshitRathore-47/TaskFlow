import express from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import workspaceRouter from "./routes/workspaceRoutes.js";
import { protect } from "./middlewares/authMiddleware.js";
import projectRouter from "./routes/projectRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import authRouter from "./routes/authRoutes.js";
import runStartupChecks from "./configs/startupCheck.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => res.send("Server is live!⌛"));

// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));

// Routes
// Health check endpoint for Railway
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use("/api/auth", authRouter);
app.use("/api/workspaces", protect, workspaceRouter);
app.use("/api/projects", protect, projectRouter);
app.use("/api/tasks", protect, taskRouter);
app.use("/api/comments", protect, commentRouter);

// --- SERVE FRONTEND ---
const clientDistPath = path.join(__dirname, "../client/dist");

if (fs.existsSync(clientDistPath)) {
  console.log(`   ✅ Frontend dist folder found at: ${clientDistPath}`);
  console.log(`   📂 Contents: ${fs.readdirSync(clientDistPath).join(", ")}`);
} else {
  console.log(`   ❌ Frontend dist folder NOT FOUND at: ${clientDistPath}`);
  console.log(`      Make sure to run 'npm run build-client' before starting the server.`);
}

app.use(express.static(clientDistPath));

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
  const indexPath = path.join(clientDistPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Frontend build not found. Please check deployment logs.");
  }
});

const PORT = process.env.PORT || 5000;

runStartupChecks();

app.listen(PORT, "0.0.0.0", () =>
  console.log(
    `Server is running on port ${PORT} => http://0.0.0.0:${PORT} 🚀`
  )
);
