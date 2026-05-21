import { ResumeData } from '../types/resume';

interface ResumePreviewProps {
  resume: ResumeData;
  zoom: number;
  visibleSections: Record<string, boolean>;
  atsMode: boolean;
}

// 格式化日期
const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  return dateStr.replace(/-/g, '.');
};

// 至今标识
const formatEndDate = (dateStr: string, current: boolean): string => {
  if (current) return '至今';
  return formatDate(dateStr);
};

const ResumePreview: React.FC<ResumePreviewProps> = ({
  resume,
  zoom,
  visibleSections,
  atsMode,
}) => {
  const { personal, experiences, education, projects, skills } = resume;

  // 联系人信息
  const contacts: string[] = [];
  if (personal.phone) {
    contacts.push(atsMode ? `电话: ${personal.phone}` : `📱 ${personal.phone}`);
  }
  if (personal.email) {
    contacts.push(atsMode ? `邮箱: ${personal.email}` : `📧 ${personal.email}`);
  }
  if (personal.location) {
    contacts.push(atsMode ? `城市: ${personal.location}` : `📍 ${personal.location}`);
  }
  if (personal.github) {
    contacts.push(
      atsMode
        ? `GitHub: ${personal.github}`
        : `🔗 ${personal.github.replace(/^https?:\/\//, '')}`
    );
  }
  if (personal.website) {
    contacts.push(
      atsMode
        ? `网站: ${personal.website}`
        : `🌐 ${personal.website.replace(/^https?:\/\//, '')}`
    );
  }

  return (
    <div
      className="resume-preview-wrapper"
      id="resume-preview"
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: 'top center',
        transition: 'transform 0.2s ease',
      }}
    >
      {/* 头部：姓名 + 职位 */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h1 className="resume-name" style={{ textAlign: 'center' }}>
          {personal.name || '姓名'}
        </h1>
        <div className="resume-title" style={{ textAlign: 'center' }}>
          {personal.title || '职位'}
        </div>
      </div>

      {/* 联系方式 */}
      {contacts.length > 0 && (
        <div className="resume-contact" style={{ justifyContent: 'center' }}>
          {contacts.map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </div>
      )}

      {/* 个人简介 */}
      {personal.summary && visibleSections.summary !== false && (
        <div className="resume-section">
          <div className="resume-section-title">个人简介</div>
          <div className="resume-summary">{personal.summary}</div>
        </div>
      )}

      {/* 工作经历 */}
      {experiences.length > 0 && visibleSections.experience !== false && (
        <div className="resume-section">
          <div className="resume-section-title">工作经历</div>
          {experiences.map((exp) => (
            <div key={exp.id} className="resume-item">
              <div className="resume-item-header">
                <div>
                  <span className="resume-item-title">
                    {exp.position}
                    {exp.company && ` | ${exp.company}`}
                  </span>
                </div>
                <span className="resume-item-date">
                  {formatDate(exp.startDate)} -{' '}
                  {formatEndDate(exp.endDate, exp.current)}
                </span>
              </div>
              {exp.description && (
                <div className="resume-item-desc">{exp.description}</div>
              )}
              {exp.achievements.length > 0 && (
                <ul className="resume-achievements">
                  {exp.achievements
                    .filter((a) => a.trim())
                    .map((ach, i) => (
                      <li key={i}>{ach}</li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 项目经历 */}
      {projects.length > 0 && visibleSections.project !== false && (
        <div className="resume-section">
          <div className="resume-section-title">项目经历</div>
          {projects.map((proj) => (
            <div key={proj.id} className="resume-item">
              <div className="resume-item-header">
                <div>
                  <span className="resume-item-title">
                    {proj.name}
                    {proj.role && ` | ${proj.role}`}
                  </span>
                </div>
                <span className="resume-item-date">
                  {formatDate(proj.startDate)} -{' '}
                  {formatEndDate(proj.endDate, false)}
                </span>
              </div>
              {proj.url && (
                <div style={{ fontSize: 12, color: '#4A90D9', marginBottom: 4 }}>
                  {proj.url}
                </div>
              )}
              {proj.description && (
                <div className="resume-item-desc">{proj.description}</div>
              )}
              {proj.technologies.length > 0 && (
                <div style={{ marginTop: 6 }}>
                  {proj.technologies.map((tech, i) => (
                    <span
                      key={i}
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        margin: '2px 4px 2px 0',
                        background: '#F0F2F5',
                        borderRadius: 4,
                        fontSize: 12,
                        color: '#555',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              {proj.achievements.length > 0 && (
                <ul className="resume-achievements">
                  {proj.achievements
                    .filter((a) => a.trim())
                    .map((ach, i) => (
                      <li key={i}>{ach}</li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 教育背景 */}
      {education.length > 0 && visibleSections.education !== false && (
        <div className="resume-section">
          <div className="resume-section-title">教育背景</div>
          {education.map((edu) => (
            <div key={edu.id} className="resume-item">
              <div className="resume-item-header">
                <div>
                  <span className="resume-item-title">
                    {edu.school}
                    {edu.major && ` | ${edu.major}`}
                  </span>
                  <div className="resume-item-subtitle">
                    {edu.degree}
                    {edu.gpa && ` · GPA ${edu.gpa}`}
                  </div>
                </div>
                <span className="resume-item-date">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
              {edu.description && (
                <div className="resume-item-desc">{edu.description}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 技能 */}
      {skills.length > 0 && visibleSections.skill !== false && (
        <div className="resume-section">
          <div className="resume-section-title">专业技能</div>
          <ul className="skills-list">
            {skills
              .filter((s) => s.name.trim())
              .map((skill) => (
                <li key={skill.id}>
                  {skill.name}
                  {skill.category && ` (${skill.category})`}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
