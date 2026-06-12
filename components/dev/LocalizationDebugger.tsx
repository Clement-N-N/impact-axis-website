"use client";

import { useLocale, useMessages } from "next-intl";
import { useCallback, useState } from "react";

type MessageValue = string | number | boolean | MessageTree;
type MessageTree = { [key: string]: MessageValue };

function matchesSearch(data: MessageValue, term: string): boolean {
  if (!term) return true;
  const t = term.toLowerCase();
  if (typeof data === "string") return data.toLowerCase().includes(t);
  if (typeof data === "object" && data !== null) {
    return Object.entries(data).some(
      ([k, v]) => k.toLowerCase().includes(t) || matchesSearch(v, t)
    );
  }
  return false;
}

interface TreeNodeProps {
  data: MessageValue;
  path: string;
  level: number;
  searchTerm: string;
  onCopy: (text: string) => void;
}

function TreeNode({ data, path, level, searchTerm, onCopy }: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(level < 2);
  const key = path.split(".").pop() ?? path;

  const hoverHandlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) =>
      (e.currentTarget.style.background = "#2a2a2a"),
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) =>
      (e.currentTarget.style.background = "transparent"),
  };

  if (typeof data !== "object" || data === null) {
    const color =
      typeof data === "string" ? "#ff6b6b" : typeof data === "number" ? "#4ecdc4" : "#7eb8f7";
    return (
      <div
        {...hoverHandlers}
        onClick={() => onCopy(String(data))}
        title="Click to copy value"
        style={{ display: "flex", gap: 8, padding: "2px 4px", cursor: "pointer", borderRadius: 3 }}
      >
        <span style={{ color: "#888" }}>•</span>
        <span style={{ color: "#88c999" }}>{key}</span>
        <span style={{ color: "#888" }}>:</span>
        <span style={{ color, fontStyle: typeof data === "string" ? "italic" : "normal" }}>
          {JSON.stringify(data)}
        </span>
      </div>
    );
  }

  const entries = Object.entries(data).filter(([k, v]) =>
    searchTerm
      ? k.toLowerCase().includes(searchTerm.toLowerCase()) || matchesSearch(v, searchTerm)
      : true
  );

  if (entries.length === 0) return null;

  return (
    <div style={{ paddingLeft: level > 0 ? 12 : 0 }}>
      {path && (
        <div
          {...hoverHandlers}
          style={{ display: "flex", gap: 6, alignItems: "center", padding: "2px 4px", cursor: "pointer", borderRadius: 3, userSelect: "none" }}
        >
          <span onClick={() => setIsOpen((o) => !o)} style={{ color: "#aaa", fontSize: 10, minWidth: 10 }}>
            {isOpen ? "▼" : "▶"}
          </span>
          <span style={{ color: "#88c999" }} onClick={() => onCopy(path)} title="Click to copy key path">
            {key}
          </span>
        </div>
      )}
      {isOpen &&
        entries.map(([k, v]) => (
          <TreeNode key={k} data={v} path={path ? `${path}.${k}` : k} level={level + 1} searchTerm={searchTerm} onCopy={onCopy} />
        ))}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: "#333", border: "1px solid #555", borderRadius: 4,
  color: "#ccc", cursor: "pointer", padding: "2px 6px", fontSize: 11, fontFamily: "monospace",
};

function LocalizationDebuggerInner() {
  const locale = useLocale();
  const messages = useMessages();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [rawView, setRawView] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const w = isExpanded ? 700 : 350;
  const h = isExpanded ? 700 : 250;

  return (
    <>
      {!isVisible && (
        <button onClick={() => setIsVisible(true)} title="Open i18n debugger"
          style={{ position: "fixed", bottom: 14, right: 70, zIndex: 10000, background: "#1a1a2e", border: "1px solid #444", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
          🌐
        </button>
      )}
      {isVisible && (
        <div style={{ position: "fixed", bottom: 14, right: 14, zIndex: 10000, width: w, height: h, background: "#1a1a1a", border: "1px solid #444", borderRadius: 8, display: "flex", flexDirection: "column", fontFamily: "monospace", fontSize: 12, color: "#ccc", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderBottom: "1px solid #333", background: "#111", flexShrink: 0 }}>
            <span style={{ color: "#88c999", fontWeight: "bold" }}>🌐 i18n</span>
            <span style={{ color: "#888" }}>locale: {locale}</span>
            {copied && <span style={{ color: "#88c999", marginLeft: "auto" }}>Copied!</span>}
            <div style={{ marginLeft: copied ? 0 : "auto", display: "flex", gap: 6 }}>
              <button style={btnStyle} onClick={() => setRawView((v) => !v)}>{rawView ? "Tree" : "Raw"}</button>
              <button style={btnStyle} onClick={() => setIsExpanded((v) => !v)}>{isExpanded ? "⊟" : "⊞"}</button>
              <button style={btnStyle} onClick={() => setIsVisible(false)}>✕</button>
            </div>
          </div>
          {!rawView && (
            <div style={{ padding: "6px 10px", borderBottom: "1px solid #333", flexShrink: 0 }}>
              <input type="text" placeholder="Search keys or values…" value={search} onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", background: "#222", border: "1px solid #444", borderRadius: 4, color: "#ccc", padding: "4px 8px", fontFamily: "monospace", fontSize: 11, outline: "none", boxSizing: "border-box" }} />
            </div>
          )}
          <div style={{ overflow: "auto", flex: 1, padding: "8px 10px" }}>
            {rawView
              ? <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all", color: "#aaa" }}>{JSON.stringify(messages, null, 2)}</pre>
              : <TreeNode data={messages as MessageTree} path="" level={0} searchTerm={search} onCopy={handleCopy} />}
          </div>
        </div>
      )}
    </>
  );
}

export function LocalizationDebugger() {
  if (process.env.NODE_ENV !== "development") return null;
  return <LocalizationDebuggerInner />;
}
