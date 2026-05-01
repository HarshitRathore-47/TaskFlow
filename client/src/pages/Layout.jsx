import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadTheme } from "../features/themeSlice";
import { Loader2Icon } from "lucide-react";
import { fetchWorkspaces } from "../features/workspaceSlice";
import { fetchMe } from "../features/authSlice";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { loading: workspaceLoading, workspaces } = useSelector((state) => state.workspace);
  const { user, token, loading: authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initial load of theme
  useEffect(() => {
    dispatch(loadTheme());
  }, []);

  // Initial load of user and workspaces
  useEffect(() => {
    if (token && !user && !authLoading) {
      dispatch(fetchMe());
    }
  }, [token, user, authLoading, dispatch]);

  useEffect(() => {
    if (user && workspaces.length === 0 && !workspaceLoading) {
      // Only fetch if we have a user but no workspaces and we aren't already loading
      // To prevent infinite loop if user actually has 0 workspaces, 
      // we should ideally have a way to know if we've already tried fetching.
      // For now, let's just fetch once when user changes.
      dispatch(fetchWorkspaces());
    }
  }, [user?.id, dispatch]); // Only trigger when user ID changes

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-950">
        <Loader2Icon className="size-7 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (workspaceLoading)
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-950">
        <Loader2Icon className="size-7 text-blue-500 animate-spin" />
      </div>
    );

  // If user has no workspaces, we might need a "Create Workspace" view
  // For now, let's just show the layout and handle empty workspaces in Sidebar/Dashboard
  
  return (
    <div className="flex bg-white dark:bg-zinc-950 text-gray-900 dark:text-slate-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex flex-col h-screen">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="flex-1 h-full p-6 xl:p-10 xl:px-16 overflow-y-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
