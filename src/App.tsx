import SceneCanvas from "@/components/scene/SceneCanvas";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "@/pages/Layout";
import ScanPage from "@/pages/ScanPage";
import SpeciesPage from "@/pages/SpeciesPage";
import CollectionPage from "@/pages/CollectionPage";
import MapPage from "@/pages/MapPage";
import AlertsPage from "@/pages/AlertsPage";

export default function App() {
  return (
    <div className="app">
      <SceneCanvas />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/scan" replace />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/species/:id" element={<SpeciesPage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="*" element={<Navigate to="/scan" replace />} />
        </Route>
      </Routes>
    </div>
  );
}
