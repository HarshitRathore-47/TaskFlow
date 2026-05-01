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
      state.currentWorkspace.projects.push(action.payload);
      // find workspace by id and add project to it
      state.workspaces = state.workspaces.map((w) =>
        w.id === state.currentWorkspace.id
          ? { ...w, projects: w.projects.concat(action.payload) }
          : w
      );
    },
    addTask: (state, action) => {
      state.currentWorkspace.projects = state.currentWorkspace.projects.map(
        (p) => {
          console.log(
            p.id,
            action.payload.projectId,
            p.id === action.payload.projectId
          );
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
  },

  extraReducers: (builder) => {
    builder.addCase(fetchWorkspaces.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchWorkspaces.fulfilled, (state, action) => {
      state.loading = false;
      state.workspaces = action.payload;

      const storedId = localStorage.getItem("currentWorkspaceId");
      if (storedId) {
        state.currentWorkspace =
          action.payload.find((w) => w.id === storedId) ||
          action.payload[0] ||
          null;
      } else {
        state.currentWorkspace = action.payload[0] || null;
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
} = workspaceSlice.actions;
export default workspaceSlice.reducer;
