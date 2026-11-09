import { useState } from "react";
import "./AnnouncementBar.css";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="announcement-bar">
      <p>
        <span>🪔</span>
        <strong> Diwali Sale is Live!</strong>
        &nbsp; Flat 10% OFF on all Handmade Creations&nbsp;
      </p>
      <button
        className="announcement-close"
        onClick={() => setVisible(false)}
        aria-label="Close announcement"
      >
        ×
      </button>
    </div>
  );
}
