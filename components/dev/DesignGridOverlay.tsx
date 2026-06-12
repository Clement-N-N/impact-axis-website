"use client";

import { useEffect, useState } from "react";

const CONTAINER_PADDING = "px-container";

function DesignGridOverlayInner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.altKey && e.key.toLowerCase() === "g") {
        setIsVisible((v) => !v);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsVisible((v) => !v)}
        title="Toggle design grid (Alt+G)"
        style={{
          position: "fixed",
          bottom: 14,
          right: 14,
          zIndex: 10000,
          background: "#1a1a2e",
          border: "1px solid #444",
          borderRadius: "50%",
          width: 36,
          height: 36,
          cursor: "pointer",
          fontSize: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ccc",
        }}
      >
        #
      </button>
      {isVisible && (
        <div
          className={`pointer-events-none fixed inset-0 z-[9998] flex gap-gutter ${CONTAINER_PADDING} bg-red-500/5`}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-full w-full bg-[#ff0000]/20" />
          ))}
        </div>
      )}
    </>
  );
}

export function DesignGridOverlay() {
  if (process.env.NODE_ENV !== "development") return null;
  return <DesignGridOverlayInner />;
}
