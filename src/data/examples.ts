import { ResumeData } from '../types/resume';

export const exampleResumes: ResumeData[] = [
  // ==========================================
  // 模板 1: 前端开发工程师
  // ==========================================
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
      summary: '3年前端开发经验，专注于React生态和用户体验优化。',
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
          '开发了统一的UI组件库，提高了开发效率',
        ],
      },
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
        description: '计算机相关专业',
      },
    ],
    projects: [],
    skills: [
      { id: 'skill1', name: 'React', level: 5, category: '框架' },
      { id: 'skill2', name: 'TypeScript', level: 4, category: '语言' },
      { id: 'skill3', name: 'Node.js', level: 3, category: '后端' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ==========================================
  // 模板 2: 运维开发工程师 (DevOps/SRE 风格)
  // 参照真实简历格式，所有信息已深度脱敏
  // ==========================================
  {
    id: 'example-devops',
    version: '1.0.0',
    personal: {
      name: '王五',
      title: '运维开发工程师',
      phone: '138-0000-0001',
      email: 'wangwu@example.com',
      location: '上海',
      github: 'https://github.com/wangwu',
      summary:
        '多年运维开发经验，熟悉容器编排、分布式存储、云原生网络等技术栈。具备故障定位排查能力。主导 DevOps 体系落地，擅长 CI/CD 流程优化与自动化运维平台建设。',
    },
    experiences: [
      {
        id: 'exp1',
        company: '某云计算公司',
        position: '高级运维开发工程师',
        startDate: '2022-06',
        endDate: '',
        current: true,
        description: '基础设施部门 · 上海',
        achievements: [
          '自研集群巡检 Agent，实现对各集群状态的自动巡检与自愈，上线后业务报障显著下降',
          '通过配置管理工具实现集群与业务的自动化部署、补丁管理及无感升级',
          '使用 Golang 为镜像仓库、GPU 调度插件、存储供应插件等关键组件实现健康检查探针，规避 GPU 共享场景下的资源分配异常',
          '二次开发分布式存储容器化开源项目，优化管理节点重新加入集群流程，改进节点增删及地址切换逻辑',
          '处理分布式存储、容器网络及容器编排平台的疑难问题，输出技术文档并承担问题定位与规避方案设计',
          '针对不同场景输出贴合实际的存储与网络方案，包括扩容、迁移、数据恢复、集群升级',
          '打样并落地多种 GPU + 容器编排方案，确定监控指标与阈值，明确资源共享方案',
          '主导设计并落地本地推理引擎 + 大语言模型 + 智能代理，结合日志巡检自动分析异常原因并通过消息推送发送至指定人员',
        ],
      },
      {
        id: 'exp2',
        company: '某互联网科技公司',
        position: '运维工程师',
        startDate: '2021-07',
        endDate: '2022-04',
        current: false,
        description: '系统部门 · 杭州',
        achievements: [
          '独立设计并完成人员变更自动化服务，通过事件监听实现多平台人员管理与权限自动分发',
          '推动 DevOps 体系升级落地，引入代码质量检测、SQL 审核、镜像仓库、配置管理等工具链',
          '优化 CI/CD 流水线与发布脚本，提高整体安全性、流畅性和自动化程度',
          '负责缓存、数据库、反向代理、消息队列、进程管理等中间件的部署与调优',
          '完成日志告警规则优化，实现告警降噪处理',
        ],
      },
      {
        id: 'exp3',
        company: '某游戏科技公司',
        position: '运维工程师',
        startDate: '2019-11',
        endDate: '2021-07',
        current: false,
        description: '运维部门 · 福州',
        achievements: [
          '参与设计并落地游戏正式服项目的 DevOps 流程',
          '独立设计并落地游戏体验服项目的 DevOps 流程',
          '独立负责游戏的开服、合服、问题处理、数据找回、版本更新等运维操作',
          '对游戏业务评估并设计优化方案，缩短玩家等待时间同时降低资源成本',
          '与开发对接进行业务量预估，完成机器选型与架构设计及部署',
          '使用脚本语言编写运维工具，优化部门操作效率',
        ],
      },
    ],
    education: [
      {
        id: 'edu1',
        school: '某师范大学',
        degree: '学士',
        major: '计算机科学与技术',
        startDate: '2025-05',
        endDate: '2027-05',
        gpa: '',
        description: '非全日制 · 计算机学院',
      },
      {
        id: 'edu2',
        school: '某职业技术学院',
        degree: '大专',
        major: '软件技术',
        startDate: '2016-09',
        endDate: '2019-05',
        gpa: '',
        description: '全日制 · 计算机学院',
      },
    ],
    projects: [
      {
        id: 'proj1',
        name: '多集群服务巡检与智能分析平台',
        role: '主导负责人',
        startDate: '2025-08',
        endDate: '',
        url: '',
        description:
          '通过运维日常巡检流程设计日志巡检服务，实现对多个集群定时收集指定时间范围内的日志并汇总分析。部署本地推理引擎 + 大语言模型 + 智能代理，定时触发模型深入分析异常原因并输出结构化报告，通过消息推送发送至指定人员。巡检效率大幅提升。',
        technologies: ['Golang', 'Vue', 'Kubernetes', 'AI/LLM'],
        achievements: [
          '实现对多个集群的定时日志收集与汇总分析',
          'Web 界面展示异常日志，巡检效率大幅提升',
          '结合本地大模型自动分析异常原因并输出结构化报告',
          '通过消息推送自动发送分析结果至相关人员',
        ],
      },
      {
        id: 'proj2',
        name: '云原生网络与存储组件优化',
        role: '运维开发工程师',
        startDate: '2023-02',
        endDate: '2024-08',
        url: '',
        description:
          '针对大规模业务场景中的集群稳定性挑战，定位薄弱环节并进行修正加固。对容器网络组件进行二次开发解决周期性巡检导致的 CPU 异常；对存储供应插件增加优雅关闭与变动频次监控；对 GPU 设备管理插件增加节点资源值自定义功能。',
        technologies: ['Golang', 'Kubernetes', 'Linux'],
        achievements: [
          '修复后网络组件长期稳定运行，未再出现周期性 CPU 异常',
          '增加业务异常频次监控指标，增强预警能力',
          '让 GPU 插件的资源展示更贴合实际业务场景',
        ],
      },
      {
        id: 'proj3',
        name: '分布式存储集群自动巡检与自愈系统',
        role: '技术负责人',
        startDate: '2022-06',
        endDate: '',
        url: '',
        description:
          '系统梳理长期积累的存储集群异常案例，归纳高频故障并通过官方文档确定通用方案。Agent 定时巡检集群，发现健康状态异常时自动定位详情并执行恢复动作：尝试重启异常存储节点、重试部署节点容器、自动加载本地镜像备份等。覆盖多种常见异常自愈场景。',
        technologies: ['Golang', 'Shell', 'Linux'],
        achievements: [
          '已上线稳定运行多年，覆盖多种常见异常自愈场景',
          '推广至多个现场使用与落地',
          '集群报障率大幅降低，显著减少日常运维负担',
        ],
      },
      {
        id: 'proj4',
        name: 'CI/CD 平台容器化改造',
        role: '运维工程师',
        startDate: '2021-11',
        endDate: '2021-12',
        url: '',
        description:
          '将 CI/CD 服务迁移至容器编排平台，通过动态构建协议根据项目选择不同容器模板实时创建构建环境。接入代码质量检测工具实现实时检测并通过消息推送发送结果。通过节点标签增加亲和性，将网络存储切换为本地挂载实现速度优化。',
        technologies: ['CI/CD', 'Kubernetes', 'Docker'],
        achievements: [
          '实现 CI/CD 服务轻量化，不同项目通过不同镜像构建互不干扰',
          '确保故障时自动漂移，构建服务不中断',
          '支持并行构建任务，不对服务器造成过量负载',
          '完成构建流水线模板化标准化，修改参数即可创建新任务',
        ],
      },
    ],
    skills: [
      { id: 'skill1', name: 'Kubernetes', level: 5, category: '容器编排' },
      { id: 'skill2', name: 'Docker/Containerd', level: 5, category: '容器' },
      { id: 'skill3', name: 'Golang', level: 4, category: '编程语言' },
      { id: 'skill4', name: 'Python', level: 4, category: '编程语言' },
      { id: 'skill5', name: 'Shell', level: 5, category: '脚本语言' },
      { id: 'skill6', name: '分布式存储', level: 5, category: '存储' },
      { id: 'skill7', name: '容器网络', level: 4, category: '网络' },
      { id: 'skill8', name: '配置管理', level: 4, category: '自动化运维' },
      { id: 'skill9', name: '包管理/Helm', level: 4, category: '包管理' },
      { id: 'skill10', name: 'CI/CD', level: 5, category: 'DevOps' },
      { id: 'skill11', name: 'GPU 调度', level: 4, category: 'GPU' },
      { id: 'skill12', name: 'AI/LLM 集成', level: 3, category: 'AI' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
