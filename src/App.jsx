import React, { useState, useEffect } from "react";
import { TOPICS, STATUS_CONFIG, DIFFICULTIES, STORAGE_KEY } from "./topics.js";

// ── Helpers ──────────────────────────────────────────────────────────────────
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

function saveProgress(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }
  catch { /* storage unavailable */ }
}

// ── Styles (scoped via class prefix "rdm-") ───────────────────────────────────
const css = `
  
  :root {
    --bg:       #080c10;
    --surface:  #0d1117;
    --surface2: #161b22;
    --border:   rgba(255,255,255,0.07);
    --text:     #c9d1d9;
    --muted:    #566070;
    --cyan:     #22d3ee;
    --green:    #22c55e;
    --yellow:   #f59e0b;
    --orange:   #f97316;
    --red:      #ef4444;
  }

  /* ── Header ── */
  .rdm-header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0 2rem;
    display: flex; align-items: center; justify-content: space-between;
    height: 60px; position: sticky; top: 0; z-index: 50;
  }
  .rdm-logo { display: flex; align-items: center; gap: 10px; }
  .rdm-logo-mark { font-size: 20px; color: var(--cyan); line-height: 1; }
  .rdm-logo-text { font-size: 15px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #f0f6fc; font-family: 'Syne', sans-serif; }
  .rdm-logo-sub  { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--muted); letter-spacing: 0.15em; }
  .rdm-header-stats { display: flex; gap: 20px; align-items: center; }
  .rdm-stat { text-align: center; }
  .rdm-stat-val { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 700; line-height: 1; }
  .rdm-stat-label { font-size: 10px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 2px; font-family: 'JetBrains Mono', monospace; }

  /* ── Progress Bar ── */
  .rdm-progress-wrap { background: var(--surface); border-bottom: 1px solid var(--border); padding: 1.25rem 2rem; }
  .rdm-progress-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
  .rdm-progress-title { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted); letter-spacing: 0.2em; text-transform: uppercase; }
  .rdm-progress-pct { font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 700; color: var(--cyan); }
  .rdm-progress-track { height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
  .rdm-progress-fill {
    height: 100%; border-radius: 3px;
    background: linear-gradient(90deg, #0ea5e9, #22d3ee, #06b6d4);
    box-shadow: 0 0 12px rgba(34,211,238,0.4);
    transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
  }
  .rdm-progress-segments { display: flex; gap: 1.5rem; margin-top: 10px; flex-wrap: wrap; }
  .rdm-progress-seg { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }
  .rdm-progress-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

  /* ── Section Nav ── */
  .rdm-nav { background: var(--surface2); border-bottom: 1px solid var(--border); padding: 0 2rem; display: flex; gap: 0; overflow-x: auto; }
  .rdm-nav::-webkit-scrollbar { height: 0; }
  .rdm-nav-btn {
    padding: 14px 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    border: none; background: none; color: var(--muted); cursor: pointer;
    border-bottom: 2px solid transparent; white-space: nowrap; transition: all 0.15s;
    font-family: 'JetBrains Mono', monospace;
  }
  .rdm-nav-btn:hover { color: var(--text); }
  .rdm-nav-btn.active { color: var(--cyan); border-bottom-color: var(--cyan); }

  /* ── Filters ── */
  .rdm-filters {
    padding: 1rem 2rem; display: flex; gap: 10px; flex-wrap: wrap;
    align-items: center; border-bottom: 1px solid var(--border); background: var(--bg);
  }
  .rdm-search {
    flex: 1; min-width: 200px; background: var(--surface2); border: 1px solid var(--border);
    border-radius: 6px; padding: 8px 14px; font-size: 13px; color: var(--text);
    font-family: 'JetBrains Mono', monospace; outline: none;
  }
  .rdm-search::placeholder { color: var(--muted); }
  .rdm-search:focus { border-color: rgba(34,211,238,0.4); box-shadow: 0 0 0 3px rgba(34,211,238,0.06); }
  .rdm-select {
    background: var(--surface2); border: 1px solid var(--border); border-radius: 6px;
    padding: 8px 12px; font-size: 12px; color: var(--text); cursor: pointer; outline: none;
    font-family: 'JetBrains Mono', monospace; letter-spacing: 0.04em;
  }
  .rdm-select:focus { border-color: rgba(34,211,238,0.4); }
  .rdm-results { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted); white-space: nowrap; align-self: center; }

  /* ── Card Grid ── */
  .rdm-grid { padding: 1.5rem 2rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px; }

  /* ── Card ── */
  .rdm-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 10px;
    overflow: hidden; cursor: pointer; transition: border-color 0.2s, transform 0.15s, box-shadow 0.15s;
    opacity: 0; animation: rdmFadeUp 0.4s forwards;
  }
  .rdm-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
  @keyframes rdmFadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .rdm-card-top { height: 3px; transition: opacity 0.2s; }
  .rdm-card-body { padding: 16px; }
  .rdm-card-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .rdm-card-section { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; }
  .rdm-card-diff { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; padding: 2px 8px; border-radius: 3px; font-family: 'JetBrains Mono', monospace; }
  .rdm-card-title { font-size: 14px; font-weight: 700; color: #f0f6fc; margin-bottom: 7px; line-height: 1.35; font-family: 'Syne', sans-serif; }
  .rdm-card-desc { font-size: 12px; color: var(--muted); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 14px; }
  .rdm-card-footer { display: flex; gap: 6px; }
  .rdm-status-btn {
    flex: 1; padding: 6px 4px; font-size: 10px; font-weight: 600; letter-spacing: 0.06em;
    border-radius: 5px; border: 1px solid; cursor: pointer; transition: all 0.15s;
    font-family: 'JetBrains Mono', monospace; text-transform: uppercase;
  }
  .rdm-status-btn:hover { filter: brightness(1.2); }

  /* ── Section divider in grid ── */
  .rdm-section-header { grid-column: 1/-1; display: flex; align-items: center; gap: 12px; padding: 6px 0 2px; }
  .rdm-section-line { flex: 1; height: 1px; background: var(--border); }
  .rdm-section-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); white-space: nowrap; }

  /* ── Empty state ── */
  .rdm-empty { grid-column: 1/-1; text-align: center; padding: 60px 20px; }
  .rdm-empty-icon { font-size: 36px; margin-bottom: 12px; opacity: 0.3; }
  .rdm-empty-text { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--muted); letter-spacing: 0.1em; }

  /* ── Modal ── */
  .rdm-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 100;
    display: flex; align-items: center; justify-content: center; padding: 20px;
    backdrop-filter: blur(4px);
  }
  .rdm-modal {
    background: var(--surface); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 14px; width: 100%; max-width: 520px; overflow: hidden;
    animation: rdmModalIn 0.2s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes rdmModalIn {
    from { opacity: 0; transform: scale(0.95) translateY(8px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  .rdm-modal-header { padding: 24px 24px 0; }
  .rdm-modal-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .rdm-modal-title { font-size: 20px; font-weight: 800; color: #f0f6fc; line-height: 1.3; font-family: 'Syne', sans-serif; }
  .rdm-modal-desc { font-size: 14px; color: var(--text); line-height: 1.75; padding: 14px 24px 0; }
  .rdm-modal-footer {
    padding: 20px 24px 24px; display: flex; gap: 8px;
    border-top: 1px solid var(--border); margin-top: 20px;
  }
  .rdm-modal-status-btn {
    flex: 1; padding: 10px; font-size: 12px; font-weight: 700; letter-spacing: 0.08em;
    border-radius: 8px; border: 1px solid; cursor: pointer; text-transform: uppercase;
    font-family: 'JetBrains Mono', monospace; transition: all 0.15s;
  }
  .rdm-modal-status-btn:hover { filter: brightness(1.15); }
  .rdm-modal-close {
    background: none; border: none; color: var(--muted); font-size: 22px;
    cursor: pointer; line-height: 1; padding: 2px 6px; border-radius: 4px; transition: color 0.15s;
  }
  .rdm-modal-close:hover { color: var(--text); }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .rdm-header { padding: 0 1rem; }
    .rdm-header-stats { gap: 12px; }
    .rdm-stat-val { font-size: 14px; }
    .rdm-progress-wrap, .rdm-filters, .rdm-grid { padding-left: 1rem; padding-right: 1rem; }
    .rdm-nav { padding: 0 1rem; }
    .rdm-grid { grid-template-columns: 1fr; }
    .rdm-modal-footer { flex-direction: column; }
  }
`;

// ── Component ──────────────────────────────────────────────────────────────────
export default function App() {
  const [progress, setProgress]           = useState(loadProgress);
  const [activeSection, setActiveSection] = useState("all");
  const [search, setSearch]               = useState("");
  const [filterStatus, setFilterStatus]   = useState("all");
  const [filterDiff, setFilterDiff]       = useState("all");
  const [modal, setModal]                 = useState(null);
  const [mounted, setMounted]             = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { saveProgress(progress); }, [progress]);

  // Close modal on Escape key
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") setModal(null); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function getStatus(id) { return progress[id] || "not_started"; }
  function setStatus(id, status) { setProgress(p => ({ ...p, [id]: status })); }

  // ── Aggregates ───────────────────────────────────────────────────────────────
  const allItems = Object.values(TOPICS).flatMap(s => s.items);
  const totalComplete   = allItems.filter(i => getStatus(i.id) === "complete").length;
  const totalInProgress = allItems.filter(i => getStatus(i.id) === "in_progress").length;
  const pct = Math.round((totalComplete / allItems.length) * 100);

  function sectionPct(key) {
    const items = TOPICS[key].items;
    return Math.round((items.filter(i => getStatus(i.id) === "complete").length / items.length) * 100);
  }

  // ── Filtered + grouped items ─────────────────────────────────────────────────
  const groupedFiltered = Object.entries(TOPICS).reduce((acc, [key, section]) => {
    const items = section.items
      .filter(item => activeSection === "all" || activeSection === key)
      .filter(item => filterStatus === "all" || getStatus(item.id) === filterStatus)
      .filter(item => filterDiff === "all" || item.difficulty === filterDiff)
      .filter(item =>
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.desc.toLowerCase().includes(search.toLowerCase())
      );
    if (items.length) acc.push({ key, section, items });
    return acc;
  }, []);

  const totalFiltered = groupedFiltered.reduce((n, g) => n + g.items.length, 0);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: "#080c10", fontFamily: "'Syne', sans-serif", color: "#c9d1d9" }}>

        {/* ── Header ── */}
        <header className="rdm-header">
          <div className="rdm-logo">
            <span className="rdm-logo-mark">◎</span>
            <div>
              <div className="rdm-logo-text">Web Dev Roadmap</div>
              <div className="rdm-logo-sub">Learning Tracker</div>
            </div>
          </div>
          <div className="rdm-header-stats">
            {[
              { val: totalComplete,   label: "Complete",    color: "#22c55e" },
              { val: totalInProgress, label: "In Progress", color: "#f59e0b" },
              { val: allItems.length - totalComplete - totalInProgress, label: "Remaining", color: "#475569" },
            ].map(s => (
              <div className="rdm-stat" key={s.label}>
                <div className="rdm-stat-val" style={{ color: s.color }}>{s.val}</div>
                <div className="rdm-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </header>

        {/* ── Progress Bar ── */}
        <div className="rdm-progress-wrap">
          <div className="rdm-progress-top">
            <span className="rdm-progress-title">Overall Progress — {totalComplete} of {allItems.length} topics</span>
            <span className="rdm-progress-pct">{pct}%</span>
          </div>
          <div className="rdm-progress-track">
            <div className="rdm-progress-fill" style={{ width: mounted ? `${pct}%` : "0%" }} />
          </div>
          <div className="rdm-progress-segments">
            {Object.entries(TOPICS).map(([key, sec]) => (
              <div className="rdm-progress-seg" key={key}>
                <div className="rdm-progress-dot" style={{ background: sec.accent }} />
                <span style={{ color: sec.accent, fontWeight: 600 }}>{sectionPct(key)}%</span>
                <span>{sec.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section Nav ── */}
        <nav className="rdm-nav">
          <button className={`rdm-nav-btn ${activeSection === "all" ? "active" : ""}`} onClick={() => setActiveSection("all")}>
            All Topics
          </button>
          {Object.entries(TOPICS).map(([key, sec]) => (
            <button
              key={key}
              className={`rdm-nav-btn ${activeSection === key ? "active" : ""}`}
              style={activeSection === key ? { color: sec.accent, borderBottomColor: sec.accent } : {}}
              onClick={() => setActiveSection(key)}
            >
              {sec.icon} {sec.label}
            </button>
          ))}
        </nav>

        {/* ── Filters ── */}
        <div className="rdm-filters">
          <input
            className="rdm-search"
            placeholder="Search topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="rdm-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="complete">Complete</option>
          </select>
          <select className="rdm-select" value={filterDiff} onChange={e => setFilterDiff(e.target.value)}>
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <div className="rdm-results">{totalFiltered} topic{totalFiltered !== 1 ? "s" : ""}</div>
        </div>

        {/* ── Card Grid ── */}
        <div className="rdm-grid">
          {totalFiltered === 0 && (
            <div className="rdm-empty">
              <div className="rdm-empty-icon">◌</div>
              <div className="rdm-empty-text">No topics match your filters</div>
            </div>
          )}

          {groupedFiltered.map(({ key, section, items }, gi) => (
            <React.Fragment key={key}>
              {/* Section divider when showing all */}
              {activeSection === "all" && (
                <div className="rdm-section-header">
                  <div className="rdm-section-line" />
                  <div className="rdm-section-label" style={{ color: section.accent }}>
                    {section.icon} {section.label} — {sectionPct(key)}% done
                  </div>
                  <div className="rdm-section-line" />
                </div>
              )}

              {items.map((item, idx) => {
                const status = getStatus(item.id);
                const cfg = STATUS_CONFIG[status];
                return (
                  <div
                    key={item.id}
                    className="rdm-card"
                    style={{
                      borderColor: status !== "not_started" ? cfg.border : "rgba(255,255,255,0.07)",
                      animationDelay: `${(gi * 0.05) + (idx * 0.04)}s`,
                    }}
                    onClick={() => setModal({ item, section })}
                  >
                    {/* Color bar along top edge */}
                    <div className="rdm-card-top" style={{
                      background: status === "complete" ? "#22c55e" : status === "in_progress" ? "#f59e0b" : section.accent,
                      opacity: status === "not_started" ? 0.25 : 1,
                    }} />

                    <div className="rdm-card-body">
                      <div className="rdm-card-meta">
                        <span className="rdm-card-section" style={{ color: section.accent }}>
                          {section.icon} {section.label}
                        </span>
                        <span className="rdm-card-diff" style={{
                          color: DIFFICULTIES[item.difficulty],
                          background: `${DIFFICULTIES[item.difficulty]}18`,
                          border: `1px solid ${DIFFICULTIES[item.difficulty]}30`,
                        }}>
                          {item.difficulty}
                        </span>
                      </div>

                      <div className="rdm-card-title">{item.title}</div>
                      <div className="rdm-card-desc">{item.desc}</div>

                      {/* Status buttons — stop propagation so card click doesn't fire */}
                      <div className="rdm-card-footer" onClick={e => e.stopPropagation()}>
                        {Object.entries(STATUS_CONFIG).map(([s, c]) => (
                          <button
                            key={s}
                            className="rdm-status-btn"
                            title={c.label}
                            style={{
                              background: status === s ? c.bg : "transparent",
                              borderColor: status === s ? c.border : "rgba(255,255,255,0.08)",
                              color: status === s ? c.color : "#475569",
                            }}
                            onClick={() => setStatus(item.id, s)}
                          >
                            {s === "not_started" ? "—" : s === "in_progress" ? "▶" : "✓"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        {/* ── Detail Modal ── */}
        {modal && (
          <div className="rdm-overlay" onClick={() => setModal(null)}>
            <div className="rdm-modal" onClick={e => e.stopPropagation()}>
              <div className="rdm-modal-header">
                <div className="rdm-modal-meta">
                  <span className="rdm-card-section" style={{ color: modal.section.accent }}>
                    {modal.section.icon} {modal.section.label}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="rdm-card-diff" style={{
                      color: DIFFICULTIES[modal.item.difficulty],
                      background: `${DIFFICULTIES[modal.item.difficulty]}18`,
                      border: `1px solid ${DIFFICULTIES[modal.item.difficulty]}30`,
                    }}>
                      {modal.item.difficulty}
                    </span>
                    <button className="rdm-modal-close" onClick={() => setModal(null)}>×</button>
                  </div>
                </div>
                <div className="rdm-modal-title">{modal.item.title}</div>
              </div>

              <div className="rdm-modal-desc">{modal.item.desc}</div>

              <div className="rdm-modal-footer">
                {Object.entries(STATUS_CONFIG).map(([s, c]) => {
                  const current = getStatus(modal.item.id);
                  return (
                    <button
                      key={s}
                      className="rdm-modal-status-btn"
                      style={{
                        background: current === s ? c.bg : "transparent",
                        borderColor: current === s ? c.border : "rgba(255,255,255,0.1)",
                        color: current === s ? c.color : "#475569",
                      }}
                      onClick={() => { setStatus(modal.item.id, s); setModal(null); }}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
