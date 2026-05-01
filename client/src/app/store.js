import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/themeSlice";
import workspaceReducer from "../features/workspaceSlice";
import authReducer from "../features/authSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    workspace: workspaceReducer,
    auth: authReducer,
  },
});
