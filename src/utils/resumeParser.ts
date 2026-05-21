// ========================================
// 启发式简历解析器 — 从 PDF 文本解析结构化数据
// ========================================

import { ResumeData, Experience, Education, Project, Skill } from '../types/resume';

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

// ---------- 区块标题 ----------
const SECTION_MARKERS: { key: string; re: RegExp }[] = [
  { key: 'summary_marker', re: /^(专业技能|技能概述|核心能力|专业能力)/ },
  { key: 'experience', re: /^(工作经历|工作(经验|履历))/ },
  { key: 'education', re: /^(教育(背景|经历))/ },
  { key: 'project', re: /^(项目(经历|经验))/ },
  { key: 'skill', re: /^(技能|专业技能|技术栈)/ },
  { key: 'summary', re: /^(个人总结|自我评价|个人简介)/ },
];

// ---------- 工具函数 ----------
function extractEmail(text: string): string {
  const m = text.match(/[\w.+-]+@[\w-]+\.\w+/);
  return m ? m[0] : '';
}
function extractPhone(text: string): string {
  const m = text.match(/(\+?86[-.\s]?)?1[3-9]\d[-.\s]?\d{4}[-.\s]?\d{4}/);
  return m ? m[0].replace(/\s/g, '') : '';
}
function extractURLs(text: string): { github?: string; linkedin?: string; website?: string } {
  const urls = text.match(/https?:\/\/[^\s,，]+/g) || [];
  const r: any = {};
  for (const u of urls) {
    const clean = u.replace(/[),，;；。.]$/, '');
    if (/github\.com/i.test(clean)) r.github = clean;
    else if (/gitee\.com/i.test(clean)) r.github = r.github || clean;
    else if (/linkedin\.com/i.test(clean)) r.linkedin = clean;
    else if (!r.website) r.website = clean;
  }
  return r;
}
function extractName(text: string): string {
  const lines = text.split('\n');
  for (const line of lines.slice(0, 10)) {
    const t = line.trim();
    if (!t || /[@\d:：]|http|电话|手机|邮箱|Email|Phone|Page/i.test(t)) continue;
    const zh = t.match(/^[\u4e00-\u9fff]{2,4}$/);
    if (zh) return zh[0];
    const en = t.match(/^[A-Z][a-z]+ [A-Z][a-z]+$/);
    if (en) return en[0];
  }
  return '';
}
function extractLocation(text: string): string {
  const cities = ['北京','上海','广州','深圳','杭州','南京','成都','武汉','西安','重庆','苏州','福州','厦门','天津'];
  for (const c of cities) { if (text.includes(c)) return c; }
  return '';
}

// ---------- 日期 ----------
const DATE_RE = /(\d{4})[年.\-/](\d{1,2})[月]?\s*[-–—至到]\s*(\d{4}[年.\-/]\d{1,2}[月]?|至今|现在|Present|Current|Now)/i;
function parseDate(line: string): { start: string; end: string; current: boolean } | null {
  const m = line.match(DATE_RE);
  if (!m) return null;
  const start = `${m[1]}-${m[2].padStart(2, '0')}`;
  const endRaw = m[3];
  const current = /(至今|现在|Present|Current|Now)/i.test(endRaw);
  let end = '';
  if (!current) { const em = endRaw.match(/(\d{4})[年.\-/](\d{1,2})/); if (em) end = `${em[1]}-${em[2].padStart(2, '0')}`; }
  return { start, end, current };
}

// ---------- 区块解析 ----------
function parseSummaryBlock(lines: string[]): string {
  return lines.slice(1).join(' ').replace(/\d+[.、]\s*/g, '').trim();
}

function parseExperienceBlock(lines: string[]): Experience[] {
  const exps: Experience[] = [];
  for (let i = 0; i < lines.length; i++) {
    const date = parseDate(lines[i]);
    if (!date) continue;
    const exp: Experience = { id: genId(), company: '', position: '', startDate: date.start, endDate: date.end, current: date.current, description: '', achievements: [] };

    // 从当前日期行提取公司名（日期前面的文本）
    const dateLine = lines[i];
    const before = dateLine.replace(DATE_RE, '').trim().replace(/\s{2,}/g, ' ');
    if (before && before.length < 50 && !/^\d/.test(before)) exp.company = before;

    // 向前查找
    for (let j = Math.max(0, i - 3); j < i; j++) {
      const p = lines[j].trim();
      if (!p || parseDate(p)) continue;
      if (!exp.company && p.length < 50) exp.company = p;
      else if (exp.company && !exp.position && p.length < 40) exp.position = p;
    }
    // 向后查找职位
    for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
      const n = lines[j].trim();
      if (parseDate(n)) break;
      if (!exp.position && n.length < 40 && !/^[\d•\-\*\s]/.test(n)) exp.position = n;
    }
    // 收集描述和成果
    for (let j = i + 1; j < lines.length; j++) {
      const line = lines[j].trim();
      if (parseDate(line)) break;
      if (!line) continue;
      if (/^\d+[.)、]\s/.test(line) || /^[•\-\*]\s/.test(line)) {
        exp.achievements.push(line.replace(/^[\d+.)、•\-\*\s]+/, ''));
        continue;
      }
      exp.description = exp.description ? exp.description + ' ' + line : line;
    }
    if (exp.company || exp.position) exps.push(exp);
  }
  return exps;
}

function parseEducationBlock(lines: string[]): Education[] {
  const edus: Education[] = [];
  for (let i = 0; i < lines.length; i++) {
    const date = parseDate(lines[i]);
    if (!date) continue;
    const edu: Education = { id: genId(), school: '', degree: '', major: '', startDate: date.start, endDate: date.end, gpa: '', description: '' };
    const before = lines[i].replace(DATE_RE, '').trim().replace(/\s{2,}/g, ' ');
    if (before && before.length < 50) edu.school = before;
    for (let j = Math.max(0, i - 2); j < i; j++) {
      const p = lines[j].trim();
      if (!p || parseDate(p)) continue;
      if (!edu.school && p.length < 50) edu.school = p;
      else if (edu.school && !edu.major && p.length < 40) edu.major = p;
    }
    for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
      const n = lines[j].trim();
      if (parseDate(n)) break;
      const deg = n.match(/(博士|硕士|学士|本科|大专|Ph\.?D|Master|Bachelor)/i);
      if (deg && !edu.degree) { edu.degree = deg[0]; continue; }
      if (!edu.major && n.length < 40) { edu.major = n; continue; }
      if (!edu.description && n.length < 60) edu.description = n;
    }
    if (edu.school) edus.push(edu);
  }
  return edus;
}

function parseProjectBlock(lines: string[]): Project[] {
  const projs: Project[] = [];
  for (let i = 0; i < lines.length; i++) {
    const date = parseDate(lines[i]);
    if (!date) continue;
    const proj: Project = { id: genId(), name: '', role: '', startDate: date.start, endDate: date.end, url: '', description: '', technologies: [], achievements: [] };
    const before = lines[i].replace(DATE_RE, '').trim().replace(/\s{2,}/g, ' ');
    if (before && before.length < 80) proj.name = before;
    for (let j = Math.max(0, i - 5); j < i; j++) {
      const p = lines[j].trim();
      if (!p || parseDate(p)) continue;
      if (!proj.name && !/^[\d•\-\*]/.test(p) && p.length < 80) proj.name = p;
      else if (proj.name && !proj.role && p.length < 40) proj.role = p;
    }
    for (let j = i + 1; j < lines.length; j++) {
      const line = lines[j].trim();
      if (parseDate(line)) break;
      if (!line) continue;
      if (/^https?:\/\//.test(line)) { proj.url = line; continue; }
      const tm = line.match(/^(技术栈|Tech|Technologies?)[:：]\s*(.+)$/i);
      if (tm) { proj.technologies = tm[2].split(/[,，、\s]+/).filter(Boolean); continue; }
      if (/^\d+[.)、]\s/.test(line) || /^[•\-\*]\s/.test(line)) {
        proj.achievements.push(line.replace(/^[\d+.)、•\-\*\s]+/, ''));
        continue;
      }
      proj.description = proj.description ? proj.description + ' ' + line : line;
    }
    if (proj.name) projs.push(proj);
  }
  return projs;
}

function parseSkillsBlock(lines: string[]): Skill[] {
  const allText = lines.join(' ').replace(/^\d+[.、]\s*/gm, '');
  const parts = allText.split(/[,，、;；\s]+/).filter((s) => s.length > 1);
  const skip = new Set(['the','and','or','in','of','to','a','an','is','at','on','with','for']);
  const skills: Skill[] = [];
  for (const p of parts) {
    const clean = p.replace(/[()（）]/g, '').trim();
    if (clean && !skip.has(clean.toLowerCase()) && clean.length < 30) {
      skills.push({ id: genId(), name: clean, level: 3, category: '' });
    }
  }
  return skills.slice(0, 30);
}

// ---------- 主入口 ----------
export function parseResumeFromText(text: string): ResumeData | null {
  text = text.replace(/ {2,}/g, ' ');
  const allLines = text.split('\n').map((l) => l.trim());

  const resume: ResumeData = {
    id: `pdf-import-${Date.now()}`, version: '1.0.0',
    personal: { name: '', title: '', phone: '', email: '', location: '', github: '', linkedin: '', website: '', summary: '' },
    experiences: [], education: [], projects: [], skills: [],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };

  // 全文提取联系方式
  resume.personal.email = extractEmail(text);
  resume.personal.phone = extractPhone(text);
  const urls = extractURLs(text);
  resume.personal.github = urls.github || '';
  resume.personal.linkedin = urls.linkedin || '';
  resume.personal.website = urls.website || '';
  resume.personal.location = extractLocation(text);
  resume.personal.name = extractName(text);

  // 按区块标题拆分
  const sections: { key: string; lines: string[] }[] = [];
  let curKey = 'header', curLines: string[] = [];
  for (const line of allLines) {
    let mk: string | null = null;
    for (const { key, re } of SECTION_MARKERS) { if (re.test(line)) { mk = key; break; } }
    if (mk) { if (curLines.length) sections.push({ key: curKey, lines: curLines }); curKey = mk; curLines = [line]; }
    else curLines.push(line);
  }
  if (curLines.length) sections.push({ key: curKey, lines: curLines });

  // 解析各区块
  let titleFound = false;
  for (const { key, lines } of sections) {
    switch (key) {
      case 'header':
        for (const l of lines) {
          if (!resume.personal.name) resume.personal.name = extractName(l);
          if (resume.personal.name && !titleFound && l !== resume.personal.name && l.length < 40 && !/[@\dhttp]/.test(l)) {
            resume.personal.title = l; titleFound = true;
          }
        }
        break;
      case 'summary_marker': resume.personal.summary = parseSummaryBlock(lines); break;
      case 'experience': resume.experiences = parseExperienceBlock(lines); break;
      case 'education': resume.education = parseEducationBlock(lines); break;
      case 'project': resume.projects = parseProjectBlock(lines); break;
      case 'skill': resume.skills = parseSkillsBlock(lines); break;
      case 'summary': if (!resume.personal.summary) resume.personal.summary = parseSummaryBlock(lines); break;
    }
  }

  // 兜底
  if (!resume.personal.summary) {
    const ss = sections.find((s) => s.key === 'skill' || s.key === 'summary_marker');
    if (ss) resume.personal.summary = parseSummaryBlock(ss.lines);
  }

  return resume;
}
