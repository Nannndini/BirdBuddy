import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import TopNav from "@/components/ui/TopNav";

const ScanIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>;
const FeatherIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>;
const CollectionIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const MapIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>;
const BellIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;

const TABS = [
  { path: "/scan", label: "Scan", icon: ScanIcon },
  { path: "/species/white-throated-kingfisher", label: "Species", icon: FeatherIcon },
  { path: "/collection", label: "Collection", icon: CollectionIcon },
  { path: "/map", label: "Map", icon: MapIcon },
  { path: "/alerts", label: "Alerts", icon: BellIcon },
];

export default function Layout() {
  const location = useLocation();

  const isActiveTab = (currentPath: string, tabPath: string) => {
    if (tabPath.includes("/species")) return currentPath.startsWith("/species");
    return currentPath === tabPath;
  };

  return (
    <div style={{ background: 'var(--col-deep)', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      
      {/* Mobile App Container */}
      <div style={{ width: '100%', maxWidth: '430px', background: 'var(--col-deep)', position: 'relative', overflowX: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Navigation */}
        <TopNav />

        {/* Main Content Area with Transitions */}
        <main style={{ flex: 1, position: 'relative', paddingBottom: '100px', display: 'flex', flexDirection: 'column' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        <nav 
          className="glass" 
          style={{ 
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', 
            width: '100%', maxWidth: '430px', height: '84px',
            paddingBottom: 'env(safe-area-inset-bottom, 20px)',
            borderTop: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px 24px 0 0',
            display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 100
          }}
        >
          {TABS.map((tab) => {
            const active = isActiveTab(location.pathname, tab.path);
            return (
              <NavLink 
                key={tab.path} 
                to={tab.path}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  textDecoration: 'none', position: 'relative',
                  color: active ? 'var(--neon-green)' : 'var(--text-muted)',
                  width: '64px', height: '100%', paddingTop: '12px',
                  minWidth: '44px', minHeight: '44px' // Touch friendly tap targets
                }}
              >
                <motion.div 
                  animate={{ scale: active ? 1.15 : 1, y: active ? -2 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  <tab.icon />
                </motion.div>
                <span style={{ fontSize: '0.65rem', fontFamily: 'var(--sans)', fontWeight: active ? 600 : 400, position: 'relative', zIndex: 2 }}>
                  {tab.label}
                </span>
                
                {/* Animated Background Pill */}
                {active && (
                  <motion.div
                    layoutId="bottom-nav-pill"
                    style={{ position: 'absolute', inset: '6px 4px', background: 'rgba(74, 222, 128, 0.1)', borderRadius: '16px', zIndex: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

      </div>
    </div>
  );
}
