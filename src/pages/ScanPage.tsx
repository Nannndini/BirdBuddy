import { useMemo, useState } from "react";
import { identifyBird, type IdentifyResult } from "@/lib/identify";
import { upsertCollection } from "@/lib/storage";
import { Link } from "react-router-dom";
import BlurText from "@/components/ui/motion/BlurText";
import CountUp from "@/components/ui/motion/CountUp";

export default function ScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<IdentifyResult | null>(null);
  const [note, setNote] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const preview = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  async function onIdentify() {
    if (!file) return;
    setErr(null);
    setBusy(true);
    try {
      const r = await identifyBird(file);
      setResult(r);
    } catch (e: any) {
      setErr(String(e?.message ?? e));
    } finally {
      setBusy(false);
    }
  }

  async function onAdd() {
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
      note: note.trim() || undefined,
      locationLabel: locationLabel.trim() || undefined,
      photoDataUrl
    });
    alert("Added to collection!");
  }

  return (
    <section className="container">
      <div className="heroApp">
        <div>
          <div className="kicker">Camera Scan → AI Identification</div>
          <BlurText className="appH1" text="Scan a bird photo" />
          <p className="appP">
            Upload a photo and get a real AI guess (iNaturalist CV). If iNat is unreachable, the app falls back to offline demo so the flow always works.
          </p>

          <div className="scanRow">
            <label className="fileBtn">
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              Choose photo
            </label>

            <button className="btn btn--primary" disabled={!file || busy} onClick={onIdentify}>
              {busy ? "Identifying..." : "Identify"}
            </button>

            <div className="muted" style={{ alignSelf: "center" }}>
              Latency: ~<CountUp to={2} />s
            </div>
          </div>

          {err ? (
            <div className="panel" style={{ borderColor: "rgba(255,107,138,.28)" }}>
              <div className="panelTitle">Identify failed</div>
              <div className="muted" style={{ marginTop: 8 }}>{err}</div>
              <div className="muted" style={{ marginTop: 8 }}>
                Tip: restart dev server after config changes.
              </div>
            </div>
          ) : null}

          {result ? (
            <div className="panel">
              <div className="panelTop">
                <div>
                  <div className="panelTitle">{result.top.commonName}</div>
                  <div className="panelSub">{result.top.scientificName}</div>
                </div>
                <div className="badge">{Math.round(result.confidence * 100)}% confidence</div>
              </div>

              <div className="panelGrid">
                <div className="mini">
                  <div className="miniLabel">Habitat</div>
                  <div className="miniValue">{result.top.habitat}</div>
                </div>
                <div className="mini">
                  <div className="miniLabel">Range</div>
                  <div className="miniValue">{result.top.range}</div>
                </div>
                <div className="mini">
                  <div className="miniLabel">Alternatives</div>
                  <div className="miniValue">{result.alternatives.map((a) => a.s.commonName).join(" · ")}</div>
                </div>
              </div>

              <div className="actionsRow">
                <Link className="btn btn--secondary" to={`/species/${result.top.id}`}>Open species page</Link>
                <button className="btn btn--primary" onClick={onAdd}>Add to collection</button>
              </div>

              <div className="formRow">
                <input className="input" placeholder="Location label (optional)" value={locationLabel} onChange={(e) => setLocationLabel(e.target.value)} />
                <input className="input" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
              </div>

              <details className="aiLog">
                <summary>AI logs (for contest submission)</summary>
                <div className="aiLog__box">
                  <div className="aiLog__label">Prompt</div>
                  <pre className="aiLog__pre">{result.aiLog.prompt}</pre>
                  <div className="aiLog__label">Response</div>
                  <pre className="aiLog__pre">{result.aiLog.response}</pre>
                </div>
              </details>
            </div>
          ) : null}
        </div>

        <div className="device">
          <div className="device__frame">
            <div className="device__screen">
              {preview ? <img className="device__img" src={preview} alt="Preview" /> : <div className="device__empty">Your scan preview</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
