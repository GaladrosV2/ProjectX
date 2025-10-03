// src/routes.tsx
import type { RouteObject } from "react-router-dom";

// pages
import Auth from "./pages/Auth";
import Servers from "./pages/Servers";
import Channel from "./pages/Channel";

// layout (you have src/layouts/Shell.tsx in your tree)
import Shell from "./layouts/Shell";

const NotFound = () => (
  <div className="p-6 text-red-400">404 – Route not found</div>
);

const Routes: RouteObject[] = [
  {
    element: <Shell />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Auth /> },
      { path: "/servers", element: <Servers /> },
      { path: "/servers/:serverId/channels/:channelId", element: <Channel /> },
    ],
  },
];

export default Routes;
