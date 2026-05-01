<div align="center">

  <img src="client/public/logo.svg" width="80" height="80" alt="Taskflow Logo" />

  <h1>Taskflow</h1>

  **Modern Full-Stack Team Task Manager with Real-time Collaboration & Automated Workflows**

  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/yourusername/taskflow/pulls)
  [![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?logo=react)](https://reactjs.org/)
  [![Powered by Inngest](https://img.shields.io/badge/Powered%20by-Inngest-FF4F00?logo=inngest)](https://www.inngest.com/)

  <p align="center">
    <a href="#✨-features">Features</a> •
    <a href="#🛠-tech-stack">Tech Stack</a> •
    <a href="#⚡-getting-started">Getting Started</a> •
    <a href="#🚀-deployment">Deployment</a>
  </p>

</div>

---

## ✨ Features

### 🏢 Workspace Management
- **Multi-Workspace Support**: Create and switch between different isolated workspaces.
- **Team Collaboration**: Invite members via email and manage their roles.
- **RBAC (Role-Based Access Control)**: Granular permissions for Workspace Admins, Project Leads, and Members.

### 📋 Project & Task Tracking
- **Kanban-Style Dashboard**: Visualize project progress and task distribution.
- **Detailed Task Management**: Create tasks with descriptions, priority levels (Low, Medium, High), and types (Bug, Feature, etc.).
- **Smart Assignment**: Assign tasks to specific team members with automated notifications.
- **Interactive Calendar**: Track deadlines and upcoming milestones with a built-in task calendar.

### 📧 Automated Workflows (Inngest)
- **Task Notifications**: Instant, professional HTML emails when a task is assigned.
- **Due Date Reminders**: Automated follow-up emails on the day of the deadline if tasks aren't completed.
- **Workspace Invites**: Clean invitation flow with personalized emails.

### 🎨 Modern UI/UX
- **Dark & Light Mode**: Seamless theme switching with persistent preferences.
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile views.
- **Real-time Analytics**: Visual charts for task status and team performance.

---

## 🛠 Tech Stack

### Frontend
- **React 19** (Vite)
- **Redux Toolkit** (State Management)
- **Tailwind CSS v4** (Modern Styling)
- **Lucide React** (Beautiful Icons)
- **Recharts** (Data Visualization)

### Backend
- **Node.js & Express**
- **Prisma ORM** (Database Management)
- **PostgreSQL** (Neon.tech / Railway)
- **JWT** (Secure Authentication)
- **Inngest** (Background Jobs & Reminders)
- **Nodemailer** (Transactional Emails via Brevo)

---

## ⚡ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL Database (Local or Neon.tech)
- Inngest Dev Server

### 2. Installation
Clone the repository and install dependencies for both root, client, and server:
```bash
npm run install-all
```

### 3. Environment Variables
Create a `.env` file in the `/server` directory:
```env
DATABASE_URL="your_postgresql_url"
DIRECT_URL="your_direct_url"
JWT_SECRET="your_secret"
SENDER_EMAIL="your_verified_email"
SMTP_PASSWORD="your_smtp_key"
FRONTEND_URL="http://localhost:5173"
```

Create a `.env` file in the `/client` directory:
```env
VITE_BASEURL="http://localhost:5000/api"
```

### 4. Database Setup
```bash
cd server
npx prisma generate
npx prisma db push
```

### 5. Running the App
Open two terminals:
```bash
# Start Backend
cd server
npm run server

# Start Frontend
cd client
npm run dev
```

---

## 🚀 Deployment

### Railway.app (Recommended)
This project is pre-configured for Railway deployment using the included `railway.json` and root `package.json` workspaces.

1. Connect your GitHub repository to Railway.
2. Add a **PostgreSQL** service.
3. Deploy the `/server` folder as the Backend service.
4. Deploy the `/client` folder as the Frontend service.
5. Set the required Environment Variables in the Railway dashboard.


<div align="center">
  Built with ❤️ for teams that value productivity.
</div>
