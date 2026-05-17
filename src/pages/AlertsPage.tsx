import { Link } from "react-router-dom";

const ALERTS = [
  { title: "Rare: Greater Flamingo", where: "Wetlands · 7.2 km", when: "2h ago", detail: "Verified by 3 community members." },
  { title: "Uncommon: Indian Peafowl", where: "Forest edge · 4.1 km", when: "Today", detail: "Display behavior reported at sunrise." },
  { title: "Hotspot: Kingfisher activity", where: "Lake edge · 2.1 km", when: "Now", detail: "Multiple sightings in last 30 minutes." }
];

export default function AlertsPage() {
  return (
    <section className="container">
      <div className="rowTop">
        <div>
          <h1 className="appH1">Rare sighting alerts</h1>
          <p className="appP">Community feed UI — ready to plug into real-time backend later.</p>
        </div>
        <Link className="btn btn--secondary" to="/map">Open map</Link>
      </div>

      <div className="alertsGrid">
        {ALERTS.map((a) => (
          <div key={a.title} className="panel">
            <div className="panelTitle">{a.title}</div>
            <div className="muted">{a.where} · {a.when}</div>
            <div style={{ marginTop: 10 }}>{a.detail}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
