import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import { useState } from "react";
import L from "leaflet";
import { SPECIES } from "@/lib/species";

const createGreenIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:20px;height:20px;background:var(--neon-green);border-radius:50%;border:2px solid #000;box-shadow:0 0 10px var(--neon-green);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

type Sight = { id: string; name: string; lat: number; lng: number; distanceKm: number; date: string; speciesId: string };

const SIGHTINGS: Sight[] = [
  { id: "1", name: "Lake edge", lat: 17.385, lng: 78.4867, distanceKm: 2.1, date: "Today, 10:30 AM", speciesId: "white-throated-kingfisher" },
  { id: "2", name: "City garden", lat: 17.39, lng: 78.48, distanceKm: 3.8, date: "Yesterday, 6:00 AM", speciesId: "indian-peafowl" },
  { id: "3", name: "Hills trail", lat: 17.41, lng: 78.50, distanceKm: 7.0, date: "May 15, 2026", speciesId: "greater-flamingo" }
];

export default function MapPage() {
  const center: [number, number] = [17.385, 78.4867];
  const [showModal, setShowModal] = useState(false);
  const [filterSpecies, setFilterSpecies] = useState("all");
  
  const icon = createGreenIcon();

  const handleFabClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => setShowModal(true), () => setShowModal(true));
    } else {
      setShowModal(true);
    }
  };

  return (
    <section style={{ position: 'relative', width: '100%', height: 'calc(100vh - 70px)' }}>
      {/* Map */}
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{ height: "100%", width: "100%", zIndex: 1 }}>
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {SIGHTINGS.filter(s => filterSpecies === 'all' || s.speciesId === filterSpecies).map((s) => {
          const spec = SPECIES.find(x => x.id === s.speciesId);
          const imgSrc = `https://images.unsplash.com/photo-1555169062-013468b47731?q=80&w=200&auto=format&fit=crop&seed=${spec?.id}`;
          return (
            <Marker key={s.id} position={[s.lat, s.lng]} icon={icon}>
              <Popup className="custom-popup">
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <img src={imgSrc} alt={spec?.commonName} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <strong style={{ fontFamily: 'var(--display)', fontSize: '1.1rem', color: '#000' }}>{spec?.commonName}</strong><br />
                    <span style={{ fontSize: '0.8rem', color: '#555' }}>{s.date}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Filter Panel */}
      <div className="glass fade-up" style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 10, width: '280px', padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="section-label">Filter Sightings</div>
        
        <select className="glass" value={filterSpecies} onChange={e => setFilterSpecies(e.target.value)} style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(0,0,0,0.4)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }}>
          <option value="all">All Species</option>
          {SPECIES.map(s => <option key={s.id} value={s.id}>{s.commonName}</option>)}
        </select>
        
        <select className="glass" style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(0,0,0,0.4)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }}>
          <option>All Time</option>
          <option>Today</option>
          <option>This Week</option>
        </select>

        <select className="glass" style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(0,0,0,0.4)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }}>
          <option>Any Rarity</option>
          <option>Rare & Legendary</option>
        </select>
        
        <Link to="/alerts" style={{ color: 'var(--neon-teal)', textDecoration: 'none', fontSize: '0.9rem', textAlign: 'center', marginTop: '8px', fontWeight: 600 }}>View Alerts Feed →</Link>
      </div>

      {/* FAB */}
      <button 
        onClick={handleFabClick}
        className="nature-glow fade-up fade-up-delay-2"
        style={{ position: 'absolute', bottom: '32px', right: '32px', zIndex: 10, width: '64px', height: '64px', borderRadius: '50%', background: 'var(--neon-green)', color: '#000', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s ease' }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
      </button>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 20, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass fade-up" style={{ width: '90%', maxWidth: '400px', padding: '32px', borderRadius: '32px', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.8rem', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Report Sighting</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>Location automatically acquired via GPS.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <select className="glass" style={{ padding: '14px', borderRadius: '16px', background: 'rgba(0,0,0,0.4)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }}>
                <option value="">Select Species...</option>
                {SPECIES.map(s => <option key={s.id} value={s.id}>{s.commonName}</option>)}
              </select>
              <textarea className="glass" placeholder="Any notes? (e.g. Near the old oak tree)" rows={3} style={{ padding: '14px', borderRadius: '16px', background: 'rgba(0,0,0,0.4)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', outline: 'none', resize: 'none' }}></textarea>
              
              <button 
                onClick={() => { alert('Sighting reported!'); setShowModal(false); }}
                style={{ padding: '16px', borderRadius: '99px', background: 'var(--neon-green)', color: '#000', fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: '8px', fontSize: '1.05rem', fontFamily: 'var(--sans)' }}
              >
                SUBMIT REPORT
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .leaflet-container { background: var(--col-deep) !important; font-family: var(--sans) !important; }
        .custom-popup .leaflet-popup-content-wrapper { background: rgba(255,255,255,0.95); border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); padding: 4px; }
        .custom-popup .leaflet-popup-tip { background: rgba(255,255,255,0.95); }
        .custom-popup .leaflet-popup-content { margin: 8px; }
      `}</style>
    </section>
  );
}
