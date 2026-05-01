import { FolderOpen, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function StatsGrid() {
  const currentWorkspace = useSelector(
    (state) => state?.workspace?.currentWorkspace || null
  );

  const stats = useMemo(() => {
    if (!currentWorkspace) {
      return { totalTasks: 0, completedTasks: 0, pendingTasks: 0, overdueTasks: 0 };
    }
    
    const allTasks = currentWorkspace.projects.flatMap(p => p.tasks);
    const now = new Date();

    return {
      totalTasks: allTasks.length,
      completedTasks: allTasks.filter(t => t.status === "DONE").length,
      pendingTasks: allTasks.filter(t => t.status !== "DONE").length,
      overdueTasks: allTasks.filter(t => 
        t.status !== "DONE" && 
        t.due_date && 
        new Date(t.due_date) < now
      ).length,
    };
  }, [currentWorkspace]);

  const statCards = [
    {
      icon: FolderOpen,
      title: "Total Tasks",
      value: stats.totalTasks,
      subtitle: "In this workspace",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-500",
    },
    {
      icon: Clock,
      title: "Pending Tasks",
      value: stats.pendingTasks,
      subtitle: "Tasks in progress",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-500",
    },
    {
      icon: CheckCircle,
      title: "Completed",
      value: stats.completedTasks,
      subtitle: "Tasks finished",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-500",
    },
    {
      icon: AlertTriangle,
      title: "Overdue",
      value: stats.overdueTasks,
      subtitle: "Need immediate attention",
      bgColor: "bg-red-500/10",
      textColor: "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-9">
      {statCards.map(
        ({ icon: Icon, title, value, subtitle, bgColor, textColor }, i) => (
          <div
            key={i}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition duration-200 rounded-lg shadow-sm"
          >
            <div className="p-6 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                    {title}
                  </p>
                  <p className="text-3xl font-bold text-zinc-800 dark:text-white">
                    {value}
                  </p>
                  {subtitle && (
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-xl ${bgColor} bg-opacity-20`}>
                  <Icon size={20} className={textColor} />
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
