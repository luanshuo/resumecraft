import { ResumeData } from '../types/resume';
import type { TranslationDict } from '../i18n';

interface ResumePreviewProps {
  resume: ResumeData;
  zoom: number;
  visibleSections: Record<string, boolean>;
  atsMode: boolean;
  t: TranslationDict;
}

const fmtDate = (s: string) => (s ? s.replace(/-/g, '.') : '');

const ResumePreview: React.FC<ResumePreviewProps> = ({ resume, zoom, visibleSections, atsMode, t }) => {
  const { personal, experiences, education, projects, skills } = resume;

  const contacts: string[] = [];
  if (personal.phone) contacts.push(atsMode ? `${t.atsPhone}: ${personal.phone}` : `📱 ${personal.phone}`);
  if (personal.email) contacts.push(atsMode ? `${t.atsEmail}: ${personal.email}` : `📧 ${personal.email}`);
  if (personal.location) contacts.push(atsMode ? `${t.atsLocation}: ${personal.location}` : `📍 ${personal.location}`);
  if (personal.github) contacts.push(atsMode ? `${t.atsGithub}: ${personal.github}` : `🔗 ${personal.github.replace(/^https?:\/\//, '')}`);
  if (personal.website) contacts.push(atsMode ? `${t.atsWebsite}: ${personal.website}` : `🌐 ${personal.website.replace(/^https?:\/\//, '')}`);

  return (
    <div className="resume-preview-wrapper" id="resume-preview" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s ease' }}>
      {/* Name + Title */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h1 className="resume-name" style={{ textAlign: 'center' }}>{personal.name || 'Name'}</h1>
        <div className="resume-title" style={{ textAlign: 'center' }}>{personal.title || 'Title'}</div>
      </div>

      {/* Contact */}
      {contacts.length > 0 && (<div className="resume-contact" style={{ justifyContent: 'center' }}>{contacts.map((c, i) => (<span key={i}>{c}</span>))}</div>)}

      {/* Summary */}
      {personal.summary && visibleSections.summary !== false && (
        <div className="resume-section"><div className="resume-section-title">{t.pvSummary}</div><div className="resume-summary">{personal.summary}</div></div>
      )}

      {/* Experience */}
      {experiences.length > 0 && visibleSections.experience !== false && (
        <div className="resume-section">
          <div className="resume-section-title">{t.pvExperience}</div>
          {experiences.map((e) => (
            <div key={e.id} className="resume-item">
              <div className="resume-item-header">
                <div><span className="resume-item-title">{e.position}{e.company && ` | ${e.company}`}</span></div>
                <span className="resume-item-date">{fmtDate(e.startDate)} - {e.current ? t.pvCurrent : fmtDate(e.endDate)}</span>
              </div>
              {e.description && <div className="resume-item-desc">{e.description}</div>}
              {e.achievements.length > 0 && (<ul className="resume-achievements">{e.achievements.filter((a) => a.trim()).map((a, i) => (<li key={i}>{a}</li>))}</ul>)}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && visibleSections.project !== false && (
        <div className="resume-section">
          <div className="resume-section-title">{t.pvProject}</div>
          {projects.map((p) => (
            <div key={p.id} className="resume-item">
              <div className="resume-item-header">
                <div><span className="resume-item-title">{p.name}{p.role && ` | ${p.role}`}</span></div>
                <span className="resume-item-date">{fmtDate(p.startDate)} - {fmtDate(p.endDate)}</span>
              </div>
              {p.url && <div style={{ fontSize: 12, color: '#4A90D9', marginBottom: 4 }}>{p.url}</div>}
              {p.description && <div className="resume-item-desc">{p.description}</div>}
              {p.technologies.length > 0 && (<div style={{ marginTop: 6 }}>{p.technologies.map((tech, i) => (<span key={i} style={{ display: 'inline-block', padding: '2px 8px', margin: '2px 4px 2px 0', background: '#F0F2F5', borderRadius: 4, fontSize: 12, color: '#555' }}>{tech}</span>))}</div>)}
              {p.achievements.length > 0 && (<ul className="resume-achievements">{p.achievements.filter((a) => a.trim()).map((a, i) => (<li key={i}>{a}</li>))}</ul>)}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && visibleSections.education !== false && (
        <div className="resume-section">
          <div className="resume-section-title">{t.pvEducation}</div>
          {education.map((e) => (
            <div key={e.id} className="resume-item">
              <div className="resume-item-header">
                <div>
                  <span className="resume-item-title">{e.school}{e.major && ` | ${e.major}`}</span>
                  <div className="resume-item-subtitle">{e.degree}{e.gpa && ` · GPA ${e.gpa}`}</div>
                </div>
                <span className="resume-item-date">{fmtDate(e.startDate)} - {fmtDate(e.endDate)}</span>
              </div>
              {e.description && <div className="resume-item-desc">{e.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && visibleSections.skill !== false && (
        <div className="resume-section">
          <div className="resume-section-title">{t.pvSkill}</div>
          <ul className="skills-list">{skills.filter((s) => s.name.trim()).map((s) => (<li key={s.id}>{s.name}{s.category && ` (${s.category})`}</li>))}</ul>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
