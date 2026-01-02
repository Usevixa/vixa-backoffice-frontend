import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="transition-all duration-300 lg:pl-64">
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
