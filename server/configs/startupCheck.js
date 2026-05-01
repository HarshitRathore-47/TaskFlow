import prisma from "./prisma.js";
import nodemailer from "nodemailer";

const runStartupChecks = async () => {
  console.log("\n🔍 --- RUNNING STARTUP DIAGNOSTICS ---");

  // 1. Environment Variables Check
  const requiredEnv = [
    "DATABASE_URL",
    "DIRECT_URL",
    "JWT_SECRET",
    "SENDER_EMAIL",
    "BREVO_API_KEY",
    "FRONTEND_URL",
  ];

  console.log("\n📦 Environment Variables:");
  requiredEnv.forEach((env) => {
    if (process.env[env]) {
      const value = env.includes("PASSWORD") || env.includes("SECRET") || env.includes("URL") ? "********" : process.env[env];
      console.log(`   ✅ ${env} is set (${value})`);
    } else {
      console.log(`   ❌ ${env} is MISSING`);
    }
  });

  console.log(`\n🌐 Server Config:`);
  console.log(`   - PORT: ${process.env.PORT || 5000}`);
  console.log(`   - NODE_ENV: ${process.env.NODE_ENV || "development"}`);

  // 2. Database Connection Check
  console.log("\n🗄️  Database Connection:");
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("   ✅ Database connection successful");
  } catch (err) {
    console.log(`   ❌ Database connection failed: ${err.message}`);
  }

  // 3. Brevo API Check (Run in background)
  console.log("\n📧 Brevo API Configuration: Check started in background...");
  setTimeout(async () => {
    try {
        const response = await fetch("https://api.brevo.com/v3/account", {
          method: "GET",
          headers: {
            "accept": "application/json",
            "api-key": process.env.BREVO_API_KEY,
          },
        });
      
      if (response.ok) {
        console.log("   ✅ Brevo API authentication successful");
      } else {
        const data = await response.json();
        console.log(`   ❌ Brevo API authentication failed: ${data.message}`);
      }
    } catch (err) {
      console.log(`   ❌ Brevo API check failed: ${err.message}`);
    }
  }, 1000);

  console.log("\n🚀 --- INITIAL DIAGNOSTICS COMPLETE ---\n");
};

export default runStartupChecks;
