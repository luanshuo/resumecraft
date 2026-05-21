# 简历生成器 (ResumeCraft) 实现方案

> **项目路径**: `~/Vscode/jianli/`
> **定位**: 类似超级简历的在线简历生成器，支持 Web 编辑、多模板预览、PDF 下载
> **技术栈**: Go (Gin) 后端 + Vue3 (CDN) 前端 + SQLite/MySQL

---

## 一、产品功能规划

### 核心功能
1. **用户系统** — 注册/登录/个人信息管理
2. **简历管理** — 创建/编辑/删除/复制简历
3. **简历编辑器** — 分模块编辑：个人信息、工作经历、教育背景、技能、项目、自我评价
4. **多模板** — 至少 3 种简历模板（简约/专业/现代）
5. **实时预览** — 编辑时右侧实时预览简历效果
6. **PDF 下载** — 一键导出为 PDF（服务端渲染，保证排版）
7. **模板切换** — 同一份数据可切换不同模板预览

### 数据模型
```
User (用户)
├── id, name, email, password_hash, created_at
│
Resume (简历)
├── id, user_id, name, template, created_at, updated_at
│
Section (简历区块 - 通用)
├── id, resume_id, type, sort_order, data (JSON)
│   type: personal | experience | education | skill | project | summary
│
```

> 使用 JSON 存储每个 section 的灵活数据，避免过多表关联。

---

## 二、技术架构

### 后端 (Go + Gin + GORM)
```
server/
├── main.go              # 入口 + 路由
├── config/config.go     # 配置
├── db/
│   ├── db.go            # 连接 + AutoMigrate + Seed
│   └── models.go        # GORM 模型
├── auth/
│   ├── handler.go       # 注册/登录/登出
│   └── middleware.go    # JWT 认证中间件
├── handlers/
│   ├── resume.go        # 简历 CRUD
│   └── section.go       # 区块管理
└── go.mod
```

### 前端 (Vue3 CDN + 无构建步骤)
```
webapp/
├── index.html           # 入口 HTML
├── app.js               # Vue 应用 + 路由 + 组件
├── api.js               # API 请求封装
├── style.css            # 全局样式
└── components/
    ├── Editor.vue       # 编辑器组件
    ├── Preview.vue      # 预览组件
    └── templates/       # 模板样式
```

### PDF 导出方案
使用 **服务端渲染 + weasyprint/wkhtmltopdf** 或 **前端 html2pdf.js**。
推荐：前端用 `html2pdf.js`（基于 html2canvas + jsPDF），无需后端依赖。

---

## 三、API 设计

### 认证
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/v1/auth/register | 注册 |
| POST | /api/v1/auth/login | 登录 |
| POST | /api/v1/auth/logout | 登出 |
| GET  | /api/v1/auth/me | 当前用户 |

### 简历
| 方法 | 路径 | 说明 |
|------|------|------|
| GET  | /api/v1/resumes | 我的简历列表 |
| POST | /api/v1/resumes | 创建简历 |
| GET  | /api/v1/resumes/:id | 获取简历详情 |
| PUT  | /api/v1/resumes/:id | 更新简历 |
| DELETE | /api/v1/resumes/:id | 删除简历 |
| POST | /api/v1/resumes/:id/copy | 复制简历 |

### 区块
| 方法 | 路径 | 说明 |
|------|------|------|
| GET  | /api/v1/resumes/:id/sections | 获取所有区块 |
| PUT  | /api/v1/resumes/:id/sections | 批量更新区块 |
| POST | /api/v1/resumes/:id/sections/:type | 新增区块 |

---

## 四、简历模板设计

### 模板 1: 简约 (Minimal)
- 单栏布局
- 黑白色调
- 字体为主，无装饰线
- 适合互联网/技术岗

### 模板 2: 专业 (Professional)
- 双栏布局（左侧边栏 + 主内容）
- 蓝色侧边栏
- 技能进度条
- 适合金融/咨询/传统行业

### 模板 3: 现代 (Modern)
- 顶部姓名横幅
- 卡片式区块
- 渐变色点缀
- 适合设计/创意/创业

---

## 五、开发顺序

1. **后端基础** — 项目初始化、数据库模型、JWT 认证
2. **简历 API** — CRUD + 区块管理
3. **前端基础** — Vue3 框架、路由、API 封装
4. **认证页面** — 登录/注册
5. **简历列表** — 创建/编辑/删除/复制
6. **编辑器** — 分模块编辑表单
7. **预览 + 模板** — 实时预览、多模板切换
8. **PDF 导出** — html2pdf.js 集成
9. **样式打磨** — 响应式、动画、细节

---

## 六、注意事项

1. 复用 `go-microservice-scaffold` 技能中的 Go 项目结构
2. 前端用 Vue3 CDN 方式，无构建步骤，和小九闪购厨房一致
3. PDF 导出用前端 `html2pdf.js`，避免后端安装 wkhtmltopdf
4. 编辑器使用分步表单（Wizard），一次编辑一个区块
5. 预览区域使用 iframe 隔离，避免 CSS 冲突
6. 所有 API 路径以 `/api/v1/` 前缀
