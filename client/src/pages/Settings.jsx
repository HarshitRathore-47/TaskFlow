import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Building, Shield, Bell, Save, Camera } from "lucide-react";
import toast from "react-hot-toast";

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const { currentWorkspace } = useSelector((state) => state.workspace);
  const [activeTab, setActiveTab] = useState("profile");

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [workspaceData, setWorkspaceData] = useState({
    name: currentWorkspace?.name || "",
    description: currentWorkspace?.description || "",
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // In a real app, you'd dispatch an update action here
    toast.success("Profile updated successfully (Simulated)");
  };

  const handleWorkspaceUpdate = (e) => {
    e.preventDefault();
    toast.success("Workspace settings updated (Simulated)");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "workspace", label: "Workspace", icon: Building },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
            Settings
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 text-sm">
            Manage your account and workspace preferences
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-900"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                <div className="relative group">
                  <div className="size-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <button className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    <Camera size={14} className="text-zinc-600 dark:text-zinc-400" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Profile Photo</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-gray-500 dark:text-zinc-500 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all"
                >
                  <Save size={18} /> Save Profile
                </button>
              </form>
            </div>
          )}

          {activeTab === "workspace" && (
            <div className="space-y-6">
              <form onSubmit={handleWorkspaceUpdate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Workspace Name</label>
                  <input
                    type="text"
                    value={workspaceData.name}
                    onChange={(e) => setWorkspaceData({ ...workspaceData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Description</label>
                  <textarea
                    rows={4}
                    value={workspaceData.description}
                    onChange={(e) => setWorkspaceData({ ...workspaceData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all"
                >
                  <Save size={18} /> Update Workspace
                </button>
              </form>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="py-20 text-center space-y-4">
              <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full w-fit mx-auto">
                <Bell size={32} className="text-zinc-400" />
              </div>
              <p className="text-gray-500 dark:text-zinc-400">Notification preferences coming soon</p>
            </div>
          )}

          {activeTab === "security" && (
            <div className="py-20 text-center space-y-4">
              <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full w-fit mx-auto">
                <Shield size={32} className="text-zinc-400" />
              </div>
              <p className="text-gray-500 dark:text-zinc-400">Security settings coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
