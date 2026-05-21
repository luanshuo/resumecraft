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
  // 参照真实简历格式，信息已脱敏
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
        '7年工作经验，5年运维开发经验，2年运维经验。熟悉Kubernetes、Containerd、Docker、Calico等云原生技术栈。具备极强的系统与集群故障定位、排查能力。主导DevOps体系从0到1落地，擅长CI/CD流程优化与自动化运维平台建设。',
    },
    experiences: [
      {
        id: 'exp1',
        company: '某云计算公司',
        position: '高级运维开发工程师',
        startDate: '2022-06',
        endDate: '',
        current: true,
        description: '基础设施与运维开发部 · 上海',
        achievements: [
          '明确业务痛点，确定解决方案并自研集群巡检Agent，实现对Kubernetes与Ceph集群状态的自动巡检与自愈，上线后减少业务报障85%以上，已迭代20+版本',
          '通过Ansible-Playbook实现集群与业务的自动化部署、补丁包管理、无感升级',
          '使用Golang实现Harbor、GPU-Device-Plugin、NFS-Provisioner等关键组件的Liveness与Readiness探针，规避GPU共享场景下单卡分配多Pod的疑难问题',
          '二次开发开源项目Ceph-Container，优化Monitor节点重新加入集群的流程，改进集群节点的添加、删除及IP切换逻辑',
          '处理Ceph集群、Calico、CoreDNS、Node-Local-DNS、K8s集群的疑难杂症，输出对内对外技术文档，多次承担问题定位与规避方案设计',
          '针对不同现场输出贴合场景的存储与网络解决方案，包括扩容、迁移、数据恢复、集群升级',
          '打样并落地多种GPU + K8s方案（Nvidia、昇腾、寒武纪），确定监控指标与阈值，明确GPU共享方案',
          '主导设计并落地VLLM + 大语言模型 + Agent，结合日志巡检服务实现定时巡检日志结果接入本地模型，深入分析异常原因并通过Webhook发送至指定人员',
        ],
      },
      {
        id: 'exp2',
        company: '某互联网科技公司',
        position: '运维工程师',
        startDate: '2021-07',
        endDate: '2022-04',
        current: false,
        description: '系统组 · 杭州',
        achievements: [
          '独立设计与完成人员变更服务，通过监听人员变更对多个平台服务进行人员管理与权限自动化分发',
          '对已有DevOps运维体系进行升级设计与整体推动落地，增加SonarQube、Archery、Harbor、Kubernetes、CMDB等工具链',
          '优化Jenkins Pipeline与发布脚本，提高整体安全性、流畅性、自动化程度及稳定性',
          '负责Redis、MySQL、Nginx、RabbitMQ、Supervisord等中间件的部署、维护与调优',
          '完成日志告警规则优化，实现对告警的降噪处理',
        ],
      },
      {
        id: 'exp3',
        company: '某游戏科技集团',
        position: '运维工程师',
        startDate: '2019-11',
        endDate: '2021-07',
        current: false,
        description: '运维部 · 福州',
        achievements: [
          '参与设计并落地手游正式服项目的DevOps流程',
          '独立设计并落地手游BT服项目的DevOps流程',
          '独立负责游戏的开服、合服、问题处理、数据找回、更新等运维操作',
          '对游戏业务进行评估并设计优化方案，缩短玩家登录等待时间同时降低成本',
          '与开发对接进行业务量预估，完成机器配置选择与架构初设计及部署',
          '使用Shell与Python编写运维脚本，优化部门操作效率',
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
        name: 'K8s多集群服务巡检 + 本地大模型分析',
        role: '主导负责人',
        startDate: '2025-08',
        endDate: '',
        url: '',
        description:
          '通过运维每日巡检SOP设计日志巡检服务（Golang + Vue），实现对多个K8s集群定时收集指定时间范围内的日志并汇总分析。通过本地部署VLLM + 大语言模型 + Agent，定时触发模型对巡检日志深入分析原因与恢复方案并输出Excel报告，通过Webhook发送到指定人员的邮箱与企业微信。将巡检时间从4小时缩短到30分钟。',
        technologies: ['Golang', 'Vue', 'Kubernetes', 'VLLM', 'Agent'],
        achievements: [
          '实现对多个K8s集群的定时日志收集与汇总',
          'Web界面展示异常日志，巡检时间从4小时缩短到30分钟',
          '结合本地大模型自动分析异常日志原因并输出恢复方案Excel',
          '通过Webhook自动发送分析结果到指定人员',
        ],
      },
      {
        id: 'proj2',
        name: '开源项目二次开发 — Calico / Ceph / GPU Plugin',
        role: '运维开发工程师',
        startDate: '2023-02',
        endDate: '2024-08',
        url: '',
        description:
          '针对2000+业务场景中集群稳定性挑战，定位易损点并进行修正加固。二次开发Calico-Node解决Bird CPU异常导致OOM问题，二次开发Cephfs-Provisioner增加优雅关闭与变动频次监控，二次开发Nvidia-Device-Plugin增加节点GPU资源值修改功能。',
        technologies: ['Calico', 'Ceph', 'Golang', 'Kubernetes', 'Nvidia'],
        achievements: [
          '修改后的Calico落地后一年未再出现Bird巡检导致CPU OOM',
          '增加了业务异常频次监控指标，增强预警能力',
          '让GPU Plugin对主机GPU资源的显示更贴合业务场景',
        ],
      },
      {
        id: 'proj3',
        name: 'Ceph-Agent — 集群自动巡检与自愈系统',
        role: '技术负责人',
        startDate: '2022-06',
        endDate: '',
        url: '',
        description:
          '归拢过去五年所有Ceph异常，归纳高发异常并通过官方文档确定通用稳定的解决方案。Agent定时巡检Ceph集群，出现HEALTH_WARN或HEALTH_ERR时自动定位异常详情并执行恢复动作：重启异常OSD、重试部署OSD容器、自动Load本地镜像Tag包等。覆盖十多种异常自愈场景。',
        technologies: ['Golang', 'Ceph', 'Shell', 'Linux'],
        achievements: [
          '上线4年，覆盖十多种Ceph异常自愈场景',
          '推广300+现场使用与落地',
          'Ceph报错量减少85%以上，从2天1报障减少到1月2报障',
        ],
      },
      {
        id: 'proj4',
        name: 'Jenkins + Kubernetes 动态Agent',
        role: '运维工程师',
        startDate: '2021-11',
        endDate: '2021-12',
        url: '',
        description:
          '将Jenkins迁移至K8s中，通过JNLP根据项目选择不同Pod模板实时创建构建Pod。接入SonarQube实现代码质量检测并通过Webhook发送结果通知。通过不同Node打Label增加亲和性，将PVC切为Localhost挂载实现速度优化。',
        technologies: ['Jenkins', 'Kubernetes', 'SonarQube', 'NFS'],
        achievements: [
          '实现Jenkins简单干净化，不同项目通过不同Image构建互不干扰',
          '确保机器宕机后自动漂移，Jenkins服务不中断',
          '允许并行多个构建任务不对服务器造成过量负载',
          '完成构建Pipeline模板化标准化，修改参数即可创建新Job',
        ],
      },
    ],
    skills: [
      { id: 'skill1', name: 'Kubernetes', level: 5, category: '容器编排' },
      { id: 'skill2', name: 'Docker/Containerd', level: 5, category: '容器' },
      { id: 'skill3', name: 'Golang', level: 4, category: '编程语言' },
      { id: 'skill4', name: 'Python', level: 4, category: '编程语言' },
      { id: 'skill5', name: 'Shell', level: 5, category: '脚本语言' },
      { id: 'skill6', name: 'Ceph', level: 5, category: '分布式存储' },
      { id: 'skill7', name: 'Calico', level: 4, category: '网络' },
      { id: 'skill8', name: 'Ansible', level: 4, category: '自动化运维' },
      { id: 'skill9', name: 'Helm', level: 4, category: '包管理' },
      { id: 'skill10', name: 'CI/CD', level: 5, category: 'DevOps' },
      { id: 'skill11', name: 'GPU + K8s', level: 4, category: 'GPU' },
      { id: 'skill12', name: 'VLLM/LLM', level: 3, category: 'AI' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
