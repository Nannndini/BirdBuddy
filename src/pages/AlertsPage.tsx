import { Link } from "react-router-dom";
import { useState } from "react";
import { SPECIES } from "@/lib/species";

const MOCK_ALERTS = [
  { id: 1, speciesId: "greater-flamingo", location: "Wetlands · 7.2 km away", time: "3 hours ago", reporter: "Alice M.", avatar: "https://i.pravatar.cc/150?u=1", isRare: true },
  { id: 2, speciesId: "indian-peafowl", location: "Forest edge · 4.1 km away", time: "Today", reporter: "Raj V.", avatar: "https://i.pravatar.cc/150?u=2", isRare: false },
  { id: 3, speciesId: "white-throated-kingfisher", location: "Lake edge · 2.1 km away", time: "Now", reporter: "Sarah K.", avatar: "https://i.pravatar.cc/150?u=3", isRare: false }
];

export default function AlertsPage() {
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  
  // Use mock alerts data
  const alerts = MOCK_ALERTS;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const filtered = alerts.filter(a => {
    if (filter === "rare") return a.isRare;
    if (filter === "today") return a.time === "Today" || a.time === "Now";
    // Mock "nearby" logic
    if (filter === "nearby") return a.location.includes("2.1 km") || a.location.includes("4.1 km");
    return true;
  });

  return (
    <section className="container" style={{ padding: '40px 20px', minHeight: '100vh', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="rowTop fade-up" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 className="gradient-text" style={{ fontFamily: 'var(--display)', fontSize: 'clamp(2rem, 4vw, 3rem)', margin: 0 }}>
              RARE SIGHTINGS
            </h1>
            <span className="pulse-dot" style={{ width: '12px', height: '12px' }}></span>
          </div>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0', fontSize: '1.1rem' }}>Live community feed of notable nearby reports (Simulated data).</p>
        </div>
        <button 
          onClick={handleRefresh}
          className={`glass glass-hover ${refreshing ? 'spinning' : ''}`}
          style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--neon-green)', cursor: 'pointer', flexShrink: 0 }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.8 1 6.5 2.5L21 8M21 3v5h-5"/></svg>
        </button>
      </div>

      {/* Filters */}
      <div className="fade-up fade-up-delay-1" style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '12px', scrollbarWidth: 'none' }}>
        {["all", "nearby", "rare", "today"].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={filter === f ? "glass nature-glow" : "glass glass-hover"}
            style={{ padding: '10px 20px', borderRadius: '99px', border: filter === f ? '1px solid var(--neon-green)' : '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: filter === f ? 'var(--neon-green)' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: '0.95rem', fontWeight: 600, textTransform: 'capitalize', flexShrink: 0 }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filtered.length === 0 ? (
          <div className="glass fade-up fade-up-delay-2" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: '24px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🍃</div>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.8rem', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>No rare sightings nearby</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1.1rem' }}>Try expanding your filters or report a sighting yourself!</p>
          </div>
        ) : (
          filtered.map((a, i) => {
            const spec = SPECIES.find(x => x.id === a.speciesId);
            const imgSrc = `https://images.unsplash.com/photo-1555169062-013468b47731?q=80&w=400&auto=format&fit=crop&seed=${spec?.id}`;
            const delayClass = i === 0 ? 'fade-up-delay-1' : i === 1 ? 'fade-up-delay-2' : 'fade-up-delay-3';
            const rarityColor = spec?.rarity === 'rare' ? 'var(--neon-gold)' : spec?.rarity === 'uncommon' ? 'var(--neon-orange)' : 'var(--neon-teal)';
            
            return (
              <div key={a.id} className={`glass glass-hover fade-up ${delayClass}`} style={{ borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'row', gap: '20px' }}>
                {/* Image Left */}
                <div style={{ width: '160px', flexShrink: 0, position: 'relative' }}>
                  <img src={imgSrc} alt={spec?.commonName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', padding: '6px 12px', borderRadius: '99px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', border: `1px solid ${rarityColor}`, color: rarityColor, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {spec?.rarity}
                  </div>
                </div>

                {/* Details Right */}
                <div style={{ padding: '24px 24px 24px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontFamily: 'var(--display)', fontSize: '1.6rem', margin: 0, color: 'var(--text-primary)' }}>{spec?.commonName}</h3>
                    <span style={{ fontSize: '0.9rem', color: 'var(--neon-green)', fontWeight: 600, fontFamily: 'var(--mono)' }}>{a.time}</span>
                  </div>
                  
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {a.location}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={a.avatar} alt={a.reporter} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' }} />
                      <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{a.reporter}</span>
                    </div>
                    
                    <Link to="/map" className="glass-hover" style={{ padding: '10px 20px', borderRadius: '99px', border: '1px solid var(--neon-teal)', background: 'transparent', color: 'var(--neon-teal)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', transition: 'background 0.2s' }}>
                      View on Map
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .spinning svg {
          animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 600px) {
          .glass.fade-up.collection-card { flex-direction: column !important; }
          .glass.fade-up.collection-card > div:first-child { width: 100% !important; height: 200px; }
          .glass.fade-up.collection-card > div:last-child { padding: 20px !important; }
        }
      `}</style>
    </section>
  );
}
