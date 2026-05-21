import { useState, useEffect, useCallback, useRef } from 'react';
import { ResumeData, defaultResume } from './types/resume';
import { exampleResumes } from './data/examples';
import ResumeEditor from './components/ResumeEditor';
import ResumePreview from './components/ResumePreview';
import {
  type Locale,
  type TranslationDict,
  dicts,
  detectBrowserLocale,
} from './i18n';
import {
  type Theme,
  getStoredTheme,
  storeTheme,
  getSystemTheme,
  applyTheme,
  listenSystemTheme,
} from './theme';

const AUTO_SAVE_KEY = 'autoSaveResume';
const SAVED_LIST_KEY = 'savedResumes';
const LOCALE_KEY = 'resumecraft-locale';

/* ---------- helpers ---------- */
function loadLocale(): Locale {
  try {
    const s = localStorage.getItem(LOCALE_KEY);
    if (s === 'zh' || s === 'en') return s;
  } catch {}
  return detectBrowserLocale();
}
function saveLocale(l: Locale) {
  try {
    localStorage.setItem(LOCALE_KEY, l);
  } catch {}
}

function App() {
  /* ---- state ---- */
  const [resume, setResume] = useState<ResumeData>(() => {
    const autoSaved = localStorage.getItem(AUTO_SAVE_KEY);
    if (autoSaved) {
      try {
        const p = JSON.parse(autoSaved);
        if (p?.personal) return p;
      } catch {}
    }
    return JSON.parse(JSON.stringify(defaultResume));
  });

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedResumes, setSavedResumes] = useState<ResumeData[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [atsMode, setAtsMode] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    summary: true, experience: true, education: true, project: true, skill: true,
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  /* i18n & theme */
  const [locale, setLocale] = useState<Locale>(loadLocale);
  const t: TranslationDict = dicts[locale];

  const [theme, setTheme] = useState<Theme>(() => {
    const stored = getStoredTheme();
    if (stored) return stored;
    return getSystemTheme();
  });

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---- effects ---- */
  // Apply theme
  useEffect(() => { applyTheme(theme); }, [theme]);
  useEffect(() => {
    const unsub = listenSystemTheme((sysTheme) => {
      if (!getStoredTheme()) {
        setTheme(sysTheme);
      }
    });
    return unsub;
  }, []);

  // Toast helper
  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 2500);
    }, [],
  );

  // Auto-save
  useEffect(() => {
    if (!isDirty) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(resume));
    }, 2000);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [resume, isDirty]);

  // Load saved list
  useEffect(() => {
    const saved = localStorage.getItem(SAVED_LIST_KEY);
    if (saved) { try { setSavedResumes(JSON.parse(saved)); } catch {} }
  }, []);

  // beforeunload
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === 's' || e.key === 'S') { e.preventDefault(); saveCurrentResume(); }
      else if (e.key === 'e' || e.key === 'E') { e.preventDefault(); downloadPDF(); }
      else if (e.key === 'z' || e.key === 'Z') { if (zoom > 0.5) setZoom((z) => Math.max(0.5, z - 0.1)); }
      else if (e.key === 'x' || e.key === 'X') { if (zoom < 1.5) setZoom((z) => Math.min(1.5, z + 0.1)); }
      else if (e.key === '0') { e.preventDefault(); setZoom(1); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [resume, isDirty, zoom]);

  /* ---- save / load ---- */
  const saveCurrentResume = () => {
    const updated = [...savedResumes.filter((r) => r.id !== resume.id), resume];
    setSavedResumes(updated);
    localStorage.setItem(SAVED_LIST_KEY, JSON.stringify(updated));
    localStorage.removeItem(AUTO_SAVE_KEY);
    setIsDirty(false);
    showToast(t.toastSaved, 'success');
  };

  const loadResume = (r: ResumeData) => {
    if (isDirty && !confirm(t.confirmLoadOther)) return;
    setResume(r); setIsDirty(false); setShowSaveModal(false); setShowTemplateModal(false);
  };

  const createNewResume = () => {
    if (isDirty && !confirm(t.confirmNewResume)) return;
    setResume(JSON.parse(JSON.stringify(defaultResume)));
    setIsDirty(false);
    setShowTemplateModal(false);
  };

  const useExampleResume = (example: ResumeData) => {
    if (isDirty && !confirm(t.confirmUseExample)) return;
    setResume({ ...JSON.parse(JSON.stringify(example)), id: `user-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    setIsDirty(false);
    setShowTemplateModal(false);
  };

  const updateResume = (r: ResumeData) => { setResume(r); setIsDirty(true); };

  /* ---- import / export ---- */
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${resume.personal.name || 'resume'}-backup.json`; a.click();
    URL.revokeObjectURL(url);
    showToast(t.toastExported, 'info');
  };

  const importJSON = () => fileInputRef.current?.click();

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (isDirty && !confirm(t.confirmImport)) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (!data.personal || !data.experiences) { showToast(t.toastImportBadFormat, 'error'); return; }
        setResume({ ...data, id: `user-${Date.now()}`, updatedAt: new Date().toISOString() });
        setIsDirty(false);
        showToast(t.toastImportSuccess, 'success');
      } catch { showToast(t.toastImportParseError, 'error'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  /* ---- zoom ---- */
  const zoomIn = () => setZoom((z) => Math.min(1.5, z + 0.1));
  const zoomOut = () => setZoom((z) => Math.max(0.5, z - 0.1));
  const zoomReset = () => setZoom(1);
  const toggleSection = (key: string) => setVisibleSections((p) => ({ ...p, [key]: !p[key] }));

  /* ---- PDF ---- */
  const downloadPDF = () => {
    if (activeTab === 'edit') { setActiveTab('preview'); setTimeout(() => doDownloadPDF(), 300); return; }
    doDownloadPDF();
  };

  const doDownloadPDF = () => {
    const element = document.getElementById('resume-preview');
    if (!element) { showToast(t.toastPreviewNotReady, 'error'); return; }
    const prevWidth = element.style.width, prevMinW = element.style.minWidth, prevT = element.style.transform;
    element.style.width = '794px'; element.style.minWidth = '794px'; element.style.transform = 'scale(1)';
    requestAnimationFrame(() => {
      const w = element.offsetWidth, h = element.offsetHeight;
      import('html2pdf.js').then((m: any) => {
        m.default().set({
          margin: 0,
          filename: `${resume.personal.name || 'resume'}-resume.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, width: w, windowWidth: w },
          jsPDF: { unit: 'px', format: [w, h], orientation: 'portrait' },
        }).from(element).save();
        showToast(t.toastPDFDownloading, 'info');
      }).catch(() => showToast(t.toastPDFFailed, 'error'))
        .finally(() => { element.style.width = prevWidth; element.style.minWidth = prevMinW; element.style.transform = prevT; });
    });
  };

  /* ---- theme / locale toggles ---- */
  const cycleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    storeTheme(next);
  };

  const toggleLocale = () => {
    const next: Locale = locale === 'zh' ? 'en' : 'zh';
    setLocale(next);
    saveLocale(next);
  };

  /* ---- render ---- */
  return (
    <div className="app">
      <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileImport} />

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>{t.appTitle}</h1>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={toggleLocale} title="Switch language / 切换语言">
              🌐 {locale === 'zh' ? 'EN' : '中文'}
            </button>
            <button className="btn btn-secondary" onClick={cycleTheme} title="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button className="btn btn-secondary" onClick={() => setShowSaveModal(true)}>{t.btnSave}</button>
            <button className="btn btn-secondary" onClick={importJSON}>{t.btnImport}</button>
            <button className="btn btn-secondary" onClick={exportJSON}>{t.btnExport}</button>
            <button className="btn btn-secondary" onClick={() => setShowTemplateModal(true)}>{t.btnTemplates}</button>
            <button className="btn btn-primary" onClick={downloadPDF}>{t.btnDownloadPDF}</button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="app-main">
        <div className="toolbar">
          <div className="tab-switcher">
            <button className={`tab-btn ${activeTab === 'edit' ? 'active' : ''}`} onClick={() => setActiveTab('edit')}>{t.tabEdit}</button>
            <button className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>{t.tabPreview}</button>
          </div>
          <div className="toolbar-right">
            <div className="zoom-controls">
              <button className="btn-icon" onClick={zoomOut} disabled={zoom <= 0.5} title="Ctrl+Z">−</button>
              <span className="zoom-label" onClick={zoomReset} title="Ctrl+0">{Math.round(zoom * 100)}%</span>
              <button className="btn-icon" onClick={zoomIn} disabled={zoom >= 1.5} title="Ctrl+X">+</button>
            </div>
            <div className="visibility-toggles">
              {([
                { key: 'summary', label: t.sectionSummary },
                { key: 'experience', label: t.sectionExperience },
                { key: 'education', label: t.sectionEducation },
                { key: 'project', label: t.sectionProject },
                { key: 'skill', label: t.sectionSkill },
              ] as const).map(({ key, label }) => (
                <label key={key} className="toggle-label">
                  <input type="checkbox" checked={visibleSections[key]} onChange={() => toggleSection(key)} />
                  {label}
                </label>
              ))}
            </div>
            <label className="toggle-label ats-toggle">
              <input type="checkbox" checked={atsMode} onChange={(e) => setAtsMode(e.target.checked)} />
              {t.atsLabel}
            </label>
          </div>
        </div>

        <div className="split-view">
          {activeTab === 'edit' && (
            <div className="editor-panel">
              <ResumeEditor resume={resume} onUpdate={updateResume} t={t} />
            </div>
          )}
          <div className="preview-panel">
            <ResumePreview resume={resume} zoom={zoom} visibleSections={visibleSections} atsMode={atsMode} t={t} />
          </div>
        </div>
      </main>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="modal-overlay" onClick={() => setShowTemplateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{t.tmplTitle}</h2>
            <div className="template-grid">
              <div className="template-card" onClick={createNewResume}>
                <h3>{t.tmplBlank}</h3>
                <p>{t.tmplBlankDesc}</p>
              </div>
              {exampleResumes.map((ex) => (
                <div key={ex.id} className="template-card" onClick={() => useExampleResume(ex)}>
                  <h3>{ex.personal.name} - {ex.personal.title}</h3>
                  <p>{ex.personal.summary.substring(0, 50)}...</p>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowTemplateModal(false)}>{t.btnCancel}</button>
            </div>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{t.saveTitle}</h2>
            <div className="saved-list">
              {savedResumes.map((s) => (
                <div key={s.id} className="saved-item">
                  <div className="saved-info">
                    <h4>{s.personal.name}</h4>
                    <p>{s.personal.title}</p>
                    <span className="saved-date">{new Date(s.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="saved-actions">
                    <button className="btn btn-primary" onClick={() => loadResume(s)}>{t.saveLoad}</button>
                    <button className="btn btn-danger" onClick={() => {
                      const up = savedResumes.filter((r) => r.id !== s.id);
                      setSavedResumes(up);
                      localStorage.setItem(SAVED_LIST_KEY, JSON.stringify(up));
                    }}>{t.saveDelete}</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowSaveModal(false)}>{t.saveClose}</button>
              <button className="btn btn-primary" onClick={saveCurrentResume}>{t.saveCurrent}</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast !== null && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' && '✅ '}
          {toast.type === 'error' && '❌ '}
          {toast.type === 'info' && 'ℹ️ '}
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default App;
