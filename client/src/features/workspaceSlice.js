import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../configs/api";

export const fetchWorkspaces = createAsyncThunk(
  "workspace/fetchWorkspaces",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/workspaces");
      return data.workspaces || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  workspaces: [],
  currentWorkspace: null,
  loading: false,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspaces: (state, action) => {
      state.workspaces = action.payload;
    },
    setCurrentWorkspace: (state, action) => {
      const workspaceId = typeof action.payload === 'string' ? action.payload : action.payload?.id;
      if (workspaceId) {
        localStorage.setItem("currentWorkspaceId", workspaceId);
        state.currentWorkspace = state.workspaces.find(
          (w) => w.id === workspaceId
        );
      } else {
        state.currentWorkspace = action.payload;
      }
    },
    addWorkspace: (state, action) => {
      state.workspaces.push(action.payload);

      // set current workspace to the new workspace
      if (state.currentWorkspace?.id !== action.payload.id) {
        state.currentWorkspace = action.payload;
      }
    },
    updateWorkspace: (state, action) => {
      state.workspaces = state.workspaces.map((w) =>
        w.id === action.payload.id ? action.payload : w
      );

      // if current workspace is updated, set it to the updated workspace
      if (state.currentWorkspace?.id === action.payload.id) {
        state.currentWorkspace = action.payload;
      }
    },
    deleteWorkspace: (state, action) => {
      state.workspaces = state.workspaces.filter(
        (w) => w.id !== action.payload
      );
      if (state.currentWorkspace?.id === action.payload) {
        state.currentWorkspace = state.workspaces[0] || null;
      }
    },
    addProject: (state, action) => {
      if (!state.currentWorkspace) return;
      state.currentWorkspace.projects.push(action.payload);
      // find workspace by id and add project to it
      state.workspaces = state.workspaces.map((w) =>
        w.id === state.currentWorkspace.id
          ? { ...w, projects: w.projects.concat(action.payload) }
          : w
      );
    },
    addTask: (state, action) => {
      if (!state.currentWorkspace) return;
      state.currentWorkspace.projects = state.currentWorkspace.projects.map(
        (p) => {
          if (p.id === action.payload.projectId) {
            p.tasks.push(action.payload);
          }
          return p;
        }
      );

      // find workspace and project by id and add task to it
      state.workspaces = state.workspaces.map((w) =>
        w.id === state.currentWorkspace.id
          ? {
              ...w,
              projects: w.projects.map((p) =>
                p.id === action.payload.projectId
                  ? { ...p, tasks: p.tasks.concat(action.payload) }
                  : p
              ),
            }
          : w
      );
    },
    updateTask: (state, action) => {
      if (!state.currentWorkspace) return;
      state.currentWorkspace.projects.map((p) => {
        if (p.id === action.payload.projectId) {
          p.tasks = p.tasks.map((t) =>
            t.id === action.payload.id ? action.payload : t
          );
        }
      });
      // find workspace and project by id and update task in it
      state.workspaces = state.workspaces.map((w) =>
        w.id === state.currentWorkspace.id
          ? {
              ...w,
              projects: w.projects.map((p) =>
                p.id === action.payload.projectId
                  ? {
                      ...p,
                      tasks: p.tasks.map((t) =>
                        t.id === action.payload.id ? action.payload : t
                      ),
                    }
                  : p
              ),
            }
          : w
      );
    },
    deleteTask: (state, action) => {
      if (!state.currentWorkspace) return;
      state.currentWorkspace.projects.map((p) => {
        p.tasks = p.tasks.filter((t) => !action.payload.includes(t.id));
        return p;
      });
      // find workspace and project by id and delete task from it
      state.workspaces = state.workspaces.map((w) =>
        w.id === state.currentWorkspace.id
          ? {
              ...w,
              projects: w.projects.map((p) =>
                p.id === action.payload.projectId
                  ? {
                      ...p,
                      tasks: p.tasks.filter(
                        (t) => !action.payload.includes(t.id)
                      ),
                    }
                  : p
              ),
            }
          : w
      );
    },
    clearWorkspaces: (state) => {
      state.workspaces = [];
      state.currentWorkspace = null;
      localStorage.removeItem("currentWorkspaceId");
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchWorkspaces.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchWorkspaces.fulfilled, (state, action) => {
      state.loading = false;
      state.workspaces = action.payload || [];

      if (state.workspaces.length === 0) {
        state.currentWorkspace = null;
        localStorage.removeItem("currentWorkspaceId");
        return;
      }

      const storedId = localStorage.getItem("currentWorkspaceId");
      if (storedId) {
        const found = state.workspaces.find((w) => w.id === storedId);
        state.currentWorkspace = found || state.workspaces[0];
        if (!found) {
           localStorage.setItem("currentWorkspaceId", state.workspaces[0].id);
        }
      } else {
        state.currentWorkspace = state.workspaces[0];
        localStorage.setItem("currentWorkspaceId", state.workspaces[0].id);
      }
    });

    builder.addCase(fetchWorkspaces.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const {
  setWorkspaces,
  setCurrentWorkspace,
  addWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addProject,
  addTask,
  updateTask,
  deleteTask,
  clearWorkspaces,
} = workspaceSlice.actions;
export default workspaceSlice.reducer;
