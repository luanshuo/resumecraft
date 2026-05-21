import { ResumeData } from '../types/resume';

// 示例简历数据
export const exampleResumes: ResumeData[] = [
  {
    id: 'example-frontend',
    version: '1.0.0',
    personal: {
      name: '李四',
      title: '前端开发工程师',
      phone: '139-0000-0000',
      email: 'lisi@example.com',
      location: '北京',
      github: 'https://github.com/lisi',
      linkedin: 'https://linkedin.com/in/lisi',
      summary: '3年前端开发经验，专注于React生态和用户体验优化。'
    },
    experiences: [
      {
        id: 'exp1',
        company: '某互联网公司',
        position: '前端工程师',
        startDate: '2020-06',
        endDate: '',
        current: true,
        description: '负责公司核心产品的前端开发工作',
        achievements: [
          '主导重构了旧版前端系统，使用React重写，性能提升50%',
          '开发了统一的UI组件库，提高了开发效率'
        ]
      }
    ],
    education: [
      {
        id: 'edu1',
        school: '某大学',
        degree: '学士',
        major: '软件工程',
        startDate: '2016-09',
        endDate: '2020-06',
        gpa: '3.6/4.0',
        description: '计算机相关专业'
      }
    ],
    projects: [],
    skills: [
      { id: 'skill1', name: 'React', level: 5, category: '框架' },
      { id: 'skill2', name: 'TypeScript', level: 4, category: '语言' },
      { id: 'skill3', name: 'Node.js', level: 3, category: '后端' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
