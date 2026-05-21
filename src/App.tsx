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
import { extractTextFromPDF } from './utils/pdfParser';
import { parseResumeFromText } from './utils/resumeParser';

const AUTO_SAVE_KEY = 'autoSaveResume';
const SAVED_LIST_KEY = 'savedResumes';
const LOCALE_KEY = 'resumecraft-locale';

function loadLocale(): Locale {
  try { const s = localStorage.getItem(LOCALE_KEY); if (s === 'zh' || s === 'en') return s; } catch {}
  return detectBrowserLocale();
}
function saveLocale(l: Locale) { try { localStorage.setItem(LOCALE_KEY, l); } catch {} }

function App() {
  const [resume, setResume] = useState<ResumeData>(() => {
    const a = localStorage.getItem(AUTO_SAVE_KEY);
    if (a) { try { const p = JSON.parse(a); if (p?.personal) return p; } catch {} }
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
  const [pdfImporting, setPdfImporting] = useState(false);

  const [locale, setLocale] = useState<Locale>(loadLocale);
  const t: TranslationDict = dicts[locale];
  const [theme, setTheme] = useState<Theme>(() => { const s = getStoredTheme(); return s || getSystemTheme(); });

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { applyTheme(theme); }, [theme]);
  useEffect(() => { const u = listenSystemTheme((sys) => { if (!getStoredTheme()) setTheme(sys); }); return u; }, []);
  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'success') => { setToast({ message: msg, type }); setTimeout(() => setToast(null), 2500); }, []);

  useEffect(() => { if (!isDirty) return; if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); autoSaveTimer.current = setTimeout(() => localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(resume)), 2000); return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); }; }, [resume, isDirty]);
  useEffect(() => { const s = localStorage.getItem(SAVED_LIST_KEY); if (s) { try { setSavedResumes(JSON.parse(s)); } catch {} } }, []);
  useEffect(() => { const h = (e: BeforeUnloadEvent) => { if (isDirty) { e.preventDefault(); e.returnValue = ''; } }; window.addEventListener('beforeunload', h); return () => window.removeEventListener('beforeunload', h); }, [isDirty]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { const m = e.metaKey || e.ctrlKey; if (!m) return; if (e.key === 's' || e.key === 'S') { e.preventDefault(); saveCurrentResume(); } else if (e.key === 'e' || e.key === 'E') { e.preventDefault(); downloadPDF(); } else if (e.key === 'z' || e.key === 'Z') { if (zoom > 0.5) setZoom((z) => Math.max(0.5, z - 0.1)); } else if (e.key === 'x' || e.key === 'X') { if (zoom < 1.5) setZoom((z) => Math.min(1.5, z + 0.1)); } else if (e.key === '0') { e.preventDefault(); setZoom(1); } };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [resume, isDirty, zoom]);

  const saveCurrentResume = () => { const u = [...savedResumes.filter((r) => r.id !== resume.id), resume]; setSavedResumes(u); localStorage.setItem(SAVED_LIST_KEY, JSON.stringify(u)); localStorage.removeItem(AUTO_SAVE_KEY); setIsDirty(false); showToast(t.toastSaved); };
  const loadResume = (r: ResumeData) => { if (isDirty && !confirm(t.confirmLoadOther)) return; setResume(r); setIsDirty(false); setShowSaveModal(false); setShowTemplateModal(false); };
  const createNewResume = () => { if (isDirty && !confirm(t.confirmNewResume)) return; setResume(JSON.parse(JSON.stringify(defaultResume))); setIsDirty(false); setShowTemplateModal(false); };
  const useExampleResume = (ex: ResumeData) => { if (isDirty && !confirm(t.confirmUseExample)) return; setResume({ ...JSON.parse(JSON.stringify(ex)), id: `user-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }); setIsDirty(false); setShowTemplateModal(false); };
  const updateResume = (r: ResumeData) => { setResume(r); setIsDirty(true); };

  /* ---- PDF import ---- */
  const importPDF = () => pdfInputRef.current?.click();
  const handlePdfImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (isDirty && !confirm(t.confirmImport)) return;
    setPdfImporting(true);
    try {
      const text = await extractTextFromPDF(file);
      const parsed = parseResumeFromText(text);
      if (!parsed) { showToast('无法解析 PDF 中的简历信息，请尝试导入 JSON 格式', 'error'); return; }
      const summary = `姓名: ${parsed.personal.name}\n经历: ${parsed.experiences.length} 条\n教育: ${parsed.education.length} 条\n项目: ${parsed.projects.length} 条\n技能: ${parsed.skills.length} 条`;
      if (!confirm(`✅ PDF 解析完成！\n\n${summary}\n\n⚠️ 自动解析可能不完整，建议加载后手动修正。\n是否加载到编辑器？`)) return;
      setResume(parsed); setIsDirty(false);
      showToast('PDF 简历已导入，请检查并修正', 'success');
      setActiveTab('edit');
    } catch (err: any) { showToast('PDF 解析失败: ' + (err?.message || '未知错误'), 'error'); }
    finally { setPdfImporting(false); e.target.value = ''; }
  };

  /* ---- import / export ---- */
  const exportJSON = () => { const b = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = `${resume.personal.name || 'resume'}-backup.json`; a.click(); URL.revokeObjectURL(u); showToast(t.toastExported, 'info'); };
  const importJSON = () => fileInputRef.current?.click();
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (!f) return; if (isDirty && !confirm(t.confirmImport)) return; const r = new FileReader(); r.onload = (ev) => { try { const d = JSON.parse(ev.target?.result as string); if (!d.personal || !d.experiences) { showToast(t.toastImportBadFormat, 'error'); return; } setResume({ ...d, id: `user-${Date.now()}`, updatedAt: new Date().toISOString() }); setIsDirty(false); showToast(t.toastImportSuccess); } catch { showToast(t.toastImportParseError, 'error'); } }; r.readAsText(f); e.target.value = ''; };

  const zoomIn = () => setZoom((z) => Math.min(1.5, z + 0.1));
  const zoomOut = () => setZoom((z) => Math.max(0.5, z - 0.1));
  const zoomReset = () => setZoom(1);
  const toggleSection = (k: string) => setVisibleSections((p) => ({ ...p, [k]: !p[k] }));

  const downloadPDF = () => { if (activeTab === 'edit') { setActiveTab('preview'); setTimeout(() => doDownloadPDF(), 300); return; } doDownloadPDF(); };
  const doDownloadPDF = () => {
    const el = document.getElementById('resume-preview'); if (!el) { showToast(t.toastPreviewNotReady, 'error'); return; }
    const pw = el.style.width, pmw = el.style.minWidth, pt = el.style.transform;
    el.style.width = '794px'; el.style.minWidth = '794px'; el.style.transform = 'scale(1)';
    requestAnimationFrame(() => { const w = el.offsetWidth, h = el.offsetHeight;
      import('html2pdf.js').then((m: any) => { m.default().set({ margin: 0, filename: `${resume.personal.name || 'resume'}-resume.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true, width: w, windowWidth: w }, jsPDF: { unit: 'px', format: [w, h], orientation: 'portrait' } }).from(el).save(); showToast(t.toastPDFDownloading, 'info'); })
        .catch(() => showToast(t.toastPDFFailed, 'error'))
        .finally(() => { el.style.width = pw; el.style.minWidth = pmw; el.style.transform = pt; }); });
  };

  const cycleTheme = () => { const n = theme === 'light' ? 'dark' : 'light'; setTheme(n); storeTheme(n); };
  const toggleLocale = () => { const n: Locale = locale === 'zh' ? 'en' : 'zh'; setLocale(n); saveLocale(n); };

  return (
    <div className="app">
      <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileImport} />
      <input ref={pdfInputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={handlePdfImport} />

      <header className="app-header"><div className="header-content"><h1>{t.appTitle}</h1>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={toggleLocale} title="Switch language">🌐 {locale === 'zh' ? 'EN' : '中文'}</button>
          <button className="btn btn-secondary" onClick={cycleTheme}>{theme === 'light' ? '🌙' : '☀️'}</button>
          <button className="btn btn-secondary" onClick={() => setShowSaveModal(true)}>{t.btnSave}</button>
          <button className="btn btn-secondary" onClick={importPDF} disabled={pdfImporting}>{pdfImporting ? '⏳ 解析中...' : '📄 导入PDF'}</button>
          <button className="btn btn-secondary" onClick={importJSON}>{t.btnImport}</button>
          <button className="btn btn-secondary" onClick={exportJSON}>{t.btnExport}</button>
          <button className="btn btn-secondary" onClick={() => setShowTemplateModal(true)}>{t.btnTemplates}</button>
          <button className="btn btn-primary" onClick={downloadPDF}>{t.btnDownloadPDF}</button>
        </div>
      </div></header>

      <main className="app-main">
        <div className="toolbar">
          <div className="tab-switcher"><button className={`tab-btn ${activeTab === 'edit' ? 'active' : ''}`} onClick={() => setActiveTab('edit')}>{t.tabEdit}</button><button className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>{t.tabPreview}</button></div>
          <div className="toolbar-right">
            <div className="zoom-controls"><button className="btn-icon" onClick={zoomOut} disabled={zoom <= 0.5}>−</button><span className="zoom-label" onClick={zoomReset}>{Math.round(zoom * 100)}%</span><button className="btn-icon" onClick={zoomIn} disabled={zoom >= 1.5}>+</button></div>
            <div className="visibility-toggles">{([{ key: 'summary', label: t.sectionSummary }, { key: 'experience', label: t.sectionExperience }, { key: 'education', label: t.sectionEducation }, { key: 'project', label: t.sectionProject }, { key: 'skill', label: t.sectionSkill }] as const).map(({ key, label }) => (<label key={key} className="toggle-label"><input type="checkbox" checked={visibleSections[key]} onChange={() => toggleSection(key)} />{label}</label>))}</div>
            <label className="toggle-label ats-toggle"><input type="checkbox" checked={atsMode} onChange={(e) => setAtsMode(e.target.checked)} />{t.atsLabel}</label>
          </div>
        </div>
        <div className="split-view">
          {activeTab === 'edit' && (<div className="editor-panel"><ResumeEditor resume={resume} onUpdate={updateResume} t={t} /></div>)}
          <div className="preview-panel"><ResumePreview resume={resume} zoom={zoom} visibleSections={visibleSections} atsMode={atsMode} t={t} /></div>
        </div>
      </main>

      {showTemplateModal && (<div className="modal-overlay" onClick={() => setShowTemplateModal(false)}><div className="modal-content" onClick={(e) => e.stopPropagation()}><h2>{t.tmplTitle}</h2><div className="template-grid"><div className="template-card" onClick={createNewResume}><h3>{t.tmplBlank}</h3><p>{t.tmplBlankDesc}</p></div>{exampleResumes.map((ex) => (<div key={ex.id} className="template-card" onClick={() => useExampleResume(ex)}><h3>{ex.personal.name} - {ex.personal.title}</h3><p>{ex.personal.summary.substring(0, 50)}...</p></div>))}</div><div className="modal-actions"><button className="btn btn-secondary" onClick={() => setShowTemplateModal(false)}>{t.btnCancel}</button></div></div></div>)}

      {showSaveModal && (<div className="modal-overlay" onClick={() => setShowSaveModal(false)}><div className="modal-content" onClick={(e) => e.stopPropagation()}><h2>{t.saveTitle}</h2><div className="saved-list">{savedResumes.map((s) => (<div key={s.id} className="saved-item"><div className="saved-info"><h4>{s.personal.name}</h4><p>{s.personal.title}</p><span className="saved-date">{new Date(s.updatedAt).toLocaleDateString()}</span></div><div className="saved-actions"><button className="btn btn-primary" onClick={() => loadResume(s)}>{t.saveLoad}</button><button className="btn btn-danger" onClick={() => { const u = savedResumes.filter((r) => r.id !== s.id); setSavedResumes(u); localStorage.setItem(SAVED_LIST_KEY, JSON.stringify(u)); }}>{t.saveDelete}</button></div></div>))}</div><div className="modal-actions"><button className="btn btn-secondary" onClick={() => setShowSaveModal(false)}>{t.saveClose}</button><button className="btn btn-primary" onClick={saveCurrentResume}>{t.saveCurrent}</button></div></div></div>)}

      {toast !== null && (<div className={`toast toast-${toast.type}`}>{toast.type === 'success' && '✅ '}{toast.type === 'error' && '❌ '}{toast.type === 'info' && 'ℹ️ '}{toast.message}</div>)}
    </div>
  );
}

export default App;
