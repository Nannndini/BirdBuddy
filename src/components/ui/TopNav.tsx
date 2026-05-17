import GlassCard from "./GlassCard";

export default function TopNav() {
  return (
    <header className="topNav">
      <div className="container topNav__row">
        <a href="#home" className="topNav__brand" aria-label="BirdBuddy home">
          <span className="topNav__mark" aria-hidden="true" />
          <span className="topNav__name">BirdBuddy</span>
        </a>

        <nav className="topNav__links" aria-label="Primary">
          <a href="#scan">Scan</a>
          <a href="#species">Species</a>
          <a href="#collection">Collection</a>
          <a href="#map">Map</a>
        </nav>

        <GlassCard className="topNav__cta">
          <a className="topNav__ctaLink" href="#scan">Launch demo</a>
        </GlassCard>
      </div>
    </header>
  );
}
