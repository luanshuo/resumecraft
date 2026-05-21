# 📄 ResumeCraft · 超级简历

[![CI & Package](https://github.com/luanshuo/resumecraft/actions/workflows/ci.yml/badge.svg)](https://github.com/luanshuo/resumecraft/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-4-646CFF?logo=vite)](https://vitejs.dev)

> 在线简历生成器 — Web 界面编辑、实时预览、多模块管理、一键 PDF 下载

<p align="center">
  <img src="screenshots/editor.png" width="45%" alt="编辑器" />
  <img src="screenshots/preview.png" width="45%" alt="预览" />
</p>

## ✨ 功能

- **📝 可视化编辑** — 5 模块可折叠表单（个人信息/工作经历/教育/项目/技能）
- **👁️ 实时预览** — A4 纸实时渲染，所见即所得
- **📥 PDF 导出** — html2pdf.js 一键生成 A4 PDF，排版精确
- **📤 PDF 导入** — 上传已有 PDF 简历，启发式解析自动填充编辑器
- **💾 自动保存** — 2 秒防抖 localStorage，刷新不丢失
- **📤 JSON 导入/导出** — 备份简历数据、跨设备迁移
- **🔍 预览缩放** — 0.5× ~ 1.5×，小屏看清全貌
- **👁️ 模块可见性** — 一键隐藏/显示任意模块
- **🤖 ATS 友好** — 纯文本联系人开关，兼容 Applicant Tracking System
- **🌐 中英文切换** — 全界面 458 个翻译键，自动检测浏览器语言
- **🌙 暗色模式** — 跟随系统 `prefers-color-scheme`，手动切换持久化
- **⌨️ 键盘快捷键** — `Ctrl+S` 保存 · `Ctrl+E` PDF · `Ctrl+Z/X/0` 缩放
- **📱 响应式** — 桌面端优先，平板和手机端自适应

## 🚀 快速开始

### 本地开发

```bash
npm install
npm run dev        # → http://localhost:3000
```

### Docker

```bash
# 拉取镜像
docker pull ghcr.io/luanshuo/resumecraft:latest

# 运行（映射到 3000 端口）
docker run -d -p 3000:80 ghcr.io/luanshuo/resumecraft:latest

# 或使用 docker compose
docker compose up -d
```

### 后端（Go + Gin + GORM，可选）

```bash
# ⚠️ 必须在 server/ 目录下运行
cd server
go mod tidy
go run .           # → http://localhost:8080
```

> 不要在项目根执行 `go run server/main.go`，Go 找不到 `server/go.mod`。

## 📁 项目结构

```
resumecraft/
├── src/                          # React 前端
│   ├── App.tsx                   # 根组件
│   ├── i18n.ts                   # 中英文翻译字典 (458 keys)
│   ├── theme.ts                  # 亮/暗色主题管理
│   ├── index.css                 # 全局样式 + 暗色变量
│   ├── components/
│   │   ├── ResumeEditor.tsx      # 编辑器
│   │   └── ResumePreview.tsx     # 预览 (A4 + PDF)
│   └── utils/
│       ├── pdfParser.ts          # PDF 文本提取 (pdfjs-dist)
│       └── resumeParser.ts       # 启发式简历解析
├── server/                       # Go 后端 (可选)
│   ├── main.go                   # Gin 路由
│   ├── config/config.go          # 配置
│   ├── db/                       # GORM 模型
│   ├── auth/                     # JWT 认证
│   └── handlers/                 # 简历 CRUD
├── .github/workflows/ci.yml      # CI/CD (构建 + Docker + GHCR)
├── Dockerfile                    # 多阶段构建 (node → nginx)
├── docker-compose.yml            # 一键部署
├── CHANGELOG.md                  # 版本记录
└── README.md
```

## 🛠 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | React 18 |
| 语言 | TypeScript 5 |
| 构建 | Vite 4 |
| PDF 导入 | pdfjs-dist 4 |
| PDF 导出 | html2pdf.js |
| 后端 (可选) | Go 1.24 + Gin + GORM |
| 存储 | localStorage / SQLite / MySQL |
| 容器 | Docker + nginx:alpine |
| CI/CD | GitHub Actions → ghcr.io |

## 🌐 国际化

界面支持 **中文** 和 **English** 完整切换，首次访问自动检测浏览器语言。

Header 点击 `🌐 EN` / `🌐 中文` 按钮手动切换，选择持久化到 localStorage。

翻译覆盖：
- 所有按钮、标签、placeholder
- 编辑器 5 个模块的完整表单文本
- 预览区段标题
- Toast 通知、confirm 对话框
- ATS 联系人标签

## ⌨️ 快捷键

| 快捷键 | 操作 |
|--------|------|
| `Ctrl + S` | 保存简历 |
| `Ctrl + E` | 导出 PDF |
| `Ctrl + Z` | 预览缩小 |
| `Ctrl + X` | 预览放大 |
| `Ctrl + 0` | 缩放重置 (100%) |

## 📦 Docker 镜像

镜像自动构建并发布到 GitHub Container Registry：

```bash
docker pull ghcr.io/luanshuo/resumecraft:latest    # 最新版
docker pull ghcr.io/luanshuo/resumecraft:v1.0.0     # 指定版本
docker pull ghcr.io/luanshuo/resumecraft:v1.0       # 大版本
docker pull ghcr.io/luanshuo/resumecraft:sha-abc12  # 精确 commit
```

## 🤝 贡献

欢迎 Issue 和 Pull Request。

```bash
git clone https://github.com/luanshuo/resumecraft.git
cd resumecraft
npm install
npm run dev
```

提交前请确保 `npm run build` 和 `npx tsc --noEmit` 均通过。

## 📄 License

MIT © ResumeCraft Contributors

---

**ResumeCraft** — 让写简历像填表一样简单 ✨
