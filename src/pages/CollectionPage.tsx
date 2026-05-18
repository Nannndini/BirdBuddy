import { SPECIES } from "@/lib/species";
import { loadCollection, removeFromCollection } from "@/lib/storage";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

// Icons & Graphics
const AnimatedBird = () => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="var(--neon-green)" opacity="0.8" style={{ animation: 'float 3s ease-in-out infinite' }}>
    <path d="M22 3.1c-.8.4-1.7.6-2.6.7 1-.6 1.7-1.5 2-2.6-.9.5-1.9.9-2.9 1.1-.8-.9-2-1.4-3.3-1.4-2.5 0-4.6 2-4.6 4.6 0 .4 0 .7.1 1-3.8-.2-7.2-2-9.4-4.8-.4.7-.6 1.4-.6 2.3 0 1.6.8 3 2 3.8-.7 0-1.4-.2-2-.6v.1c0 2.2 1.6 4.1 3.7 4.5-.4.1-.8.2-1.2.2-.3 0-.6 0-.9-.1.6 1.8 2.3 3.1 4.3 3.2-1.6 1.2-3.6 2-5.7 2-.4 0-.7 0-1.1-.1 2 1.3 4.4 2 7 2 8.4 0 13-7 13-13v-.6c.9-.6 1.7-1.4 2.3-2.3z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

export default function CollectionPage() {
  const [tick, setTick] = useState(0);
  const [search, setSearch] = useState("");
  const [sortObj, setSortObj] = useState<"recent" | "az" | "rarity">("recent");

  const items = useMemo(() => loadCollection(), [tick]);

  const stats = useMemo(() => {
    const total = items.length;
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const thisWeek = items.filter(it => now - it.addedAt < oneWeek).length;
    let rare = 0;
    items.forEach(it => {
      const s = SPECIES.find(x => x.id === it.id);
      if (s && (s.rarity === 'rare' || (s.rarity as any) === 'legendary')) rare++;
    });
    return { total, thisWeek, rare };
  }, [items]);

  const cards = useMemo(() => {
    let mapped = items.map((it) => {
      const s = SPECIES.find((x) => x.id === it.id);
      return { it, s, searchStr: (s?.commonName + " " + s?.scientificName).toLowerCase() };
    });

    if (search) {
      const sq = search.toLowerCase();
      mapped = mapped.filter(x => x.searchStr.includes(sq));
    }

    mapped.sort((a, b) => {
      if (sortObj === "az") {
        return (a.s?.commonName ?? "").localeCompare(b.s?.commonName ?? "");
      } else if (sortObj === "rarity") {
        const rVal = (r?: string) => r === "rare" ? 3 : r === "uncommon" ? 2 : 1;
        return rVal(b.s?.rarity) - rVal(a.s?.rarity);
      }
      return b.it.addedAt - a.it.addedAt;
    });

    return mapped;
  }, [items, search, sortObj]);

  const rarityColor = (r: string) => r === 'rare' ? 'var(--neon-gold)' : r === 'uncommon' ? 'var(--neon-orange)' : 'var(--neon-teal)';

  return (
    <section style={{ padding: '40px 20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Header */}
      <div className="fade-up" style={{ width: '100%', maxWidth: '1200px' }}>
        <h1 className="gradient-text" style={{ fontFamily: 'var(--display)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', margin: '0 0 24px 0', textAlign: 'center' }}>
          MY FIELD JOURNAL
        </h1>
        
        {/* Milestone Banners */}
        {stats.total >= 1 && stats.total < 5 && (
           <div className="glass nature-glow fade-up" style={{ padding: '16px', borderRadius: '16px', marginBottom: '24px', textAlign: 'center', fontWeight: 600, color: 'var(--text-primary)' }}>
             🎉 First bird identified! Keep exploring!
           </div>
        )}
        {stats.total >= 5 && stats.total < 10 && (
           <div className="glass nature-glow fade-up" style={{ padding: '16px', borderRadius: '16px', marginBottom: '24px', textAlign: 'center', fontWeight: 600, color: 'var(--neon-orange)' }}>
             🔥 5 species collected! You're on a streak!
           </div>
        )}
        {stats.total >= 10 && (
           <div className="glass nature-glow fade-up" style={{ padding: '16px', borderRadius: '16px', marginBottom: '24px', textAlign: 'center', fontWeight: 700, color: 'var(--neon-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
             🌟 {stats.total} species — Field Expert!
           </div>
        )}

        {/* Stats Row */}
        <div className="glass" style={{ display: 'flex', justifyContent: 'center', gap: '32px', padding: '24px', borderRadius: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontFamily: 'var(--mono)', color: 'var(--neon-green)', fontWeight: 700 }}>{stats.total}</div>
            <div className="section-label">Species</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontFamily: 'var(--mono)', color: 'var(--neon-teal)', fontWeight: 700 }}>{stats.thisWeek}</div>
            <div className="section-label">This Week</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontFamily: 'var(--mono)', color: 'var(--neon-gold)', fontWeight: 700 }}>{stats.rare}</div>
            <div className="section-label">Rare Finds</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', borderRadius: '99px', flex: '1 1 300px' }}>
            <div style={{ color: 'var(--text-muted)' }}><SearchIcon /></div>
            <input 
              type="text" 
              placeholder="Search field journal..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontFamily: 'var(--sans)', fontSize: '1rem' }} 
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {["recent", "az", "rarity"].map((s) => (
              <button 
                key={s}
                onClick={() => setSortObj(s as any)}
                className={sortObj === s ? "glass nature-glow" : "glass glass-hover"}
                style={{ padding: '10px 16px', borderRadius: '99px', border: sortObj === s ? '1px solid var(--neon-green)' : '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: sortObj === s ? 'var(--neon-green)' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '0.85rem', textTransform: 'uppercase' }}
              >
                {s === 'recent' ? 'Recently Added' : s === 'az' ? 'A-Z' : 'Rarity'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        {items.length === 0 ? (
          <div className="fade-up fade-up-delay-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>
            <AnimatedBird />
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '2rem', color: 'var(--text-primary)', margin: '24px 0 8px 0' }}>No birds spotted yet</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontFamily: 'var(--sans)', fontSize: '1.1rem' }}>Your field journal is empty. Time to step outside!</p>
            <Link to="/scan" className="glass-hover" style={{ padding: '16px 32px', borderRadius: '99px', background: 'var(--neon-green)', color: '#000', fontWeight: 700, textDecoration: 'none', display: 'inline-block', fontFamily: 'var(--sans)' }}>
              Start scanning →
            </Link>
          </div>
        ) : cards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
            No results found for "{search}"
          </div>
        ) : (
          <div className="collection-grid">
            {cards.map(({ it, s }, i) => {
               const delayClass = i % 3 === 0 ? '' : i % 3 === 1 ? 'fade-up-delay-1' : 'fade-up-delay-2';
               const imgSrc = it.photoDataUrl || `https://images.unsplash.com/photo-1555169062-013468b47731?q=80&w=600&auto=format&fit=crop&seed=${it.id}`;
               const rColor = s ? rarityColor(s.rarity) : 'var(--text-muted)';
               const dateStr = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(it.addedAt));

               return (
                 <div key={it.id} className={`glass glass-hover fade-up ${delayClass} collection-card`} style={{ borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                   
                   <div style={{ width: '100%', height: '240px', background: 'rgba(0,0,0,0.5)', position: 'relative' }}>
                     <img src={imgSrc} alt={s?.commonName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                     
                     <div style={{ position: 'absolute', top: '16px', right: '16px', padding: '6px 14px', borderRadius: '99px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', border: `1px solid ${rColor}`, color: rColor, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                       {s?.rarity ?? 'Unknown'}
                     </div>
                     
                     <Link to={`/species/${it.id}`} className="hover-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(7,26,13,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s ease', textDecoration: 'none' }}>
                       <div className="glass" style={{ padding: '12px 24px', borderRadius: '99px', color: 'var(--neon-green)', fontWeight: 700, border: '1px solid var(--neon-green)' }}>
                         VIEW DETAILS
                       </div>
                     </Link>
                   </div>

                   <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                     <h3 style={{ fontFamily: 'var(--display)', fontSize: '1.6rem', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                       {s?.commonName ?? it.commonName ?? 'Unknown Bird'}
                     </h3>
                     <div style={{ fontFamily: 'var(--mono)', fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                       {s?.scientificName ?? it.scientificName ?? '...'}
                     </div>
                     
                     <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>Spotted {dateStr}</span>
                       <button 
                         onClick={(e) => { e.preventDefault(); removeFromCollection(it.id); setTick(t=>t+1); }} 
                         style={{ background: 'transparent', border: 'none', color: '#ff6b8a', cursor: 'pointer', opacity: 0.6, fontWeight: 600, fontFamily: 'var(--sans)' }}
                       >
                         Remove
                       </button>
                     </div>
                   </div>
                 </div>
               );
            })}
          </div>
        )}
      </div>

      <style>{`
        .collection-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 992px) {
          .collection-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .collection-grid { grid-template-columns: 1fr; }
        }
        .collection-card:hover .hover-overlay {
          opacity: 1 !important;
        }
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
