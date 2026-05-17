import { SPECIES } from "@/lib/species";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

export default function SpeciesPage() {
  const { id } = useParams();
  const s = useMemo(() => SPECIES.find((x) => x.id === id), [id]);

  if (!s) {
    return (
      <section className="container">
        <div className="panel">
          <div className="panelTitle">Species not found</div>
          <Link className="btn btn--secondary" to="/scan">Back to scan</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container">
      <div className="panel">
        <div className="panelTop">
          <div>
            <div className="panelTitle">{s.commonName}</div>
            <div className="panelSub">{s.scientificName}</div>
          </div>
          <div className={"rarity " + s.rarity}>{s.rarity}</div>
        </div>

        <div className="panelGrid">
          <div className="mini">
            <div className="miniLabel">Behavior</div>
            <div className="miniValue">{s.behavior}</div>
          </div>
          <div className="mini">
            <div className="miniLabel">Diet</div>
            <div className="miniValue">{s.diet}</div>
          </div>
          <div className="mini">
            <div className="miniLabel">Range</div>
            <div className="miniValue">{s.range}</div>
          </div>
          <div className="mini">
            <div className="miniLabel">Migration</div>
            <div className="miniValue">{s.migration}</div>
          </div>
        </div>

        <div className="songRow">
          <div className="miniLabel">Song samples</div>
          <div className="songGrid">
            {s.song.map((x) => (
              <div key={x.url} className="songCard">
                <div className="songTitle">{x.label}</div>
                <audio controls src={x.url} />
              </div>
            ))}
          </div>
          <div className="muted" style={{ marginTop: 10 }}>
            Note: demo audio links are placeholders — replace with real species audio later.
          </div>
        </div>

        <div className="actionsRow">
          <Link className="btn btn--secondary" to="/scan">Scan another</Link>
          <Link className="btn btn--secondary" to="/collection">Open collection</Link>
        </div>
      </div>
    </section>
  );
}
