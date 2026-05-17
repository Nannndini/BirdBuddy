import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";

type Sight = { name: string; lat: number; lng: number; distanceKm: number; note: string };

const SIGHTINGS: Sight[] = [
  { name: "Lake edge", lat: 17.385, lng: 78.4867, distanceKm: 2.1, note: "Kingfisher reported near water." },
  { name: "City garden", lat: 17.39, lng: 78.48, distanceKm: 3.8, note: "Peafowl call heard at dawn." },
  { name: "Hills trail", lat: 17.41, lng: 78.50, distanceKm: 7.0, note: "Flamingo flock spotted (seasonal)." }
];

export default function MapPage() {
  const center: [number, number] = [17.385, 78.4867];

  return (
    <section className="container">
      <div className="rowTop">
        <div>
          <h1 className="appH1">Nearby sightings</h1>
          <p className="appP">OpenStreetMap + demo markers (no API key). Replace with real reports later.</p>
        </div>
        <Link className="btn btn--secondary" to="/alerts">Rare alerts</Link>
      </div>

      <div className="mapWrap">
        <MapContainer center={center} zoom={12} scrollWheelZoom={false} style={{ height: 420, width: "100%" }}>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {SIGHTINGS.map((s) => (
            <CircleMarker key={s.name} center={[s.lat, s.lng]} radius={10} pathOptions={{ color: "#9BE1FF" }}>
              <Popup>
                <strong>{s.name}</strong><br />
                {s.note}<br />
                <span style={{ opacity: 0.75 }}>{s.distanceKm} km</span>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}
