import { NavLink, Outlet } from "react-router-dom";
import MagicRings from "@/components/ui/MagicRings";

export default function Layout() {
  return (
    <div className="appShell">
      <MagicRings />
      <header className="appTop">
        <div className="container appTop__row">
          <div className="brand">
            <div className="brand__mark" aria-hidden="true" />
            <div>
              <div className="brand__name">BirdBuddy</div>
              <div className="brand__tag">AI Nature Identifier</div>
            </div>
          </div>

          <nav className="tabs" aria-label="App">
            <NavLink to="/scan" className={({ isActive }) => (isActive ? "tab tab--active" : "tab")}>Scan</NavLink>
            <NavLink to="/collection" className={({ isActive }) => (isActive ? "tab tab--active" : "tab")}>Collection</NavLink>
            <NavLink to="/map" className={({ isActive }) => (isActive ? "tab tab--active" : "tab")}>Map</NavLink>
            <NavLink to="/alerts" className={({ isActive }) => (isActive ? "tab tab--active" : "tab")}>Alerts</NavLink>
          </nav>
        </div>
      </header>

      <main className="appMain">
        <Outlet />
      </main>
    </div>
  );
}
