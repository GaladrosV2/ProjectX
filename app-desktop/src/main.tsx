// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router-dom";
import Routes from "./routes"; // we'll create this file next
import "./index.css";

const router = createHashRouter(Routes); // hash router = Tauri-friendly

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
