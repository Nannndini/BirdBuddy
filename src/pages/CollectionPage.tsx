import { SPECIES } from "@/lib/species";
import { loadCollection, removeFromCollection } from "@/lib/storage";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function CollectionPage() {
  const [tick, setTick] = useState(0);
  const items = useMemo(() => loadCollection(), [tick]);

  const cards = items.map((it) => {
    const s = SPECIES.find((x) => x.id === it.id);
    return { it, s };
  });

  return (
    <section className="container">
      <div className="rowTop">
        <div>
          <h1 className="appH1">My life list</h1>
          <p className="appP">Your personal field journal — saved locally in this browser.</p>
        </div>
        <Link className="btn btn--primary" to="/scan">New scan</Link>
      </div>

      {cards.length === 0 ? (
        <div className="panel">
          <div className="panelTitle">No birds yet</div>
          <div className="muted">Scan a photo to start collecting species.</div>
        </div>
      ) : (
        <div className="cardsGrid">
          {cards.map(({ it, s }) => (
            <div key={it.id} className="cardX">
              <div className="cardX__img">
                {it.photoDataUrl ? <img src={it.photoDataUrl} alt="" /> : <div className="cardX__ph">Photo</div>}
              </div>
              <div className="cardX__body">
                <div className="cardX__title">{s?.commonName ?? it.id}</div>
                <div className="cardX__sub">{s?.scientificName ?? ""}</div>
                <div className="cardX__meta">
                  <span className="pill2">{new Date(it.addedAt).toLocaleDateString()}</span>
                  {it.locationLabel ? <span className="pill2">{it.locationLabel}</span> : null}
                </div>
                {it.note ? <div className="muted" style={{ marginTop: 8 }}>{it.note}</div> : null}

                <div className="actionsRow" style={{ marginTop: 12 }}>
                  <Link className="btn btn--secondary" to={`/species/${it.id}`}>Details</Link>
                  <button
                    className="btn btn--secondary"
                    onClick={() => { removeFromCollection(it.id); setTick((x) => x + 1); }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
