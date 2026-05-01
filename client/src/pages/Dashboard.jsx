import { Plus, LayoutDashboard, Briefcase, Users2, Target, PlusCircle } from "lucide-react";
import { useState } from "react";
import StatsGrid from "../components/StatsGrid";
import ProjectOverview from "../components/ProjectOverview";
import RecentActivity from "../components/RecentActivity";
import TasksSummary from "../components/TasksSummary";
import CreateProjectDialog from "../components/CreateProjectDialog";
import CreateWorkspaceDialog from "../components/CreateWorkspaceDialog";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { currentWorkspace } = useSelector((state) => state.workspace);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isWorkspaceDialogOpen, setIsWorkspaceDialogOpen] = useState(false);

  if (!currentWorkspace) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center">
        <div className="p-6 bg-blue-500/10 rounded-full">
          <LayoutDashboard className="size-16 text-blue-500" />
        </div>
        <div className="max-w-md space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {user?.name}!
          </h1>
          <p className="text-gray-500 dark:text-zinc-400">
            You are not part of any workspace yet. You can create your own workspace or wait for an invitation from an administrator.
          </p>
        </div>
        <button
          onClick={() => setIsWorkspaceDialogOpen(true)}
          className="flex items-center gap-2 px-8 py-3 text-lg font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-500/20"
        >
          <PlusCircle size={24} /> Create Your First Workspace
        </button>

        <CreateWorkspaceDialog
          isDialogOpen={isWorkspaceDialogOpen}
          setIsDialogOpen={setIsWorkspaceDialogOpen}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl">
            <LayoutDashboard className="size-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-gray-500 dark:text-zinc-400 text-sm mt-0.5">
              Welcome back, <span className="font-semibold text-blue-500">{user?.name || "User"}</span>. Here's your workspace status.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} /> New Project
          </button>
        </div>

        <CreateProjectDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>

      {/* Stats Grid - Real-time metrics */}
      <StatsGrid />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Projects Overview Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-1 shadow-sm">
             <div className="flex items-center gap-2 p-4 border-b border-zinc-100 dark:border-zinc-800">
                <Briefcase className="size-5 text-zinc-400" />
                <h2 className="font-bold text-zinc-800 dark:text-zinc-200">Active Projects</h2>
             </div>
             <ProjectOverview />
          </div>
          
          {/* Activity Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-1 shadow-sm">
             <div className="flex items-center gap-2 p-4 border-b border-zinc-100 dark:border-zinc-800">
                <Target className="size-5 text-zinc-400" />
                <h2 className="font-bold text-zinc-800 dark:text-zinc-200">Recent Activity</h2>
             </div>
             <RecentActivity />
          </div>
        </div>

        <div className="space-y-8">
          {/* Tasks Summary Sidebar */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-1 shadow-sm">
             <div className="flex items-center gap-2 p-4 border-b border-zinc-100 dark:border-zinc-800">
                <Users2 className="size-5 text-zinc-400" />
                <h2 className="font-bold text-zinc-800 dark:text-zinc-200">Team Tasks</h2>
             </div>
             <div className="p-2">
                <TasksSummary />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
