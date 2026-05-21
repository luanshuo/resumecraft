// ========================================
// 启发式简历解析器 — 从纯文本提取结构化 ResumeData
// ========================================

import { ResumeData, Experience, Education, Project, Skill } from '../types/resume';

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

// 常见简历区块标题（中英文）

const SECTION_PATTERNS: { key: string; re: RegExp }[] = [
  { key: 'summary', re: /(个人简介|自我评价|SUMMARY|PROFILE|PROFESSIONAL\s*SUMMARY)/i },
  { key: 'experience', re: /(工作经历|工作(经验|履历)|WORK\s*EXPERIENCE|EXPERIENCE|EMPLOYMENT)/i },
  { key: 'education', re: /(教育(背景|经历)|EDUCATION|ACADEMIC)/i },
  { key: 'project', re: /(项目(经历|经验)|PROJECTS|PROJECT\s*EXPERIENCE)/i },
  { key: 'skill', re: /(技能|专业(技能|能力)|SKILLS|TECHNICAL\s*SKILLS|技術)/i },
];

// 日期模式
const DATE_RANGE_RE = /(\d{4}[.\-/年]\d{1,2}[月]?)\s*[-–—至到]\s*(\d{4}[.\-/年]\d{1,2}[月]?|至今|现在|Present|Current|Now)/i;

function isSectionHeader(line: string): string | null {
  for (const { key, re } of SECTION_PATTERNS) {
    if (re.test(line)) return key;
  }
  return null;
}

function extractName(lines: string[]): string {
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (!line) continue;
    // 跳过明显不是姓名的行（含数字、邮箱、@、http、电话关键词）
    if (/[\d@]|http|电话|手机|邮箱|Email|Phone/i.test(line)) continue;
    // 中文姓名：2-4 个汉字
    const zhName = line.match(/^[\u4e00-\u9fff]{2,4}$/);
    if (zhName) return zhName[0];
    // 英文姓名：2 个单词，首字母大写
    const enName = line.match(/^[A-Z][a-z]+ [A-Z][a-z]+$/);
    if (enName) return enName[0];
    // 中文名+英文名混合
    if (/^[\u4e00-\u9fffA-Za-z\s·.]+$/.test(line) && line.length < 30) return line;
  }
  return '';
}

function extractEmail(text: string): string {
  const m = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  return m ? m[0] : '';
}

function extractPhone(text: string): string {
  // 中国手机号
  const m = text.match(/(\+?86[-.\s]?)?1[3-9]\d[-.\s]?\d{4}[-.\s]?\d{4}/);
  if (m) return m[0];
  // 国际格式
  const m2 = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return m2 ? m2[0] : '';
}

function extractURLs(text: string): { github?: string; linkedin?: string; website?: string } {
  const urls = text.match(/https?:\/\/[^\s,，]+/g) || [];
  const result: { github?: string; linkedin?: string; website?: string } = {};
  for (const u of urls) {
    const clean = u.replace(/[),，;；。.]$/, '');
    if (/github\.com/i.test(clean)) result.github = clean;
    else if (/linkedin\.com/i.test(clean)) result.linkedin = clean;
    else if (!result.website) result.website = clean;
  }
  return result;
}

function extractLocation(text: string): string {
  // 简单提取城市名
  const cities = [
    '北京', '上海', '广州', '深圳', '杭州', '南京', '成都', '武汉', '西安', '重庆',
    'San Francisco', 'New York', 'Seattle', 'London', 'Tokyo', 'Singapore',
    'Beijing', 'Shanghai', 'Shenzhen', 'Hangzhou',
  ];
  for (const c of cities) {
    if (text.includes(c)) return c;
  }
  return '';
}

function parseDateRange(text: string): { start: string; end: string; current: boolean } | null {
  const m = text.match(DATE_RANGE_RE);
  if (!m) return null;
  const start = m[1].replace(/[年月]/g, '-').replace(/[.\-/]$/, '');
  const endRaw = m[2];
  const current = /(至今|现在|Present|Current|Now)/i.test(endRaw);
  const end = current ? '' : endRaw.replace(/[年月]/g, '-').replace(/[.\-/]$/, '');
  return { start, end, current };
}

function parseExperienceBlock(lines: string[]): Experience[] {
  const experiences: Experience[] = [];
  let current: Experience | null = null;

  for (const line of lines) {
    const dateRange = parseDateRange(line);
    if (dateRange) {
      // 新条目开始
      if (current) experiences.push(current);
      current = {
        id: genId(),
        company: '',
        position: '',
        startDate: dateRange.start,
        endDate: dateRange.end,
        current: dateRange.current,
        description: '',
        achievements: [],
      };
      continue;
    }

    if (!current) {
      // 还没有找到日期范围，尝试从文本中提取公司和职位
      const trimmed = line.trim();
      if (!trimmed) continue;
      // 尝试匹配 "公司 | 职位" 或 "Position at Company" 格式
      const pipeMatch = trimmed.match(/^(.+?)\s*\|\s*(.+)$/);
      if (pipeMatch) {
        current = {
          id: genId(), company: pipeMatch[1], position: pipeMatch[2],
          startDate: '', endDate: '', current: false, description: '', achievements: [],
        };
      } else if (trimmed.length < 80 && !/^[•\-\*]/.test(trimmed)) {
        current = {
          id: genId(), company: '', position: trimmed,
          startDate: '', endDate: '', current: false, description: '', achievements: [],
        };
      }
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) continue;

    // 检测 achievement（以 • - * 开头）
    if (/^[•\-\*]\s/.test(trimmed) || /^\d+[.)]\s/.test(trimmed)) {
      current.achievements.push(trimmed.replace(/^[•\-\*\d+.)\s]+/, ''));
      continue;
    }

    // 如果还没有公司名，尝试从中提取
    if (!current.company && !current.description) {
      const pipeMatch = trimmed.match(/^(.+?)\s*\|\s*(.+)$/);
      if (pipeMatch) {
        current.company = pipeMatch[1];
        current.position = pipeMatch[2];
        continue;
      }
      // 也尝试匹配 "职位, 公司" 或 "职位 at 公司"
      const atMatch = trimmed.match(/^(.+?)[,，]\s*(.+)$/);
      if (atMatch && !DATE_RANGE_RE.test(trimmed)) {
        current.position = atMatch[1];
        current.company = atMatch[2];
        continue;
      }
    }

    // 否则视为描述
    if (current.description) {
      current.description += ' ' + trimmed;
    } else {
      current.description = trimmed;
    }
  }

  if (current) experiences.push(current);
  return experiences;
}

function parseEducationBlock(lines: string[]): Education[] {
  const education: Education[] = [];
  let current: Education | null = null;

  for (const line of lines) {
    const dateRange = parseDateRange(line);
    if (dateRange) {
      if (current) education.push(current);
      current = {
        id: genId(), school: '', degree: '', major: '',
        startDate: dateRange.start, endDate: dateRange.end, gpa: '', description: '',
      };
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) continue;

    if (!current) {
      current = {
        id: genId(), school: trimmed, degree: '', major: '',
        startDate: '', endDate: '', gpa: '', description: '',
      };
      continue;
    }

    // GPA
    const gpaMatch = trimmed.match(/GPA[:\s]*([\d.]+(\/[\d.]+)?)/i);
    if (gpaMatch) { current.gpa = gpaMatch[1]; continue; }

    // 学位
    const degreeMatch = trimmed.match(/(博士|硕士|学士|本科|大专|Ph\.?D|Master|Bachelor|B\.?S\.?|M\.?S\.?|MBA)/i);
    if (degreeMatch) { current.degree = degreeMatch[0]; continue; }

    // 专业
    if (!current.major && trimmed.length < 50) {
      current.major = trimmed;
      continue;
    }

    if (current.description) {
      current.description += ' ' + trimmed;
    } else {
      current.description = trimmed;
    }
  }

  if (current) education.push(current);
  return education;
}

function parseProjectBlock(lines: string[]): Project[] {
  const projects: Project[] = [];
  let current: Project | null = null;

  for (const line of lines) {
    const dateRange = parseDateRange(line);
    if (dateRange) {
      if (current) projects.push(current);
      current = {
        id: genId(), name: '', role: '',
        startDate: dateRange.start, endDate: dateRange.end,
        url: '', description: '', technologies: [], achievements: [],
      };
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) continue;

    if (!current) {
      const pipeMatch = trimmed.match(/^(.+?)\s*\|\s*(.+)$/);
      if (pipeMatch) {
        current = {
          id: genId(), name: pipeMatch[1], role: pipeMatch[2],
          startDate: '', endDate: '', url: '', description: '', technologies: [], achievements: [],
        };
      } else {
        current = {
          id: genId(), name: trimmed, role: '',
          startDate: '', endDate: '', url: '', description: '', technologies: [], achievements: [],
        };
      }
      continue;
    }

    // URL
    if (/^https?:\/\//.test(trimmed)) { current.url = trimmed; continue; }

    // 技术栈
    const techMatch = trimmed.match(/^(技术栈|Tech|Technologies?)[:：]\s*(.+)$/i);
    if (techMatch) {
      current.technologies = techMatch[2].split(/[,，、\s]+/).filter(Boolean);
      continue;
    }

    // achievement
    if (/^[•\-\*]\s/.test(trimmed) || /^\d+[.)]\s/.test(trimmed)) {
      current.achievements.push(trimmed.replace(/^[•\-\*\d+.)\s]+/, ''));
      continue;
    }

    if (current.description) {
      current.description += ' ' + trimmed;
    } else {
      current.description = trimmed;
    }
  }

  if (current) projects.push(current);
  return projects;
}

function parseSkillsBlock(lines: string[]): Skill[] {
  const skills: Skill[] = [];
  const allText = lines.join(' ');

  // 按常见分隔符拆分
  const parts = allText.split(/[,，、;；\s]+/).filter((s) => s.length > 1);

  // 去除明显的非技能词
  const skipWords = new Set(['the', 'and', 'or', 'in', 'of', 'to', 'a', 'an', 'is', 'at', 'on']);
  for (const part of parts) {
    const clean = part.replace(/[()（）]/g, '').trim();
    if (clean && !skipWords.has(clean.toLowerCase()) && clean.length < 30) {
      skills.push({ id: genId(), name: clean, level: 3, category: '' });
    }
  }

  return skills.slice(0, 30); // 最多 30 个技能
}

function parseSummaryBlock(lines: string[]): string {
  return lines.join(' ').trim();
}

export function parseResumeFromText(text: string): ResumeData | null {
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 3) return null;

  const name = extractName(lines);
  const allText = text;

  // 初始化结构
  const sections: Record<string, string[]> = {};
  let currentSection = 'header';
  const headerLines: string[] = [];

  for (const line of lines) {
    const sectionKey = isSectionHeader(line);
    if (sectionKey) {
      currentSection = sectionKey;
      if (!sections[currentSection]) sections[currentSection] = [];
      continue;
    }
    if (currentSection === 'header') {
      headerLines.push(line);
    } else {
      if (!sections[currentSection]) sections[currentSection] = [];
      sections[currentSection].push(line);
    }
  }

  // 解析 header 中的个人信息
  const email = extractEmail(headerLines.join(' ')) || extractEmail(allText);
  const phone = extractPhone(headerLines.join(' ')) || extractPhone(allText);
  const urls = extractURLs(headerLines.join(' ')) || extractURLs(allText);
  const location = extractLocation(headerLines.join(' '));

  // 标题通常在名字之后
  let title = '';
  for (let i = 1; i < Math.min(4, headerLines.length); i++) {
    const l = headerLines[i].trim();
    if (l && l !== name && !/[@\d]/.test(l) && l.length < 40) {
      title = l;
      break;
    }
  }

  // 解析各区块
  const experiences = parseExperienceBlock(sections.experience || []);
  const education = parseEducationBlock(sections.education || []);
  const projects = parseProjectBlock(sections.project || []);
  const skills = parseSkillsBlock(sections.skill || []);
  const summary = parseSummaryBlock(sections.summary || []);

  const resume: ResumeData = {
    id: `pdf-import-${Date.now()}`,
    version: '1.0.0',
    personal: {
      name: name || '未识别',
      title: title || '',
      phone,
      email,
      location,
      github: urls.github || '',
      linkedin: urls.linkedin || '',
      website: urls.website || '',
      summary,
    },
    experiences,
    education,
    projects,
    skills,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return resume;
}
