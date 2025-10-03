import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import VoiceBar from "../components/VoiceBar";

export default function Shell() {
  return (
    <div className="grid grid-cols-[260px_1fr] grid-rows-[1fr_auto] h-screen text-white/90">
      <aside className="bg-black/20 border-r border-white/10">
        <Sidebar />
      </aside>

      <main className="bg-transparent overflow-hidden">
        <Outlet />
      </main>

      <footer className="col-span-2 border-t border-white/10 bg-black/20">
        <VoiceBar />
      </footer>
    </div>
  );
}
