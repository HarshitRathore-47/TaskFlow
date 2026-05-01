<div align="center">
  <img src="client/public/logo.svg" width="100" height="100" alt="Taskflow Logo" />
  <h1>Taskflow</h1>
  <p><b>Modern Full-Stack Project Management with Real-time Collaboration & Automated Workflows</b></p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js" alt="Node" />
    <img src="https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
    <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql" alt="Postgres" />
    <img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwind-css" alt="Tailwind" />
  </p>

  <p align="center">
    <a href="#✨-features">Features</a> •
    <a href="#🛠-tech-stack">Tech Stack</a> •
    <a href="#⚡-getting-started">Getting Started</a> •
    <a href="#🚀-deployment">Deployment</a> •
    <a href="#🔍-diagnostics">Diagnostics</a>
  </p>
</div>

---

## ✨ Features

### 🏢 Workspace Management
- **Multi-Workspace Architecture**: Create, join, and switch between isolated environments for different teams or projects.
- **Role-Based Access Control (RBAC)**: Manage members with dedicated roles like **ADMIN** and **MEMBER**.
- **Personalized Invites**: Professional invitation system via automated emails to onboard team members seamlessly.

### 📋 Project & Task Ecosystem
- **Kanban-Style Management**: High-level overview of task distribution across "Todo", "In Progress", and "Done".
- **Granular Task Details**: Define priorities (Low, Medium, High), task types (Bug, Feature, Improvement), and detailed descriptions.
- **Smart Assignment**: Assign tasks to team members with instant email notifications powered by **Inngest**.
- **Interactive Calendar**: View deadlines and project timelines in a clean, integrated calendar view.

### 📧 Automated Workflows & SMTP
- **Transactional Emails**: Automated notifications for task assignments and workspace invitations using **Brevo (formerly Sendinblue)**.
- **Background Jobs**: Persistent queue management via **Inngest** for reliable notification delivery.
- **Startup Diagnostics**: Built-in health check system to verify DB and SMTP status on server boot.

### 🎨 Premium UI/UX
- **Theme Engine**: Persistent Dark and Light mode support using Tailwind v4.
- **Real-time Analytics**: Visualized progress tracking and team performance charts using **Recharts**.
- **Responsive Layout**: Fully adaptive design for mobile, tablet, and high-resolution displays.

---

## 🛠 Tech Stack

### Frontend (Client)
- **React 19**: Utilizing the latest concurrent features and Vite for ultra-fast builds.
- **Redux Toolkit**: Robust state management for workspaces and authentication.
- **Tailwind CSS v4**: Modern, high-performance styling engine.
- **Lucide React**: Clean and consistent iconography.
- **Recharts**: Advanced data visualization for project analytics.

### Backend (Server)
- **Node.js & Express**: High-performance API server with ES Modules support.
- **Prisma ORM**: Type-safe database access and automated schema migrations.
- **PostgreSQL (Neon.tech)**: Serverless Postgres with branching capabilities.
- **JWT (JSON Web Token)**: Secure, stateless authentication flow.
- **Inngest**: Serverless event-driven orchestration for background jobs.
- **Nodemailer**: Secure SMTP integration with Port 465/SSL support.

---

## ⚡ Getting Started (Local Setup)

### 1. Prerequisites
- **Node.js**: v20 or higher
- **NPM**: v10 or higher
- **PostgreSQL**: Access to a Neon.tech instance or local Postgres.

### 2. Installation
Clone the repository and install all dependencies from the root:
```bash
# Installs root, client, and server dependencies simultaneously
npm run install-all
```

### 3. Environment Configuration
Create a `.env` file in the **server** directory:
```env
PORT=5000
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
DIRECT_URL="postgresql://user:pass@host/db?sslmode=require"
JWT_SECRET="your_jwt_secret"
SENDER_EMAIL="your_brevo_verified_email"
SMTP_PASSWORD="your_brevo_smtp_key"
FRONTEND_URL="http://localhost:5173"
```

Create a `.env` file in the **client** directory:
```env
VITE_BASEURL="http://localhost:5000/api"
```

### 4. Database Initialization
```bash
cd server
npx prisma generate
npx prisma db push
```

### 5. Running the App
From the project root, you can run both services:
```bash
# Run Frontend (Vite)
npm run client-dev

# Run Backend (Nodemon)
npm run server-dev
```

---

## 🚀 Deployment (Railway Industry Standard)

This project is pre-configured for **Railway** using a monorepo workspace structure.

### Server Configuration
- **Root Directory**: `/`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: Set via `PORT` variable (default 5000)

### Frontend Configuration
- **Root Directory**: `/`
- **Build Command**: `npm run build-client`
- **Start Command**: `npm run start-client`
- **Serving**: Uses a custom production Express server ([start-frontend.js](start-frontend.js)) for maximum reliability and SPA routing support.

---

## 🔍 Diagnostics

The server includes a professional **Startup Diagnostic Utility**. On every deployment or restart, the logs will show:
- **Environment Check**: Verifies if all critical keys (`DATABASE_URL`, `JWT_SECRET`, etc.) are present.
- **Database Status**: Confirms connectivity with Neon PostgreSQL.
- **SMTP Handshake**: Verifies the connection to Brevo SMTP on Port 465 (SSL).

Check your Railway **Deploy Logs** to see the full diagnostic report.

---

<div align="center">
  <sub>Built with ❤️ for High-Performance Teams.</sub>
</div>
