import { SPECIES } from "@/lib/species";
import { useMemo, useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";

// Icons
const ArrowLeft = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const MapIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const LeafIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M12 22c5-5 5-13 0-20-5 7-5 15 0 20z"/></svg>;
const BugIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20v-4M8 16V8h8v8H8z"/><path d="M6 12h2M16 12h2M7 8l-2-2M17 8l2-2M7 16l-2 2M17 16l2 2"/></svg>;
const RulerIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>;
const PlayIcon = () => <svg width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>;

const Waveform = ({ playing }: { playing: boolean }) => {
  const [bars, setBars] = useState<number[]>([]);
  useEffect(() => {
    setBars([...Array(24)].map(() => Math.random()));
  }, []);

  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '40px' }}>
      {bars.map((val, i) => (
        <div 
          key={i} 
          style={{ 
            width: '4px', 
            backgroundColor: 'var(--neon-green)', 
            borderRadius: '2px',
            height: playing ? `${10 + val * 30}px` : '4px',
            transition: 'height 0.2s ease',
            animation: playing ? `pulseWave ${0.5 + val}s infinite alternate` : 'none'
          }} 
        />
      ))}
    </div>
  );
};

export default function SpeciesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const s = useMemo(() => {
    return SPECIES.find((x) => x.id === id) || location.state?.species;
  }, [id, location.state]);
  const [playing, setPlaying] = useState(false);

  // Stop playing if species changes
  useEffect(() => {
    setPlaying(false);
  }, [id]);

  const similar = useMemo(() => SPECIES.filter((x) => x.id !== id).slice(0, 3), [id]);

  if (!s) {
    return (
      <section className="container" style={{ paddingTop: 100 }}>
        <div className="glass panel" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '1.5rem', fontFamily: 'var(--display)' }}>Species not found</div>
          <Link className="glass-hover" to="/scan" style={{ display: 'inline-block', marginTop: 20, padding: '12px 24px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', textDecoration: 'none', color: '#fff' }}>Back to scan</Link>
        </div>
      </section>
    );
  }

  // A thematic bird placeholder if species data has no image. Since species.ts has none, use a nice generic nature/bird picture.
  const imageUrl = `https://images.unsplash.com/photo-1555169062-013468b47731?q=80&w=1600&auto=format&fit=crop`; 
  
  const rarityColor = s.rarity === 'rare' ? 'var(--neon-gold)' : s.rarity === 'uncommon' ? 'var(--neon-orange)' : 'var(--neon-teal)';

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Hero Section */}
      <div style={{ 
        position: 'relative', width: '100%', height: '60vh', minHeight: '400px', 
        backgroundImage: `url(${imageUrl})`, 
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' 
      }}>
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="glass glass-hover"
          style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 10, padding: '10px 16px', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', background: 'rgba(0,0,0,0.4)', color: '#fff' }}
        >
          <ArrowLeft /> Back
        </button>
        
        {/* Gradient Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(3,10,6,0) 0%, rgba(3,10,6,0.5) 60%, var(--col-deep) 100%)' }} />

        {/* Text Content */}
        <div className="container" style={{ position: 'absolute', bottom: '40px', left: 0, right: 0 }}>
          <h1 className="fade-up" style={{ fontFamily: 'var(--display)', fontSize: 'clamp(3rem, 6vw, 4.5rem)', color: '#fff', margin: '0 0 8px 0', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            {s.commonName}
          </h1>
          <div className="fade-up fade-up-delay-1" style={{ fontFamily: 'var(--mono)', fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            {s.scientificName}
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '24px' }}>
        
        {/* Info Grid */}
        <div className="fade-up fade-up-delay-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          
          <div className="glass glass-hover" style={{ padding: '24px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: 'var(--neon-green)' }}>
              <LeafIcon /> <span className="section-label">Habitat</span>
            </div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.05rem' }}>{s.habitat}</p>
          </div>

          <div className="glass glass-hover" style={{ padding: '24px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: 'var(--neon-green)' }}>
              <BugIcon /> <span className="section-label">Diet</span>
            </div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.05rem' }}>{s.diet}</p>
          </div>

          <div className="glass glass-hover" style={{ padding: '24px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: 'var(--neon-green)' }}>
              <RulerIcon /> <span className="section-label">Size (Avg)</span>
            </div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.05rem' }}>
              25-30 cm <br />
              <span style={{ opacity: 0.5, fontSize: '0.85em' }}>Wingspan: 40cm (approx)</span>
            </p>
          </div>

          <div className="glass glass-hover" style={{ padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <span className="section-label" style={{ marginBottom: '16px' }}>Conservation Status</span>
            <div style={{ padding: '12px 32px', borderRadius: '99px', border: `1px solid ${rarityColor}`, color: rarityColor, background: `rgba(255,255,255,0.05)`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {s.rarity}
            </div>
          </div>
        </div>

        {/* Map & Audio Row */}
        <div className="fade-up fade-up-delay-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          
          {/* Migration Map Teaser */}
          <div className="glass glass-hover" style={{ padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--neon-green)' }}>
              <MapIcon /> <span className="section-label">Range & Migration</span>
            </div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.range}. {s.migration}</p>
            <div style={{ height: '140px', borderRadius: '16px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 50% 50%, var(--neon-teal) 0%, transparent 60%)', opacity: 0.15 }} />
              <svg width="100%" height="100%">
                <path d="M0 70 Q 100 20 200 70 T 400 70" fill="none" stroke="var(--neon-green)" strokeWidth="2" strokeDasharray="6 6" opacity="0.6" />
                <circle cx="100" cy="45" r="4" fill="var(--neon-gold)" />
                <circle cx="300" cy="95" r="4" fill="var(--neon-gold)" />
              </svg>
            </div>
            <Link to="/map" style={{ padding: '14px', textAlign: 'center', borderRadius: '99px', color: '#000', background: 'var(--neon-green)', textDecoration: 'none', fontWeight: 700, fontFamily: 'var(--sans)', marginTop: '8px' }}>
              View on Map →
            </Link>
          </div>

          {/* Song / Call Section */}
          <div className="glass glass-hover" style={{ padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
             <div className="section-label" style={{ color: 'var(--neon-green)' }}>Bird Song</div>
             <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Listen to the characteristic calls and melodies.</p>
             {s.song && s.song.length > 0 ? (
               <div style={{ background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginTop: 'auto' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                   <button 
                     onClick={() => setPlaying(!playing)}
                     style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--neon-green)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flexShrink: 0, transition: 'transform 0.1s ease' }}
                     onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                     onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                     onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                   >
                     {playing ? <div style={{ width: '16px', height: '16px', background: '#000', borderRadius: '2px' }} /> : <PlayIcon />}
                   </button>
                   <div>
                     <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{s.song[0].label}</div>
                     <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>0:00 / 0:32</div>
                   </div>
                 </div>
                 <Waveform playing={playing} />
                 {playing && <audio src={s.song[0].url} autoPlay onEnded={() => setPlaying(false)} style={{ display: 'none' }} />}
               </div>
             ) : (
               <div style={{ color: 'var(--text-muted)', marginTop: 'auto', padding: '20px' }}>No audio available</div>
             )}
          </div>

        </div>

        {/* Fun Facts */}
        <div style={{ marginBottom: '48px' }}>
          <div className="section-label" style={{ marginBottom: '20px', fontSize: '1rem' }}>Fun Facts</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div className="glass glass-hover" style={{ padding: '24px', borderRadius: '24px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🧠</div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {s.behavior}
              </p>
            </div>
            <div className="glass glass-hover" style={{ padding: '24px', borderRadius: '24px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>✨</div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Has an incredible ability to adapt to {s.habitat.toLowerCase().replace(/,.*/, '')} environments.
              </p>
            </div>
            <div className="glass glass-hover" style={{ padding: '24px', borderRadius: '24px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🌍</div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Can often be found thriving across {s.range.toLowerCase().replace(/,.*/, '')} during specific seasons.
              </p>
            </div>
          </div>
        </div>

        {/* Similar Species */}
        {similar.length > 0 && (
          <div>
            <div className="section-label" style={{ marginBottom: '20px', fontSize: '1rem' }}>Similar Species</div>
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '20px', scrollbarWidth: 'none' }}>
              {similar.map((sim, i) => (
                <div key={sim.id} className="glass glass-hover" style={{ minWidth: '260px', borderRadius: '24px', overflow: 'hidden', flexShrink: 0 }}>
                  <div style={{ height: '160px', background: 'rgba(255,255,255,0.05)' }}>
                    <img src={`https://images.unsplash.com/photo-1601662528567-526cd06f6582?q=80&w=600&auto=format&fit=crop&seed=${sim.id}${i}`} alt={sim.commonName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '4px' }}>{sim.commonName}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'var(--mono)', marginBottom: '20px' }}>{sim.scientificName}</div>
                    <Link to={`/species/${sim.id}`} style={{ display: 'block', textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '99px', textDecoration: 'none', color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 600, transition: 'background 0.2s' }}>
                      View Species
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      
      <style>{`
        @keyframes pulseWave {
          0% { transform: scaleY(0.4); opacity: 0.6; }
          100% { transform: scaleY(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
