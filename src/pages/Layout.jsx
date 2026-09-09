import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import {
  IconAcademicCap,
  IconClipboard,
  IconSettings,
  IconLogOut,
} from "../components/icons";

export default function Layout() {
  const { logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-brand">
          <div className="topbar-brand-mark">
            <IconAcademicCap size={17} />
          </div>
          <span className="topbar-title">Homework Manager</span>
        </div>
        <nav className="topbar-nav">
          <NavLink to="/classes" className={({ isActive }) => (isActive ? "active" : "")}>
            <IconAcademicCap size={16} />
            Classes
          </NavLink>
          <NavLink to="/assignments" className={({ isActive }) => (isActive ? "active" : "")}>
            <IconClipboard size={16} />
            Assignments
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>
            <IconSettings size={16} />
            Settings
          </NavLink>
        </nav>
        <button className="btn btn-ghost" style={{ marginBottom: 0 }} onClick={logout}>
          <IconLogOut size={16} />
          Log out
        </button>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
