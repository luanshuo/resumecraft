// 简历数据类型定义
export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  url?: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
  category: string;
}

export interface ResumeData {
  id: string;
  version: string;
  personal: {
    name: string;
    title: string;
    phone: string;
    email: string;
    location: string;
    github?: string;
    linkedin?: string;
    website?: string;
    summary: string;
  };
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
  createdAt: string;
  updatedAt: string;
}

// 默认简历数据
export const defaultResume: ResumeData = {
  id: 'default',
  version: '1.0.0',
  personal: {
    name: '张三',
    title: '高级软件工程师',
    phone: '138-0000-0000',
    email: 'zhangsan@example.com',
    location: '上海',
    github: 'https://github.com/zhangsan',
    linkedin: 'https://linkedin.com/in/zhangsan',
    summary: '拥有5年软件开发经验，专注于后端系统架构和微服务设计。精通Go、Python和分布式系统开发，具备丰富的高并发系统优化经验。'
  },
  experiences: [
    {
      id: 'exp1',
      company: '某互联网公司',
      position: '高级后端工程师',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: '负责核心业务系统的架构设计和开发工作',
      achievements: [
        '主导设计并实现了分布式订单系统，日处理订单量超过100万',
        '优化数据库查询性能，将系统响应时间从500ms降低到100ms',
        '引入微服务架构，将单体应用拆分为15个独立服务'
      ]
    },
    {
      id: 'exp2',
      company: '某科技公司',
      position: '软件工程师',
      startDate: '2019-06',
      endDate: '2021-02',
      current: false,
      description: '参与企业级应用的开发和维护',
      achievements: [
        '开发了自动化部署系统，将部署时间从30分钟缩短到5分钟',
        '参与微服务迁移项目，负责服务注册与发现模块'
      ]
    }
  ],
  education: [
    {
      id: 'edu1',
      school: '某大学',
      degree: '硕士',
      major: '计算机科学与技术',
      startDate: '2016-09',
      endDate: '2019-06',
      gpa: '3.8/4.0',
      description: '研究方向：分布式系统与大数据处理'
    },
    {
      id: 'edu2',
      school: '某大学',
      degree: '学士',
      major: '软件工程',
      startDate: '2012-09',
      endDate: '2016-06',
      gpa: '3.7/4.0',
      description: '主修课程：数据结构、算法、操作系统、网络编程'
    }
  ],
  projects: [
    {
      id: 'proj1',
      name: '电商平台后端系统',
      role: '技术负责人',
      startDate: '2022-01',
      endDate: '2022-12',
      url: 'https://github.com/zhangsan/ecommerce-backend',
      description: '构建高可用的电商平台后端系统',
      technologies: ['Go', 'Gin', 'GORM', 'Redis', 'MySQL'],
      achievements: [
        '实现高并发商品秒杀系统，支持每秒10000+请求',
        '设计并实现分布式事务解决方案，保证数据一致性'
      ]
    }
  ],
  skills: [
    { id: 'skill1', name: 'Go', level: 5, category: '编程语言' },
    { id: 'skill2', name: 'Python', level: 4, category: '编程语言' },
    { id: 'skill3', name: '微服务架构', level: 5, category: '架构设计' },
    { id: 'skill4', name: '分布式系统', level: 4, category: '系统设计' },
    { id: 'skill5', name: '数据库设计', level: 4, category: '数据库' }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}
