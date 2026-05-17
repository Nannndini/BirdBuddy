import { NavLink, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { loadCollection } from "@/lib/storage";

const ScanIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>;
const CollectionIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const MapIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>;
const BellIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;

const TABS = [
  { path: "/scan", label: "Scan", icon: ScanIcon },
  { path: "/collection", label: "Collection", icon: CollectionIcon },
  { path: "/map", label: "Map", icon: MapIcon },
  { path: "/alerts", label: "Alerts", icon: BellIcon },
];

export default function Layout() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(loadCollection().length);
    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="appShell">
      <header className="appTop">
        <div className="container appTop__row">
          <NavLink to="/" className="brand">
            <div className="brand__mark" />
            <div>
              <div className="brand__name">BIRDBUDDY</div>
              <div className="brand__tag">AI Identification System</div>
            </div>
          </NavLink>
          
          <nav className="tabs">
            {TABS.map((t) => (
              <NavLink 
                key={t.path}
                to={t.path}
                className={({ isActive }) => `tab ${isActive ? "tab--active" : ""}`}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {t.label === "Collection" && <span style={{ color: 'var(--neon-gold)', marginRight: '4px' }}>★ {count}</span>}
                {t.label !== "Collection" && <t.icon />}
                <span>{t.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="appMain">
        <Outlet />
      </main>
    </div>
  );
}
