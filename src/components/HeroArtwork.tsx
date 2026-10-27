export default function HeroArtwork({ className = "" }: { className?: string }) {
  return <div className={`hero-art ${className}`} aria-hidden="true"><div className="art-note">PROGRESS IS PRACTICE, REPEATED.</div><div className="art-keys"><span>Q</span><span>W</span><span>E</span><span>R</span><span>T</span><span>Y</span><span className="key-accent">↗</span></div><div className="art-bars"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div><div className="art-caption">FIND YOUR FLOW <span>01 / 03</span></div></div>;
}
