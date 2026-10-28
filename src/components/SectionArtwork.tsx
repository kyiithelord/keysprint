import ArcadeTypingPreview from "@/components/ArcadeTypingPreview";

export function LessonsArtwork() {
  return <div className="section-art lesson-art" aria-label="Home row typing lesson preview">
    <div className="art-topline"><span>01 / 04 · HOME ROW</span><span>START HERE ↗</span></div>
    <div className="lesson-hands"><span>LEFT HAND</span><span>RIGHT HAND</span></div>
    <div className="lesson-keyboard" aria-hidden="true">{"ASDFJKL;".split("").map((key, index) => <span className={index === 3 || index === 4 ? "home-key" : ""} key={index}>{key}</span>)}</div>
    <div className="art-foot"><span>FIND YOUR STARTING POSITION</span><strong>F + J</strong></div>
  </div>;
}

export function GamesArtwork() {
  return <div className="section-art games-art" aria-label="Illustration of a typing game with falling words">
    <div className="arcade-art-header"><span className="arcade-art-icon">T<span>↗</span></span><div><strong>WORD RUSH</strong><small>TYPENCIL / ARCADE 01</small></div><span className="arcade-art-live"><i /> GAME PREVIEW</span></div>
    <div className="arcade-art-hud"><span>TIME <strong>00:42</strong></span><span>SCORE <strong>1,240</strong></span><span>STREAK <strong>× 04</strong></span></div>
    <div className="arcade-art-field"><span className="arcade-art-line" /><span className="arcade-art-word word-one">rhythm</span><span className="arcade-art-word word-two">focus</span><span className="arcade-art-word word-three">speed</span><span className="arcade-art-target">TYPE BEFORE THEY FALL ↗</span></div>
    <div className="arcade-art-console"><ArcadeTypingPreview /><span className="arcade-art-enter">ENTER ↵</span></div>
  </div>;
}

export function DailyArtwork() {
  return <div className="section-art daily-art" aria-label="Illustration of a fresh daily typing challenge">
    <div className="daily-art-head"><span>TYPENCIL / DAILY</span><span>✦ &nbsp; A FRESH START</span></div>
    <div className="daily-art-center"><div className="daily-art-sun" aria-hidden="true">✳</div><div><span>MAKE TODAY COUNT</span><strong>One day.<br /><em>Three small wins.</em></strong></div></div>
    <div className="daily-art-week"><div className="daily-art-week-head"><span>SEVEN DAYS OF POSSIBILITY</span><span>SHOW UP &amp; GROW ↗</span></div><div className="daily-art-days">{[1, 2, 3, 4, 5, 6, 7].map((day) => <span key={day}><small>0{day}</small><i>{day === 1 ? "✦" : "·"}</i></span>)}</div></div>
  </div>;
}

export function ProgressArtwork() {
  return <div className="section-art progress-art" aria-label="Typing progress chart illustration">
    <div className="art-topline"><span>YOUR MOMENTUM</span><span>SAMPLE VIEW ↗</span></div>
    <div className="progress-art-stat"><span>THE WORK ADDS UP</span><strong>Every key<br /><em>counts.</em></strong></div>
    <div className="progress-art-chart" aria-hidden="true">{[29, 43, 35, 62, 49, 72, 88].map((height, index) => <div key={index}><i style={{height: `${height}%`}} /><span>{["M", "T", "W", "T", "F", "S", "S"][index]}</span></div>)}</div>
    <div className="art-foot"><span>KEEP BUILDING YOUR RHYTHM</span><strong>↗</strong></div>
  </div>;
}

export function GuidesArtwork() {
  return <div className="section-art guides-art" aria-label="Typing guide field notes illustration">
    <div className="art-topline"><span>FIELD NOTES / 03</span><span>READ & PRACTICE</span></div>
    <div className="guide-paper"><span>THE TYPENCIL GUIDE</span><strong>Speed begins<br />with accuracy.</strong><p>01 &nbsp; Find your rhythm<br />02 &nbsp; Stay relaxed<br />03 &nbsp; Practice with purpose</p><div><span>READ · TRY · IMPROVE</span><b>↗</b></div></div>
    <div className="art-foot"><span>GOOD HABITS, ONE KEY AT A TIME</span><strong>✦</strong></div>
  </div>;
}
