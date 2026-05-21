// ========================================
// ResumeCraft i18n — 中英文翻译
// ========================================

export type Locale = 'zh' | 'en';

export interface TranslationDict {
  // App header
  appTitle: string;
  btnSave: string;
  btnImport: string;
  btnExport: string;
  btnTemplates: string;
  btnDownloadPDF: string;

  // Tabs
  tabEdit: string;
  tabPreview: string;

  // Toolbar
  zoomTitle: string;
  sectionSummary: string;
  sectionExperience: string;
  sectionEducation: string;
  sectionProject: string;
  sectionSkill: string;
  atsLabel: string;

  // Editor sections
  secPersonal: string;
  secExperience: string;
  secEducation: string;
  secProject: string;
  secSkill: string;

  // Personal fields
  fieldName: string;
  fieldTitle: string;
  fieldPhone: string;
  fieldEmail: string;
  fieldLocation: string;
  fieldGithub: string;
  fieldLinkedin: string;
  fieldWebsite: string;
  fieldSummary: string;
  phName: string;
  phTitle: string;
  phPhone: string;
  phEmail: string;
  phLocation: string;
  phGithub: string;
  phLinkedin: string;
  phWebsite: string;
  phSummary: string;

  // Experience fields
  fieldCompany: string;
  fieldPosition: string;
  fieldStartDate: string;
  fieldEndDate: string;
  fieldCurrent: string;
  fieldDescription: string;
  fieldAchievements: string;
  phCompany: string;
  phPosition: string;
  phStartDate: string;
  phEndDate: string;
  phDescription: string;
  phAchievement: string;
  btnAddAchievement: string;
  btnAddExperience: string;
  lblWorkExpN: string;

  // Education fields
  fieldSchool: string;
  fieldDegree: string;
  fieldMajor: string;
  fieldGpa: string;
  fieldEduDesc: string;
  phSchool: string;
  phMajor: string;
  phGpa: string;
  phEduDesc: string;
  optDegree: string;
  optDoctor: string;
  optMaster: string;
  optBachelor: string;
  optAssociate: string;
  optHighSchool: string;
  btnAddEducation: string;
  lblEducationN: string;

  // Project fields
  fieldProjectName: string;
  fieldRole: string;
  fieldProjectUrl: string;
  fieldTechStack: string;
  phProjectName: string;
  phRole: string;
  phProjectUrl: string;
  phTechStack: string;
  btnAddProject: string;
  lblProjectN: string;

  // Skill fields
  fieldSkillName: string;
  fieldSkillLevel: string;
  fieldSkillCategory: string;
  phSkillName: string;
  phSkillCategory: string;
  lvlBeginner: string;
  lvlBasic: string;
  lvlProficient: string;
  lvlAdvanced: string;
  lvlExpert: string;
  btnAddSkill: string;

  // Preview section titles
  pvSummary: string;
  pvExperience: string;
  pvEducation: string;
  pvProject: string;
  pvSkill: string;
  pvCurrent: string;

  // ATS contact labels
  atsPhone: string;
  atsEmail: string;
  atsLocation: string;
  atsGithub: string;
  atsWebsite: string;

  // Template modal
  tmplTitle: string;
  tmplBlank: string;
  tmplBlankDesc: string;
  btnCancel: string;

  // Save modal
  saveTitle: string;
  saveLoad: string;
  saveDelete: string;
  saveClose: string;
  saveCurrent: string;

  // Toast
  toastSaved: string;
  toastExported: string;
  toastPDFDownloading: string;
  toastPDFFailed: string;
  toastPreviewNotReady: string;
  toastImportSuccess: string;
  toastImportBadFormat: string;
  toastImportParseError: string;
  toastPDFGenerated: string;

  // Confirm dialogs
  confirmLoadOther: string;
  confirmNewResume: string;
  confirmUseExample: string;
  confirmImport: string;
}

const zh: TranslationDict = {
  appTitle: '超级简历',
  btnSave: '💾 保存',
  btnImport: '📥 导入',
  btnExport: '📤 导出',
  btnTemplates: '模板',
  btnDownloadPDF: '📄 下载PDF',

  tabEdit: '编辑简历',
  tabPreview: '预览简历',

  zoomTitle: '缩放',
  sectionSummary: '简介',
  sectionExperience: '经历',
  sectionEducation: '教育',
  sectionProject: '项目',
  sectionSkill: '技能',
  atsLabel: 'ATS',

  secPersonal: '个人信息',
  secExperience: '工作经历',
  secEducation: '教育背景',
  secProject: '项目经历',
  secSkill: '技能',

  fieldName: '姓名',
  fieldTitle: '职位',
  fieldPhone: '手机',
  fieldEmail: '邮箱',
  fieldLocation: '城市',
  fieldGithub: 'GitHub (选填)',
  fieldLinkedin: 'LinkedIn (选填)',
  fieldWebsite: '个人网站 (选填)',
  fieldSummary: '个人简介',
  phName: '例如：张三',
  phTitle: '例如：高级软件工程师',
  phPhone: '138-0000-0000',
  phEmail: 'zhangsan@example.com',
  phLocation: '上海',
  phGithub: 'https://github.com/...',
  phLinkedin: 'https://linkedin.com/in/...',
  phWebsite: 'https://...',
  phSummary: '简要描述你的职业背景和核心优势...',

  fieldCompany: '公司',
  fieldPosition: '职位',
  fieldStartDate: '开始时间',
  fieldEndDate: '结束时间',
  fieldCurrent: '至今任职',
  fieldDescription: '工作描述',
  fieldAchievements: '工作成果',
  phCompany: '公司名称',
  phPosition: '职位名称',
  phStartDate: '2021-03',
  phEndDate: '至今 (留空表示至今)',
  phDescription: '简要描述工作内容...',
  phAchievement: '成果 #',
  btnAddAchievement: '+ 添加工作成果',
  btnAddExperience: '+ 添加工作经历',
  lblWorkExpN: '工作经历 #',

  fieldSchool: '学校',
  fieldDegree: '学历',
  fieldMajor: '专业',
  fieldGpa: 'GPA (选填)',
  fieldEduDesc: '补充描述',
  phSchool: '学校名称',
  phMajor: '计算机科学与技术',
  phGpa: '3.8/4.0',
  phEduDesc: '研究方向、主修课程等',
  optDegree: '选择学历',
  optDoctor: '博士',
  optMaster: '硕士',
  optBachelor: '学士',
  optAssociate: '大专',
  optHighSchool: '高中',
  btnAddEducation: '+ 添加教育经历',
  lblEducationN: '教育经历 #',

  fieldProjectName: '项目名称',
  fieldRole: '角色',
  fieldProjectUrl: '项目链接 (选填)',
  fieldTechStack: '技术栈',
  phProjectName: '项目名称',
  phRole: '技术负责人',
  phProjectUrl: 'https://github.com/...',
  phTechStack: '输入技术栈，回车添加',
  btnAddProject: '+ 添加项目经历',
  lblProjectN: '项目 #',

  fieldSkillName: '技能名称',
  fieldSkillLevel: '掌握程度',
  fieldSkillCategory: '分类',
  phSkillName: '技能名称',
  phSkillCategory: '分类',
  lvlBeginner: '入门',
  lvlBasic: '了解',
  lvlProficient: '熟练',
  lvlAdvanced: '精通',
  lvlExpert: '专家',
  btnAddSkill: '+ 添加技能',

  pvSummary: '个人简介',
  pvExperience: '工作经历',
  pvEducation: '教育背景',
  pvProject: '项目经历',
  pvSkill: '专业技能',
  pvCurrent: '至今',

  atsPhone: '电话',
  atsEmail: '邮箱',
  atsLocation: '城市',
  atsGithub: 'GitHub',
  atsWebsite: '网站',

  tmplTitle: '选择模板',
  tmplBlank: '空白简历',
  tmplBlankDesc: '从头开始创建一份全新的简历',
  btnCancel: '取消',

  saveTitle: '保存简历',
  saveLoad: '加载',
  saveDelete: '删除',
  saveClose: '关闭',
  saveCurrent: '保存当前简历',

  toastSaved: '简历已保存',
  toastExported: 'JSON 已导出',
  toastPDFDownloading: 'PDF 下载中...',
  toastPDFFailed: 'PDF 生成失败，请重试',
  toastPreviewNotReady: '预览未加载，请稍后重试',
  toastImportSuccess: '简历已导入',
  toastImportBadFormat: 'JSON 格式不正确，缺少必要字段',
  toastImportParseError: 'JSON 解析失败，请检查文件格式',
  toastPDFGenerated: 'PDF 已生成',

  confirmLoadOther: '当前简历有未保存的修改，确定要加载其他简历吗？',
  confirmNewResume: '当前简历有未保存的修改，确定要创建新简历吗？',
  confirmUseExample: '当前简历有未保存的修改，确定要使用示例简历吗？',
  confirmImport: '当前简历有未保存的修改，确定要导入吗？',
};

const en: TranslationDict = {
  appTitle: 'ResumeCraft',
  btnSave: '💾 Save',
  btnImport: '📥 Import',
  btnExport: '📤 Export',
  btnTemplates: 'Templates',
  btnDownloadPDF: '📄 Download PDF',

  tabEdit: 'Edit Resume',
  tabPreview: 'Preview',

  zoomTitle: 'Zoom',
  sectionSummary: 'Summary',
  sectionExperience: 'Experience',
  sectionEducation: 'Education',
  sectionProject: 'Projects',
  sectionSkill: 'Skills',
  atsLabel: 'ATS',

  secPersonal: 'Personal Info',
  secExperience: 'Work Experience',
  secEducation: 'Education',
  secProject: 'Projects',
  secSkill: 'Skills',

  fieldName: 'Name',
  fieldTitle: 'Title',
  fieldPhone: 'Phone',
  fieldEmail: 'Email',
  fieldLocation: 'Location',
  fieldGithub: 'GitHub (optional)',
  fieldLinkedin: 'LinkedIn (optional)',
  fieldWebsite: 'Website (optional)',
  fieldSummary: 'Summary',
  phName: 'e.g. John Doe',
  phTitle: 'e.g. Senior Software Engineer',
  phPhone: '123-456-7890',
  phEmail: 'john@example.com',
  phLocation: 'San Francisco, CA',
  phGithub: 'https://github.com/...',
  phLinkedin: 'https://linkedin.com/in/...',
  phWebsite: 'https://...',
  phSummary: 'Briefly describe your background and core strengths...',

  fieldCompany: 'Company',
  fieldPosition: 'Position',
  fieldStartDate: 'Start Date',
  fieldEndDate: 'End Date',
  fieldCurrent: 'Current Position',
  fieldDescription: 'Description',
  fieldAchievements: 'Achievements',
  phCompany: 'Company Name',
  phPosition: 'Position Title',
  phStartDate: '2021-03',
  phEndDate: 'Present (leave blank)',
  phDescription: 'Briefly describe your responsibilities...',
  phAchievement: 'Achievement #',
  btnAddAchievement: '+ Add Achievement',
  btnAddExperience: '+ Add Experience',
  lblWorkExpN: 'Experience #',

  fieldSchool: 'School',
  fieldDegree: 'Degree',
  fieldMajor: 'Major',
  fieldGpa: 'GPA (optional)',
  fieldEduDesc: 'Description',
  phSchool: 'School Name',
  phMajor: 'Computer Science',
  phGpa: '3.8/4.0',
  phEduDesc: 'Research focus, coursework, etc.',
  optDegree: 'Select Degree',
  optDoctor: 'Ph.D.',
  optMaster: "Master's",
  optBachelor: "Bachelor's",
  optAssociate: 'Associate',
  optHighSchool: 'High School',
  btnAddEducation: '+ Add Education',
  lblEducationN: 'Education #',

  fieldProjectName: 'Project Name',
  fieldRole: 'Role',
  fieldProjectUrl: 'Project URL (optional)',
  fieldTechStack: 'Tech Stack',
  phProjectName: 'Project Name',
  phRole: 'Tech Lead',
  phProjectUrl: 'https://github.com/...',
  phTechStack: 'Type tech and press Enter',
  btnAddProject: '+ Add Project',
  lblProjectN: 'Project #',

  fieldSkillName: 'Skill Name',
  fieldSkillLevel: 'Proficiency',
  fieldSkillCategory: 'Category',
  phSkillName: 'Skill Name',
  phSkillCategory: 'Category',
  lvlBeginner: 'Beginner',
  lvlBasic: 'Basic',
  lvlProficient: 'Proficient',
  lvlAdvanced: 'Advanced',
  lvlExpert: 'Expert',
  btnAddSkill: '+ Add Skill',

  pvSummary: 'Summary',
  pvExperience: 'Experience',
  pvEducation: 'Education',
  pvProject: 'Projects',
  pvSkill: 'Skills',
  pvCurrent: 'Present',

  atsPhone: 'Phone',
  atsEmail: 'Email',
  atsLocation: 'Location',
  atsGithub: 'GitHub',
  atsWebsite: 'Website',

  tmplTitle: 'Choose Template',
  tmplBlank: 'Blank Resume',
  tmplBlankDesc: 'Start from scratch',
  btnCancel: 'Cancel',

  saveTitle: 'Saved Resumes',
  saveLoad: 'Load',
  saveDelete: 'Delete',
  saveClose: 'Close',
  saveCurrent: 'Save Current',

  toastSaved: 'Resume saved',
  toastExported: 'JSON exported',
  toastPDFDownloading: 'Generating PDF...',
  toastPDFFailed: 'PDF generation failed, please retry',
  toastPreviewNotReady: 'Preview not ready, please wait',
  toastImportSuccess: 'Resume imported',
  toastImportBadFormat: 'Invalid JSON format: missing required fields',
  toastImportParseError: 'JSON parse error: please check file format',
  toastPDFGenerated: 'PDF generated',

  confirmLoadOther:
    'You have unsaved changes. Load another resume anyway?',
  confirmNewResume:
    'You have unsaved changes. Create a new resume anyway?',
  confirmUseExample:
    'You have unsaved changes. Use this example anyway?',
  confirmImport:
    'You have unsaved changes. Import anyway?',
};

export const dicts: Record<Locale, TranslationDict> = { zh, en };

export function detectBrowserLocale(): Locale {
  const nav = typeof navigator !== 'undefined' ? navigator.language : 'en';
  if (nav.startsWith('zh')) return 'zh';
  return 'en';
}
