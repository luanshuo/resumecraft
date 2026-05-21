import { useState } from 'react';
import { ResumeData, Experience, Education, Project, Skill } from '../types/resume';

interface ResumeEditorProps {
  resume: ResumeData;
  onUpdate: (resume: ResumeData) => void;
}

// 可折叠区域组件
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
        <h3>
          <span className="section-icon">{icon}</span>
          {title}
        </h3>
        <span className={`expand-icon ${open ? 'open' : ''}`}>▼</span>
      </div>
      {open && <div className="section-body">{children}</div>}
    </div>
  );
};

// 生成简单 ID
const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

const ResumeEditor: React.FC<ResumeEditorProps> = ({ resume, onUpdate }) => {
  const update = (updatedFields: Partial<ResumeData>) => {
    onUpdate({
      ...resume,
      ...updatedFields,
      updatedAt: new Date().toISOString(),
    });
  };

  const updatePersonal = (field: string, value: string) => {
    update({
      personal: { ...resume.personal, [field]: value },
    });
  };

  // ========== 工作经历 ==========
  const addExperience = () => {
    const newExp: Experience = {
      id: genId(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
    };
    update({ experiences: [...resume.experiences, newExp] });
  };

  const updateExperience = (id: string, field: string, value: any) => {
    update({
      experiences: resume.experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeExperience = (id: string) => {
    update({ experiences: resume.experiences.filter(e => e.id !== id) });
  };

  const addAchievement = (expId: string) => {
    update({
      experiences: resume.experiences.map(exp =>
        exp.id === expId
          ? { ...exp, achievements: [...exp.achievements, ''] }
          : exp
      ),
    });
  };

  const updateAchievement = (expId: string, idx: number, value: string) => {
    update({
      experiences: resume.experiences.map(exp => {
        if (exp.id !== expId) return exp;
        const achievements = [...exp.achievements];
        achievements[idx] = value;
        return { ...exp, achievements };
      }),
    });
  };

  const removeAchievement = (expId: string, idx: number) => {
    update({
      experiences: resume.experiences.map(exp => {
        if (exp.id !== expId) return exp;
        return { ...exp, achievements: exp.achievements.filter((_, i) => i !== idx) };
      }),
    });
  };

  // ========== 教育背景 ==========
  const addEducation = () => {
    const newEdu: Education = {
      id: genId(),
      school: '',
      degree: '',
      major: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: '',
    };
    update({ education: [...resume.education, newEdu] });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    update({
      education: resume.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const removeEducation = (id: string) => {
    update({ education: resume.education.filter(e => e.id !== id) });
  };

  // ========== 项目经历 ==========
  const addProject = () => {
    const newProj: Project = {
      id: genId(),
      name: '',
      role: '',
      startDate: '',
      endDate: '',
      url: '',
      description: '',
      technologies: [],
      achievements: [],
    };
    update({ projects: [...resume.projects, newProj] });
  };

  const updateProject = (id: string, field: string, value: any) => {
    update({
      projects: resume.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    });
  };

  const removeProject = (id: string) => {
    update({ projects: resume.projects.filter(p => p.id !== id) });
  };

  const addProjectAchievement = (projId: string) => {
    update({
      projects: resume.projects.map(proj =>
        proj.id === projId
          ? { ...proj, achievements: [...proj.achievements, ''] }
          : proj
      ),
    });
  };

  const updateProjectAchievement = (projId: string, idx: number, value: string) => {
    update({
      projects: resume.projects.map(proj => {
        if (proj.id !== projId) return proj;
        const achievements = [...proj.achievements];
        achievements[idx] = value;
        return { ...proj, achievements };
      }),
    });
  };

  const removeProjectAchievement = (projId: string, idx: number) => {
    update({
      projects: resume.projects.map(proj => {
        if (proj.id !== projId) return proj;
        return { ...proj, achievements: proj.achievements.filter((_, i) => i !== idx) };
      }),
    });
  };

  // Tech stack tags input
  const [techInput, setTechInput] = useState<Record<string, string>>({});

  const addTech = (projId: string) => {
    const val = (techInput[projId] || '').trim();
    if (!val) return;
    updateProject(projId, 'technologies', [
      ...(resume.projects.find(p => p.id === projId)?.technologies || []),
      val,
    ]);
    setTechInput({ ...techInput, [projId]: '' });
  };

  const removeTech = (projId: string, idx: number) => {
    const proj = resume.projects.find(p => p.id === projId);
    if (!proj) return;
    updateProject(
      projId,
      'technologies',
      proj.technologies.filter((_, i) => i !== idx)
    );
  };

  // ========== 技能 ==========
  const addSkill = () => {
    const newSkill: Skill = {
      id: genId(),
      name: '',
      level: 3,
      category: '',
    };
    update({ skills: [...resume.skills, newSkill] });
  };

  const updateSkill = (id: string, field: string, value: any) => {
    update({
      skills: resume.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    });
  };

  const removeSkill = (id: string) => {
    update({ skills: resume.skills.filter(s => s.id !== id) });
  };

  return (
    <div className="resume-editor">
      {/* ===== 个人信息 ===== */}
      <CollapsibleSection title="个人信息" icon="👤">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">姓名</label>
            <input
              className="form-input"
              value={resume.personal.name}
              onChange={e => updatePersonal('name', e.target.value)}
              placeholder="例如：张三"
            />
          </div>
          <div className="form-group">
            <label className="form-label">职位</label>
            <input
              className="form-input"
              value={resume.personal.title}
              onChange={e => updatePersonal('title', e.target.value)}
              placeholder="例如：高级软件工程师"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">手机</label>
            <input
              className="form-input"
              value={resume.personal.phone}
              onChange={e => updatePersonal('phone', e.target.value)}
              placeholder="138-0000-0000"
            />
          </div>
          <div className="form-group">
            <label className="form-label">邮箱</label>
            <input
              className="form-input"
              value={resume.personal.email}
              onChange={e => updatePersonal('email', e.target.value)}
              placeholder="zhangsan@example.com"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">城市</label>
            <input
              className="form-input"
              value={resume.personal.location}
              onChange={e => updatePersonal('location', e.target.value)}
              placeholder="上海"
            />
          </div>
          <div className="form-group">
            <label className="form-label">GitHub (选填)</label>
            <input
              className="form-input"
              value={resume.personal.github || ''}
              onChange={e => updatePersonal('github', e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">LinkedIn (选填)</label>
            <input
              className="form-input"
              value={resume.personal.linkedin || ''}
              onChange={e => updatePersonal('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div className="form-group">
            <label className="form-label">个人网站 (选填)</label>
            <input
              className="form-input"
              value={resume.personal.website || ''}
              onChange={e => updatePersonal('website', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">个人简介</label>
          <textarea
            className="form-textarea"
            value={resume.personal.summary}
            onChange={e => updatePersonal('summary', e.target.value)}
            placeholder="简要描述你的职业背景和核心优势..."
            rows={4}
          />
        </div>
      </CollapsibleSection>

      {/* ===== 工作经历 ===== */}
      <CollapsibleSection title="工作经历" icon="💼">
        {resume.experiences.map((exp, expIdx) => (
          <div key={exp.id} className="section-item">
            <div className="section-item-header">
              <span className="item-title">
                {exp.company || `工作经历 #${expIdx + 1}`}
              </span>
              <div className="section-item-actions">
                <button
                  className="btn-icon danger"
                  onClick={() => removeExperience(exp.id)}
                  title="删除"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">公司</label>
                <input
                  className="form-input"
                  value={exp.company}
                  onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder="公司名称"
                />
              </div>
              <div className="form-group">
                <label className="form-label">职位</label>
                <input
                  className="form-input"
                  value={exp.position}
                  onChange={e => updateExperience(exp.id, 'position', e.target.value)}
                  placeholder="职位名称"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">开始时间</label>
                <input
                  className="form-input"
                  value={exp.startDate}
                  onChange={e => updateExperience(exp.id, 'startDate', e.target.value)}
                  placeholder="2021-03"
                />
              </div>
              <div className="form-group">
                <label className="form-label">结束时间</label>
                <input
                  className="form-input"
                  value={exp.endDate}
                  onChange={e => updateExperience(exp.id, 'endDate', e.target.value)}
                  placeholder="至今 (留空表示至今)"
                  disabled={exp.current}
                />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={e => updateExperience(exp.id, 'current', e.target.checked)}
                />
                至今任职
              </label>
            </div>
            <div className="form-group">
              <label className="form-label">工作描述</label>
              <textarea
                className="form-textarea"
                value={exp.description}
                onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                placeholder="简要描述工作内容..."
                rows={2}
              />
            </div>
            <div className="form-group">
              <label className="form-label">工作成果</label>
              <ul className="achievement-list">
                {exp.achievements.map((ach, idx) => (
                  <li key={idx} className="achievement-item">
                    <input
                      className="form-input"
                      value={ach}
                      onChange={e => updateAchievement(exp.id, idx, e.target.value)}
                      placeholder={`成果 #${idx + 1}`}
                    />
                    <button
                      className="btn-icon danger"
                      onClick={() => removeAchievement(exp.id, idx)}
                      title="删除"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <button className="add-btn" onClick={() => addAchievement(exp.id)}>
                + 添加工作成果
              </button>
            </div>
          </div>
        ))}
        <button className="add-btn" onClick={addExperience}>
          + 添加工作经历
        </button>
      </CollapsibleSection>

      {/* ===== 教育背景 ===== */}
      <CollapsibleSection title="教育背景" icon="🎓">
        {resume.education.map((edu, idx) => (
          <div key={edu.id} className="section-item">
            <div className="section-item-header">
              <span className="item-title">
                {edu.school || `教育经历 #${idx + 1}`}
              </span>
              <div className="section-item-actions">
                <button
                  className="btn-icon danger"
                  onClick={() => removeEducation(edu.id)}
                  title="删除"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">学校</label>
                <input
                  className="form-input"
                  value={edu.school}
                  onChange={e => updateEducation(edu.id, 'school', e.target.value)}
                  placeholder="学校名称"
                />
              </div>
              <div className="form-group">
                <label className="form-label">学历</label>
                <select
                  className="form-select"
                  value={edu.degree}
                  onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                >
                  <option value="">选择学历</option>
                  <option value="博士">博士</option>
                  <option value="硕士">硕士</option>
                  <option value="学士">学士</option>
                  <option value="大专">大专</option>
                  <option value="高中">高中</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">专业</label>
              <input
                className="form-input"
                value={edu.major}
                onChange={e => updateEducation(edu.id, 'major', e.target.value)}
                placeholder="计算机科学与技术"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">开始时间</label>
                <input
                  className="form-input"
                  value={edu.startDate}
                  onChange={e => updateEducation(edu.id, 'startDate', e.target.value)}
                  placeholder="2016-09"
                />
              </div>
              <div className="form-group">
                <label className="form-label">结束时间</label>
                <input
                  className="form-input"
                  value={edu.endDate}
                  onChange={e => updateEducation(edu.id, 'endDate', e.target.value)}
                  placeholder="2020-06"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ maxWidth: 120 }}>
                <label className="form-label">GPA (选填)</label>
                <input
                  className="form-input"
                  value={edu.gpa || ''}
                  onChange={e => updateEducation(edu.id, 'gpa', e.target.value)}
                  placeholder="3.8/4.0"
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">补充描述</label>
                <input
                  className="form-input"
                  value={edu.description}
                  onChange={e => updateEducation(edu.id, 'description', e.target.value)}
                  placeholder="研究方向、主修课程等"
                />
              </div>
            </div>
          </div>
        ))}
        <button className="add-btn" onClick={addEducation}>
          + 添加教育经历
        </button>
      </CollapsibleSection>

      {/* ===== 项目经历 ===== */}
      <CollapsibleSection title="项目经历" icon="🚀" defaultOpen={false}>
        {resume.projects.map((proj, idx) => (
          <div key={proj.id} className="section-item">
            <div className="section-item-header">
              <span className="item-title">
                {proj.name || `项目 #${idx + 1}`}
              </span>
              <div className="section-item-actions">
                <button
                  className="btn-icon danger"
                  onClick={() => removeProject(proj.id)}
                  title="删除"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">项目名称</label>
                <input
                  className="form-input"
                  value={proj.name}
                  onChange={e => updateProject(proj.id, 'name', e.target.value)}
                  placeholder="项目名称"
                />
              </div>
              <div className="form-group">
                <label className="form-label">角色</label>
                <input
                  className="form-input"
                  value={proj.role}
                  onChange={e => updateProject(proj.id, 'role', e.target.value)}
                  placeholder="技术负责人"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">开始时间</label>
                <input
                  className="form-input"
                  value={proj.startDate}
                  onChange={e => updateProject(proj.id, 'startDate', e.target.value)}
                  placeholder="2022-01"
                />
              </div>
              <div className="form-group">
                <label className="form-label">结束时间</label>
                <input
                  className="form-input"
                  value={proj.endDate}
                  onChange={e => updateProject(proj.id, 'endDate', e.target.value)}
                  placeholder="2022-12"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">项目链接 (选填)</label>
              <input
                className="form-input"
                value={proj.url || ''}
                onChange={e => updateProject(proj.id, 'url', e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">项目描述</label>
              <textarea
                className="form-textarea"
                value={proj.description}
                onChange={e => updateProject(proj.id, 'description', e.target.value)}
                placeholder="简要描述项目内容..."
                rows={2}
              />
            </div>
            <div className="form-group">
              <label className="form-label">技术栈</label>
              <div className="tags-input">
                {proj.technologies.map((tech, tIdx) => (
                  <span key={tIdx} className="tag">
                    {tech}
                    <span
                      className="tag-remove"
                      onClick={() => removeTech(proj.id, tIdx)}
                    >
                      ×
                    </span>
                  </span>
                ))}
                <input
                  className="tag-input-inner"
                  value={techInput[proj.id] || ''}
                  onChange={e =>
                    setTechInput({ ...techInput, [proj.id]: e.target.value })
                  }
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTech(proj.id);
                    }
                  }}
                  placeholder="输入技术栈，回车添加"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">项目成果</label>
              <ul className="achievement-list">
                {proj.achievements.map((ach, aIdx) => (
                  <li key={aIdx} className="achievement-item">
                    <input
                      className="form-input"
                      value={ach}
                      onChange={e =>
                        updateProjectAchievement(proj.id, aIdx, e.target.value)
                      }
                      placeholder={`成果 #${aIdx + 1}`}
                    />
                    <button
                      className="btn-icon danger"
                      onClick={() => removeProjectAchievement(proj.id, aIdx)}
                      title="删除"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <button className="add-btn" onClick={() => addProjectAchievement(proj.id)}>
                + 添加项目成果
              </button>
            </div>
          </div>
        ))}
        <button className="add-btn" onClick={addProject}>
          + 添加项目经历
        </button>
      </CollapsibleSection>

      {/* ===== 技能 ===== */}
      <CollapsibleSection title="技能" icon="⚡" defaultOpen={false}>
        {resume.skills.map((skill) => (
          <div key={skill.id} className="skill-item">
            <div style={{ flex: 1 }}>
              <input
                className="form-input"
                value={skill.name}
                onChange={e => updateSkill(skill.id, 'name', e.target.value)}
                placeholder="技能名称"
              />
            </div>
            <div style={{ width: 120 }}>
              <select
                className="form-select"
                value={skill.level}
                onChange={e => updateSkill(skill.id, 'level', Number(e.target.value))}
              >
                <option value={1}>入门</option>
                <option value={2}>了解</option>
                <option value={3}>熟练</option>
                <option value={4}>精通</option>
                <option value={5}>专家</option>
              </select>
            </div>
            <div style={{ width: 100 }}>
              <input
                className="form-input"
                value={skill.category}
                onChange={e => updateSkill(skill.id, 'category', e.target.value)}
                placeholder="分类"
              />
            </div>
            <button
              className="btn-icon danger"
              onClick={() => removeSkill(skill.id)}
              title="删除"
            >
              ✕
            </button>
          </div>
        ))}
        <button className="add-btn" onClick={addSkill}>
          + 添加技能
        </button>
      </CollapsibleSection>
    </div>
  );
};

export default ResumeEditor;
