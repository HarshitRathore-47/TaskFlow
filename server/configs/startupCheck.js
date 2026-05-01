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
    "SMTP_PASSWORD",
  ];
  console.log("\n📦 Environment Variables:");
  requiredEnv.forEach((env) => {
    if (process.env[env]) {
      console.log(`   ✅ ${env} is set`);
    } else {
      console.log(`   ❌ ${env} is MISSING`);
    }
  });

  // 2. Database Connection Check
  console.log("\n🗄️  Database Connection:");
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("   ✅ Database connection successful");
  } catch (err) {
    console.log(`   ❌ Database connection failed: ${err.message}`);
  }

  // 3. SMTP Configuration Check
  console.log("\n📧 SMTP Configuration:");
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    await transporter.verify();
    console.log("   ✅ SMTP authentication successful");
  } catch (err) {
    console.log(`   ❌ SMTP authentication failed: ${err.message}`);
  }

  console.log("\n🚀 --- DIAGNOSTICS COMPLETE ---\n");
};

export default runStartupChecks;
