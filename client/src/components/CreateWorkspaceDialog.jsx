import { useState } from "react";
import { XIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import api from "../configs/api";
import { addWorkspace } from "../features/workspaceSlice";

const CreateWorkspaceDialog = ({ isDialogOpen, setIsDialogOpen }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      const { data } = await api.post("/workspaces", formData);

      dispatch(addWorkspace(data.workspace));
      setIsDialogOpen(false);
      setFormData({ name: "", slug: "", description: "" });
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setFormData({ ...formData, name, slug });
  };

  if (!isDialogOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex items-center justify-center text-left z-50">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 w-full max-w-md text-zinc-900 dark:text-zinc-200 relative shadow-2xl">
        <button
          className="absolute top-3 right-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          onClick={() => setIsDialogOpen(false)}
        >
          <XIcon className="size-5" />
        </button>

        <h2 className="text-xl font-bold mb-4">Create New Workspace</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Workspace Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Workspace Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g. Acme Corp"
              className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium mb-1">Workspace Slug</label>
            <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 mt-1">
              <span className="text-zinc-400 text-sm">/</span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="bg-transparent text-zinc-900 dark:text-zinc-200 text-sm focus:outline-none flex-1"
                required
              />
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">
              This is your workspace's unique identifier.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="What's this workspace for?"
              className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm h-24 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
            >
              {isSubmitting ? "Creating..." : "Create Workspace"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkspaceDialog;
