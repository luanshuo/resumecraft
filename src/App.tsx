import { useState, useEffect, useCallback, useRef } from 'react';
import { ResumeData, defaultResume } from './types/resume';
import { exampleResumes } from './data/examples';
import ResumeEditor from './components/ResumeEditor';
import ResumePreview from './components/ResumePreview';

const AUTO_SAVE_KEY = 'autoSaveResume';
const SAVED_LIST_KEY = 'savedResumes';

function App() {
  const [resume, setResume] = useState<ResumeData>(() => {
    // 优先恢复自动保存的简历
    const autoSaved = localStorage.getItem(AUTO_SAVE_KEY);
    if (autoSaved) {
      try {
        const parsed = JSON.parse(autoSaved);
        if (parsed && parsed.personal) return parsed;
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
  const [visibleSections, setVisibleSections] = useState<
    Record<string, boolean>
  >({
    summary: true,
    experience: true,
    education: true,
    project: true,
    skill: true,
  });

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 2500);
    },
    []
  );

  // ========== 自动保存 ==========
  useEffect(() => {
    if (!isDirty) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(resume));
    }, 2000);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [resume, isDirty]);

  // 从 localStorage 加载已保存列表
  useEffect(() => {
    const saved = localStorage.getItem(SAVED_LIST_KEY);
    if (saved) {
      try {
        setSavedResumes(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // beforeunload 未保存提醒
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // ========== 键盘快捷键 ==========
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        saveCurrentResume();
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        downloadPDF();
      } else if (e.key === 'z' || e.key === 'Z') {
        if (zoom > 0.5) setZoom((z) => Math.max(0.5, z - 0.1));
      } else if (e.key === 'x' || e.key === 'X') {
        if (zoom < 1.5) setZoom((z) => Math.min(1.5, z + 0.1));
      } else if (e.key === '0') {
        e.preventDefault();
        setZoom(1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [resume, isDirty, zoom]);

  // ========== 保存 / 加载 ==========
  const saveCurrentResume = () => {
    const updatedResumes = [
      ...savedResumes.filter((r) => r.id !== resume.id),
      resume,
    ];
    setSavedResumes(updatedResumes);
    localStorage.setItem(SAVED_LIST_KEY, JSON.stringify(updatedResumes));
    localStorage.removeItem(AUTO_SAVE_KEY);
    setIsDirty(false);
    showToast('简历已保存', 'success');
  };

  const loadResume = (savedResume: ResumeData) => {
    if (isDirty && !confirm('当前简历有未保存的修改，确定要加载其他简历吗？')) return;
    setResume(savedResume);
    setIsDirty(false);
    setShowSaveModal(false);
    setShowTemplateModal(false);
  };

  const createNewResume = () => {
    if (isDirty && !confirm('当前简历有未保存的修改，确定要创建新简历吗？')) return;
    setResume(JSON.parse(JSON.stringify(defaultResume)));
    setIsDirty(false);
    setShowTemplateModal(false);
  };

  const useExampleResume = (example: ResumeData) => {
    if (isDirty && !confirm('当前简历有未保存的修改，确定要使用示例简历吗？')) return;
    const newResume = {
      ...JSON.parse(JSON.stringify(example)),
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setResume(newResume);
    setIsDirty(false);
    setShowTemplateModal(false);
  };

  const updateResume = (updatedResume: ResumeData) => {
    setResume(updatedResume);
    setIsDirty(true);
  };

  // ========== 导入 / 导出 JSON ==========
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.personal.name || '简历'}-备份.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('JSON 已导出', 'info');
  };

  const importJSON = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isDirty && !confirm('当前简历有未保存的修改，确定要导入吗？')) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (!data.personal || !data.experiences) {
          showToast('JSON 格式不正确，缺少必要字段', 'error');
          return;
        }
        setResume({
          ...data,
          id: `user-${Date.now()}`,
          updatedAt: new Date().toISOString(),
        });
        setIsDirty(false);
        showToast('简历已导入', 'success');
      } catch {
        showToast('JSON 解析失败，请检查文件格式', 'error');
      }
    };
    reader.readAsText(file);
    // 重置 input 以便重复导入同一文件
    e.target.value = '';
  };

  // ========== 缩放 ==========
  const zoomIn = () => setZoom((z) => Math.min(1.5, z + 0.1));
  const zoomOut = () => setZoom((z) => Math.max(0.5, z - 0.1));
  const zoomReset = () => setZoom(1);

  // ========== 模块可见性 ==========
  const toggleSection = (key: string) => {
    setVisibleSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ========== PDF ==========
  const downloadPDF = () => {
    if (activeTab === 'edit') {
      setActiveTab('preview');
      setTimeout(() => doDownloadPDF(), 300);
      return;
    }
    doDownloadPDF();
  };

  const doDownloadPDF = () => {
    const element = document.getElementById('resume-preview');
    if (!element) {
      showToast('预览未加载，请稍后重试', 'error');
      return;
    }

    const prevWidth = element.style.width;
    const prevMinWidth = element.style.minWidth;
    const prevTransform = element.style.transform;
    element.style.width = '794px';
    element.style.minWidth = '794px';
    element.style.transform = 'scale(1)';

    requestAnimationFrame(() => {
      const elWidth = element.offsetWidth;
      const elHeight = element.offsetHeight;

      const opt = {
        margin: 0,
        filename: `${resume.personal.name || '简历'}-简历.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          width: elWidth,
          windowWidth: elWidth,
        },
        jsPDF: {
          unit: 'px' as const,
          format: [elWidth, elHeight],
          orientation: 'portrait' as const,
        },
      };

      import('html2pdf.js')
        .then((html2pdf: any) => {
          html2pdf.default().set(opt).from(element).save();
          showToast('PDF 下载中...', 'info');
        })
        .catch(() => {
          showToast('PDF 生成失败，请重试', 'error');
        })
        .finally(() => {
          element.style.width = prevWidth;
          element.style.minWidth = prevMinWidth;
          element.style.transform = prevTransform;
        });
    });
  };

  // ========== 渲染 ==========
  return (
    <div className="app">
      {/* 隐藏的文件导入 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileImport}
      />

      {/* 顶部导航栏 */}
      <header className="app-header">
        <div className="header-content">
          <h1>超级简历</h1>
          <div className="header-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowSaveModal(true)}
            >
              💾 保存
            </button>
            <button className="btn btn-secondary" onClick={importJSON}>
              📥 导入
            </button>
            <button className="btn btn-secondary" onClick={exportJSON}>
              📤 导出
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowTemplateModal(true)}
            >
              模板
            </button>
            <button className="btn btn-primary" onClick={downloadPDF}>
              📄 下载PDF
            </button>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="app-main">
        {/* 工具栏：标签切换 + 缩放 + 可见性 + ATS */}
        <div className="toolbar">
          <div className="tab-switcher">
            <button
              className={`tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
              onClick={() => setActiveTab('edit')}
            >
              编辑简历
            </button>
            <button
              className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              预览简历
            </button>
          </div>

          <div className="toolbar-right">
            {/* 缩放控件 */}
            <div className="zoom-controls">
              <button
                className="btn-icon"
                onClick={zoomOut}
                disabled={zoom <= 0.5}
                title="缩小 (Ctrl+Z)"
              >
                −
              </button>
              <span className="zoom-label" onClick={zoomReset} title="重置 (Ctrl+0)">
                {Math.round(zoom * 100)}%
              </span>
              <button
                className="btn-icon"
                onClick={zoomIn}
                disabled={zoom >= 1.5}
                title="放大 (Ctrl+X)"
              >
                +
              </button>
            </div>

            {/* 模块可见性 */}
            <div className="visibility-toggles">
              {[
                { key: 'summary', label: '简介' },
                { key: 'experience', label: '经历' },
                { key: 'education', label: '教育' },
                { key: 'project', label: '项目' },
                { key: 'skill', label: '技能' },
              ].map(({ key, label }) => (
                <label key={key} className="toggle-label">
                  <input
                    type="checkbox"
                    checked={visibleSections[key]}
                    onChange={() => toggleSection(key)}
                  />
                  {label}
                </label>
              ))}
            </div>

            {/* ATS 模式开关 */}
            <label className="toggle-label ats-toggle">
              <input
                type="checkbox"
                checked={atsMode}
                onChange={(e) => setAtsMode(e.target.checked)}
              />
              ATS
            </label>
          </div>
        </div>

        <div className="split-view">
          {activeTab === 'edit' && (
            <div className="editor-panel">
              <ResumeEditor resume={resume} onUpdate={updateResume} />
            </div>
          )}

          <div className="preview-panel">
            <ResumePreview
              resume={resume}
              zoom={zoom}
              visibleSections={visibleSections}
              atsMode={atsMode}
            />
          </div>
        </div>
      </main>

      {/* 模板选择弹窗 */}
      {showTemplateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowTemplateModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>选择模板</h2>
            <div className="template-grid">
              <div className="template-card" onClick={createNewResume}>
                <h3>空白简历</h3>
                <p>从头开始创建一份全新的简历</p>
              </div>
              {exampleResumes.map((example) => (
                <div
                  key={example.id}
                  className="template-card"
                  onClick={() => useExampleResume(example)}
                >
                  <h3>
                    {example.personal.name} - {example.personal.title}
                  </h3>
                  <p>{example.personal.summary.substring(0, 50)}...</p>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowTemplateModal(false)}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 保存弹窗 */}
      {showSaveModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowSaveModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>保存简历</h2>
            <div className="saved-list">
              {savedResumes.map((saved) => (
                <div key={saved.id} className="saved-item">
                  <div className="saved-info">
                    <h4>{saved.personal.name}</h4>
                    <p>{saved.personal.title}</p>
                    <span className="saved-date">
                      {new Date(saved.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="saved-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => loadResume(saved)}
                    >
                      加载
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        const updated = savedResumes.filter(
                          (r) => r.id !== saved.id
                        );
                        setSavedResumes(updated);
                        localStorage.setItem(
                          SAVED_LIST_KEY,
                          JSON.stringify(updated)
                        );
                      }}
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowSaveModal(false)}
              >
                关闭
              </button>
              <button className="btn btn-primary" onClick={saveCurrentResume}>
                保存当前简历
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast 通知 */}
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
