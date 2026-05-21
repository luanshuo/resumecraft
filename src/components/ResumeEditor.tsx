import { useState } from 'react';
import { ResumeData, Experience, Education, Project, Skill } from '../types/resume';
import type { TranslationDict } from '../i18n';

interface ResumeEditorProps {
  resume: ResumeData;
  onUpdate: (resume: ResumeData) => void;
  t: TranslationDict;
}

const CollapsibleSection: React.FC<{
  title: string;
  icon: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, icon, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="editor-section">
      <div className="section-header" onClick={() => setOpen(!open)}>
        <h3><span className="section-icon">{icon}</span>{title}</h3>
        <span className={`expand-icon ${open ? 'open' : ''}`}>▼</span>
      </div>
      {open && <div className="section-body">{children}</div>}
    </div>
  );
};

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

const ResumeEditor: React.FC<ResumeEditorProps> = ({ resume, onUpdate, t }) => {
  const update = (fields: Partial<ResumeData>) => {
    onUpdate({ ...resume, ...fields, updatedAt: new Date().toISOString() });
  };
  const upPersonal = (field: string, value: string) => update({ personal: { ...resume.personal, [field]: value } });

  /* experience */
  const addExp = () => {
    const e: Experience = { id: genId(), company: '', position: '', startDate: '', endDate: '', current: false, description: '', achievements: [] };
    update({ experiences: [...resume.experiences, e] });
  };
  const upExp = (id: string, field: string, value: any) =>
    update({ experiences: resume.experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e)) });
  const rmExp = (id: string) => update({ experiences: resume.experiences.filter((e) => e.id !== id) });
  const addAch = (expId: string) =>
    update({ experiences: resume.experiences.map((e) => (e.id === expId ? { ...e, achievements: [...e.achievements, ''] } : e)) });
  const upAch = (expId: string, idx: number, v: string) =>
    update({ experiences: resume.experiences.map((e) => { if (e.id !== expId) return e; const a = [...e.achievements]; a[idx] = v; return { ...e, achievements: a }; }) });
  const rmAch = (expId: string, idx: number) =>
    update({ experiences: resume.experiences.map((e) => (e.id !== expId ? e : { ...e, achievements: e.achievements.filter((_, i) => i !== idx) })) });

  /* education */
  const addEdu = () => {
    const e: Education = { id: genId(), school: '', degree: '', major: '', startDate: '', endDate: '', gpa: '', description: '' };
    update({ education: [...resume.education, e] });
  };
  const upEdu = (id: string, field: string, value: string) =>
    update({ education: resume.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)) });
  const rmEdu = (id: string) => update({ education: resume.education.filter((e) => e.id !== id) });

  /* project */
  const [techInput, setTechInput] = useState<Record<string, string>>({});
  const addProj = () => {
    const p: Project = { id: genId(), name: '', role: '', startDate: '', endDate: '', url: '', description: '', technologies: [], achievements: [] };
    update({ projects: [...resume.projects, p] });
  };
  const upProj = (id: string, field: string, value: any) =>
    update({ projects: resume.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)) });
  const rmProj = (id: string) => update({ projects: resume.projects.filter((p) => p.id !== id) });
  const addTech = (pid: string) => {
    const v = (techInput[pid] || '').trim(); if (!v) return;
    upProj(pid, 'technologies', [...(resume.projects.find((p) => p.id === pid)?.technologies || []), v]);
    setTechInput({ ...techInput, [pid]: '' });
  };
  const rmTech = (pid: string, idx: number) => {
    const proj = resume.projects.find((p) => p.id === pid); if (!proj) return;
    upProj(pid, 'technologies', proj.technologies.filter((_, i) => i !== idx));
  };
  const addPach = (pid: string) =>
    update({ projects: resume.projects.map((p) => (p.id === pid ? { ...p, achievements: [...p.achievements, ''] } : p)) });
  const upPach = (pid: string, idx: number, v: string) =>
    update({ projects: resume.projects.map((p) => { if (p.id !== pid) return p; const a = [...p.achievements]; a[idx] = v; return { ...p, achievements: a }; }) });
  const rmPach = (pid: string, idx: number) =>
    update({ projects: resume.projects.map((p) => (p.id !== pid ? p : { ...p, achievements: p.achievements.filter((_, i) => i !== idx) })) });

  /* skill */
  const addSkill = () => {
    const s: Skill = { id: genId(), name: '', level: 3, category: '' };
    update({ skills: [...resume.skills, s] });
  };
  const upSkill = (id: string, field: string, value: any) =>
    update({ skills: resume.skills.map((s) => (s.id === id ? { ...s, [field]: value } : s)) });
  const rmSkill = (id: string) => update({ skills: resume.skills.filter((s) => s.id !== id) });

  /* ---- render ---- */
  return (
    <div className="resume-editor">
      {/* Personal */}
      <CollapsibleSection title={t.secPersonal} icon="👤">
        <div className="form-row">
          <div className="form-group"><label className="form-label">{t.fieldName}</label><input className="form-input" value={resume.personal.name} onChange={(e) => upPersonal('name', e.target.value)} placeholder={t.phName} /></div>
          <div className="form-group"><label className="form-label">{t.fieldTitle}</label><input className="form-input" value={resume.personal.title} onChange={(e) => upPersonal('title', e.target.value)} placeholder={t.phTitle} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">{t.fieldPhone}</label><input className="form-input" value={resume.personal.phone} onChange={(e) => upPersonal('phone', e.target.value)} placeholder={t.phPhone} /></div>
          <div className="form-group"><label className="form-label">{t.fieldEmail}</label><input className="form-input" value={resume.personal.email} onChange={(e) => upPersonal('email', e.target.value)} placeholder={t.phEmail} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">{t.fieldLocation}</label><input className="form-input" value={resume.personal.location} onChange={(e) => upPersonal('location', e.target.value)} placeholder={t.phLocation} /></div>
          <div className="form-group"><label className="form-label">{t.fieldGithub}</label><input className="form-input" value={resume.personal.github || ''} onChange={(e) => upPersonal('github', e.target.value)} placeholder={t.phGithub} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">{t.fieldLinkedin}</label><input className="form-input" value={resume.personal.linkedin || ''} onChange={(e) => upPersonal('linkedin', e.target.value)} placeholder={t.phLinkedin} /></div>
          <div className="form-group"><label className="form-label">{t.fieldWebsite}</label><input className="form-input" value={resume.personal.website || ''} onChange={(e) => upPersonal('website', e.target.value)} placeholder={t.phWebsite} /></div>
        </div>
        <div className="form-group"><label className="form-label">{t.fieldSummary}</label><textarea className="form-textarea" value={resume.personal.summary} onChange={(e) => upPersonal('summary', e.target.value)} placeholder={t.phSummary} rows={4} /></div>
      </CollapsibleSection>

      {/* Experience */}
      <CollapsibleSection title={t.secExperience} icon="💼">
        {resume.experiences.map((exp, i) => (
          <div key={exp.id} className="section-item">
            <div className="section-item-header">
              <span className="item-title">{exp.company || `${t.lblWorkExpN}${i + 1}`}</span>
              <div className="section-item-actions"><button className="btn-icon danger" onClick={() => rmExp(exp.id)} title="✕">✕</button></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">{t.fieldCompany}</label><input className="form-input" value={exp.company} onChange={(e) => upExp(exp.id, 'company', e.target.value)} placeholder={t.phCompany} /></div>
              <div className="form-group"><label className="form-label">{t.fieldPosition}</label><input className="form-input" value={exp.position} onChange={(e) => upExp(exp.id, 'position', e.target.value)} placeholder={t.phPosition} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">{t.fieldStartDate}</label><input className="form-input" value={exp.startDate} onChange={(e) => upExp(exp.id, 'startDate', e.target.value)} placeholder={t.phStartDate} /></div>
              <div className="form-group"><label className="form-label">{t.fieldEndDate}</label><input className="form-input" value={exp.endDate} onChange={(e) => upExp(exp.id, 'endDate', e.target.value)} placeholder={t.phEndDate} disabled={exp.current} /></div>
            </div>
            <div className="form-group" style={{ marginBottom: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
                <input type="checkbox" checked={exp.current} onChange={(e) => upExp(exp.id, 'current', e.target.checked)} />
                {t.fieldCurrent}
              </label>
            </div>
            <div className="form-group"><label className="form-label">{t.fieldDescription}</label><textarea className="form-textarea" value={exp.description} onChange={(e) => upExp(exp.id, 'description', e.target.value)} placeholder={t.phDescription} rows={2} /></div>
            <div className="form-group">
              <label className="form-label">{t.fieldAchievements}</label>
              <ul className="achievement-list">
                {exp.achievements.map((a, idx) => (
                  <li key={idx} className="achievement-item">
                    <input className="form-input" value={a} onChange={(e) => upAch(exp.id, idx, e.target.value)} placeholder={`${t.phAchievement}${idx + 1}`} />
                    <button className="btn-icon danger" onClick={() => rmAch(exp.id, idx)} title="✕">✕</button>
                  </li>
                ))}
              </ul>
              <button className="add-btn" onClick={() => addAch(exp.id)}>{t.btnAddAchievement}</button>
            </div>
          </div>
        ))}
        <button className="add-btn" onClick={addExp}>{t.btnAddExperience}</button>
      </CollapsibleSection>

      {/* Education */}
      <CollapsibleSection title={t.secEducation} icon="🎓" defaultOpen={false}>
        {resume.education.map((edu, i) => (
          <div key={edu.id} className="section-item">
            <div className="section-item-header">
              <span className="item-title">{edu.school || `${t.lblEducationN}${i + 1}`}</span>
              <div className="section-item-actions"><button className="btn-icon danger" onClick={() => rmEdu(edu.id)} title="✕">✕</button></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">{t.fieldSchool}</label><input className="form-input" value={edu.school} onChange={(e) => upEdu(edu.id, 'school', e.target.value)} placeholder={t.phSchool} /></div>
              <div className="form-group"><label className="form-label">{t.fieldDegree}</label>
                <select className="form-select" value={edu.degree} onChange={(e) => upEdu(edu.id, 'degree', e.target.value)}>
                  <option value="">{t.optDegree}</option>
                  <option value={t.optDoctor}>{t.optDoctor}</option>
                  <option value={t.optMaster}>{t.optMaster}</option>
                  <option value={t.optBachelor}>{t.optBachelor}</option>
                  <option value={t.optAssociate}>{t.optAssociate}</option>
                  <option value={t.optHighSchool}>{t.optHighSchool}</option>
                </select>
              </div>
            </div>
            <div className="form-group"><label className="form-label">{t.fieldMajor}</label><input className="form-input" value={edu.major} onChange={(e) => upEdu(edu.id, 'major', e.target.value)} placeholder={t.phMajor} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">{t.fieldStartDate}</label><input className="form-input" value={edu.startDate} onChange={(e) => upEdu(edu.id, 'startDate', e.target.value)} placeholder={t.phStartDate} /></div>
              <div className="form-group"><label className="form-label">{t.fieldEndDate}</label><input className="form-input" value={edu.endDate} onChange={(e) => upEdu(edu.id, 'endDate', e.target.value)} placeholder={t.phEndDate} /></div>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ maxWidth: 120 }}><label className="form-label">{t.fieldGpa}</label><input className="form-input" value={edu.gpa || ''} onChange={(e) => upEdu(edu.id, 'gpa', e.target.value)} placeholder={t.phGpa} /></div>
              <div className="form-group" style={{ flex: 1 }}><label className="form-label">{t.fieldEduDesc}</label><input className="form-input" value={edu.description} onChange={(e) => upEdu(edu.id, 'description', e.target.value)} placeholder={t.phEduDesc} /></div>
            </div>
          </div>
        ))}
        <button className="add-btn" onClick={addEdu}>{t.btnAddEducation}</button>
      </CollapsibleSection>

      {/* Projects */}
      <CollapsibleSection title={t.secProject} icon="🚀" defaultOpen={false}>
        {resume.projects.map((proj, i) => (
          <div key={proj.id} className="section-item">
            <div className="section-item-header">
              <span className="item-title">{proj.name || `${t.lblProjectN}${i + 1}`}</span>
              <div className="section-item-actions"><button className="btn-icon danger" onClick={() => rmProj(proj.id)} title="✕">✕</button></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">{t.fieldProjectName}</label><input className="form-input" value={proj.name} onChange={(e) => upProj(proj.id, 'name', e.target.value)} placeholder={t.phProjectName} /></div>
              <div className="form-group"><label className="form-label">{t.fieldRole}</label><input className="form-input" value={proj.role} onChange={(e) => upProj(proj.id, 'role', e.target.value)} placeholder={t.phRole} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">{t.fieldStartDate}</label><input className="form-input" value={proj.startDate} onChange={(e) => upProj(proj.id, 'startDate', e.target.value)} placeholder={t.phStartDate} /></div>
              <div className="form-group"><label className="form-label">{t.fieldEndDate}</label><input className="form-input" value={proj.endDate} onChange={(e) => upProj(proj.id, 'endDate', e.target.value)} placeholder={t.phEndDate} /></div>
            </div>
            <div className="form-group"><label className="form-label">{t.fieldProjectUrl}</label><input className="form-input" value={proj.url || ''} onChange={(e) => upProj(proj.id, 'url', e.target.value)} placeholder={t.phProjectUrl} /></div>
            <div className="form-group"><label className="form-label">{t.fieldDescription}</label><textarea className="form-textarea" value={proj.description} onChange={(e) => upProj(proj.id, 'description', e.target.value)} placeholder={t.phDescription} rows={2} /></div>
            <div className="form-group">
              <label className="form-label">{t.fieldTechStack}</label>
              <div className="tags-input">
                {proj.technologies.map((tech, ti) => (<span key={ti} className="tag">{tech}<span className="tag-remove" onClick={() => rmTech(proj.id, ti)}>×</span></span>))}
                <input className="tag-input-inner" value={techInput[proj.id] || ''} onChange={(e) => setTechInput({ ...techInput, [proj.id]: e.target.value })}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(proj.id); } }}
                  placeholder={t.phTechStack} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t.fieldAchievements}</label>
              <ul className="achievement-list">
                {proj.achievements.map((a, ai) => (
                  <li key={ai} className="achievement-item">
                    <input className="form-input" value={a} onChange={(e) => upPach(proj.id, ai, e.target.value)} placeholder={`${t.phAchievement}${ai + 1}`} />
                    <button className="btn-icon danger" onClick={() => rmPach(proj.id, ai)} title="✕">✕</button>
                  </li>
                ))}
              </ul>
              <button className="add-btn" onClick={() => addPach(proj.id)}>{t.btnAddAchievement}</button>
            </div>
          </div>
        ))}
        <button className="add-btn" onClick={addProj}>{t.btnAddProject}</button>
      </CollapsibleSection>

      {/* Skills */}
      <CollapsibleSection title={t.secSkill} icon="⚡" defaultOpen={false}>
        {resume.skills.map((s) => (
          <div key={s.id} className="skill-item">
            <div style={{ flex: 1 }}><input className="form-input" value={s.name} onChange={(e) => upSkill(s.id, 'name', e.target.value)} placeholder={t.phSkillName} /></div>
            <div style={{ width: 120 }}>
              <select className="form-select" value={s.level} onChange={(e) => upSkill(s.id, 'level', Number(e.target.value))}>
                <option value={1}>{t.lvlBeginner}</option>
                <option value={2}>{t.lvlBasic}</option>
                <option value={3}>{t.lvlProficient}</option>
                <option value={4}>{t.lvlAdvanced}</option>
                <option value={5}>{t.lvlExpert}</option>
              </select>
            </div>
            <div style={{ width: 100 }}><input className="form-input" value={s.category} onChange={(e) => upSkill(s.id, 'category', e.target.value)} placeholder={t.phSkillCategory} /></div>
            <button className="btn-icon danger" onClick={() => rmSkill(s.id)} title="✕">✕</button>
          </div>
        ))}
        <button className="add-btn" onClick={addSkill}>{t.btnAddSkill}</button>
      </CollapsibleSection>
    </div>
  );
};

export default ResumeEditor;
