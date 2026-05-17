import { useMemo, useState, useRef, DragEvent } from "react";
import { identifyBird, type IdentifyResult } from "@/lib/identify";
import { upsertCollection } from "@/lib/storage";
import { Link } from "react-router-dom";

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
      photoDataUrl
    });
    alert("Added to collection!");
  };

  return (
    <div className="container heroApp">
      <div>
        {!result && (
          <div className="fade-up">
            <h1 className="appH1">IDENTIFY ANY BIRD</h1>
            <p className="appP">
              Upload a photo or point your camera at any bird for instant AI identification.
            </p>
            
            <div className="scanRow">
              <label className="btn btn--primary" style={{ cursor: 'pointer' }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFile(e.target.files[0]);
                  }} 
                />
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                Upload Photo
              </label>
            </div>
            
            {err && (
              <div style={{ marginTop: '20px', padding: '16px', borderRadius: '12px', background: 'rgba(255, 107, 138, 0.1)', border: '1px solid rgba(255,107,138,0.2)', color: '#ff6b8a' }}>
                {err}
              </div>
            )}
          </div>
        )}

        {result && (
          <div className="panel fade-up">
            <div className="panelTop">
              <div>
                <div className="kicker">SPECIES IDENTIFIED</div>
                <h2 className="appH1" style={{ margin: '4px 0 8px 0' }}>{result.top.commonName}</h2>
                <div style={{ fontFamily: 'var(--mono)', fontStyle: 'italic', color: 'var(--fg2)' }}>{result.top.scientificName}</div>
              </div>
              
              {/* Circular Confidence Meter */}
              <div style={{ position: 'relative', width: '64px', height: '64px' }}>
                <svg width="64" height="64" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3"/>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--neon-green)" strokeWidth="3" strokeDasharray={`${Math.round(result.confidence * 100)}, 100`} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontFamily: 'var(--mono)', fontWeight: 'bold' }}>
                  {Math.round(result.confidence * 100)}%
                </div>
              </div>
            </div>

            <div className="panelGrid">
              <div className="mini">
                <div className="miniLabel">HABITAT</div>
                <div className="miniValue">Forest Edge</div>
              </div>
              <div className="mini">
                <div className="miniLabel">RANGE</div>
                <div className="miniValue">North America</div>
              </div>
              <div className="mini">
                <div className="miniLabel">DIET</div>
                <div className="miniValue">Insects</div>
              </div>
            </div>
            
            <div className="actionsRow">
              <button className="btn btn--primary" onClick={onAdd}>Add to Collection</button>
              <Link to={`/species/${result.top.id}`} className="btn btn--secondary">View Species Profile</Link>
              <button className="btn btn--secondary" onClick={() => { setResult(null); setFile(null); }}>Scan Another</button>
            </div>
          </div>
        )}
      </div>

      <div className="device fade-up fade-up-delay-1">
        <div 
          className="device__frame glass-hover"
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          style={{ borderColor: isDragging ? 'var(--neon-green)' : undefined }}
        >
          <div className="device__screen">
            {preview ? (
              <img src={preview} alt="Preview" className="device__img" />
            ) : busy ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div className="pulse-dot" />
                <div className="device__empty" style={{ color: 'var(--neon-green)' }}>ANALYZING...</div>
              </div>
            ) : (
              <div className="device__empty">DRAG & DROP IMAGE HERE</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
