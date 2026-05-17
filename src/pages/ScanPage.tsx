import { useMemo, useState, useRef, DragEvent } from "react";
import { identifyBird, type IdentifyResult } from "@/lib/identify";
import { upsertCollection } from "@/lib/storage";
import { Link } from "react-router-dom";
import ForestScene from "@/components/scene/ForestScene";

// Custom Icon for Camera
const CameraIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const SpinnerRing = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1.5s linear infinite', color: 'var(--neon-green)' }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  </svg>
);

export default function ScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<IdentifyResult | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const preview = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  const handleFile = async (f: File) => {
    setFile(f);
    setErr(null);
    setBusy(true);
    setResult(null);
    try {
      const r = await identifyBird(f);
      setResult(r);
    } catch (e: any) {
      setErr(String(e?.message ?? e));
    } finally {
      setBusy(false);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onAdd = async () => {
    if (!result) return;
    let photoDataUrl: string | undefined;
    if (preview) {
      const img = await fetch(preview);
      const blob = await img.blob();
      photoDataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.readAsDataURL(blob);
      });
    }
    upsertCollection({
      id: result.top.id,
      addedAt: Date.now(),
      note: undefined,
      locationLabel: undefined,
      photoDataUrl
    });
    alert("Added to collection!");
  };

  return (
    <>
      <ForestScene />
      
      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Hero Section */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
          <h1 className="gradient-text" style={{ fontFamily: 'var(--display)', fontSize: '3.5rem', margin: '0 0 10px 0' }}>IDENTIFY ANY BIRD</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'var(--sans)' }}>
            Point your camera at any bird for instant AI identification
          </p>
        </div>

        {/* Upload Zone */}
        {!busy && !result && !err && (
          <div 
            className={`glass glass-hover fade-up fade-up-delay-1`}
            style={{ 
              width: '100%', maxWidth: '500px', height: '320px', 
              border: `2px dashed ${isDragging ? 'var(--neon-gold)' : 'var(--neon-green)'}`,
              borderRadius: '32px', display: 'flex', flexDirection: 'column', 
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              position: 'relative', overflow: 'hidden'
            }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              capture="environment" 
              style={{ display: 'none' }} 
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }} 
            />
            
            {preview ? (
              <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ color: 'var(--neon-green)', marginBottom: '20px', animation: 'pulseDot 2s infinite' }}>
                  <CameraIcon />
                </div>
                <div className="section-label" style={{ fontSize: '1.1rem' }}>TAP TO PHOTOGRAPH</div>
                <div style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.9rem', fontFamily: 'var(--sans)' }}>or drag and drop here</div>
              </div>
            )}
          </div>
        )}

        {/* AI Processing Animation */}
        {busy && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '320px' }}>
            <SpinnerRing />
            <div className="section-label" style={{ marginTop: '24px', fontSize: '1.2rem', letterSpacing: '0.1em' }}>ANALYZING...</div>
            <div style={{ marginTop: '20px' }} className="shimmer">
               <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
            </div>
          </div>
        )}

        {/* Error State */}
        {err && !busy && (
          <div className="glass fade-up" style={{ width: '100%', maxWidth: '500px', padding: '40px', textAlign: 'center', borderRadius: '32px', border: '1px solid rgba(255,107,138,0.3)' }}>
            <div style={{ color: '#ff6b8a', fontSize: '1.3rem', marginBottom: '16px', fontFamily: 'var(--sans)', fontWeight: 600 }}>Identification Failed</div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontFamily: 'var(--sans)', lineHeight: 1.5 }}>{err}</p>
            <button 
              className="glass glass-hover" 
              style={{ padding: '14px 32px', color: 'var(--text-primary)', border: '1px solid var(--neon-green)', background: 'transparent', borderRadius: '99px', cursor: 'pointer', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '1rem' }}
              onClick={() => { setErr(null); setFile(null); }}
            >
              TRY AGAIN
            </button>
          </div>
        )}

        {/* Results Card */}
        {result && !busy && (
          <div className="glass nature-glow fade-up" style={{ width: '100%', maxWidth: '600px', padding: '32px', borderRadius: '32px', marginTop: '20px' }}>
            <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
              
              {/* Image Thumbnail */}
              {preview && (
                <div style={{ width: '100%', height: '240px', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src={preview} alt="Bird" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              {/* Header */}
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontFamily: 'var(--display)', fontSize: '2.5rem', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
                  {result.top.commonName}
                </h2>
                <div style={{ fontFamily: 'var(--mono)', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                  {result.top.scientificName}
                </div>
              </div>

              {/* Confidence Bar */}
              <div style={{ margin: '10px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="section-label">Confidence Score</span>
                  <span style={{ color: 'var(--neon-green)', fontFamily: 'var(--mono)', fontSize: '1.1rem' }}>{Math.round(result.confidence * 100)}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${result.confidence * 100}%`, 
                      height: '100%', 
                      background: `linear-gradient(90deg, var(--neon-green), var(--neon-gold))`,
                      transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} 
                  />
                </div>
              </div>

              {/* Alternatives */}
              {result.alternatives.length > 0 && (
                <div>
                  <div className="section-label" style={{ marginBottom: '16px' }}>Alternative Matches</div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {result.alternatives.map((alt, i) => (
                      <div key={i} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '99px', fontSize: '0.9rem', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>
                        {alt.s.commonName} <span style={{ opacity: 0.5, marginLeft: '6px' }}>{Math.round(alt.confidence * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
                <button 
                  onClick={onAdd}
                  className="glass-hover"
                  style={{ 
                    flex: 1, padding: '16px 24px', background: 'var(--neon-green)', color: '#000', 
                    border: 'none', borderRadius: '99px', fontFamily: 'var(--sans)', 
                    fontWeight: 700, fontSize: '1rem', cursor: 'pointer', textAlign: 'center'
                  }}
                >
                  ADD TO COLLECTION
                </button>
                <Link 
                  to={`/species/${result.top.id}`}
                  className="glass glass-hover"
                  style={{ 
                    flex: 1, padding: '16px 24px', background: 'transparent', color: 'var(--text-primary)', 
                    border: '1px solid rgba(255,255,255,0.2)', borderRadius: '99px', fontFamily: 'var(--sans)', 
                    fontWeight: 600, fontSize: '1rem', cursor: 'pointer', textAlign: 'center', textDecoration: 'none'
                  }}
                >
                  VIEW SPECIES
                </Link>
              </div>

            </div>
          </div>
        )}

      </div>
      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
