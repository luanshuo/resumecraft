# Changelog

All notable changes to ResumeCraft will be documented in this file.

## [1.0.0] - 2026-05-21

### 🎉 Initial Release

ResumeCraft — 超级简历，在线简历生成器。支持 Web 界面编辑、实时预览、多模块管理、PDF 导出。

### ✨ Features

- **Visual Editor** — 5 collapsible sections: Personal Info, Work Experience, Education, Projects, Skills
- **Live Preview** — A4 paper real-time rendering, WYSIWYG
- **PDF Export** — One-click PDF download via html2pdf.js, precise layout
- **PDF Import** — Upload existing PDF resume, heuristic text extraction & structured parsing (Chinese & English)
- **Auto-Save** — 2s debounced localStorage persistence, survives page refresh
- **JSON Import/Export** — Backup resume data, cross-device migration
- **Preview Zoom** — 0.5× ~ 1.5× zoom controls with Ctrl+Z/X/0 shortcuts
- **Section Visibility** — Toggle individual sections on/off for targeted resume versions
- **ATS Mode** — Plain-text contact labels for Applicant Tracking System compatibility
- **i18n** — Full Chinese (zh-CN) / English (en) UI switching, 458 translation keys
- **Dark Mode** — Follows system `prefers-color-scheme`, manual toggle, 14 CSS variable overrides
- **Keyboard Shortcuts** — Ctrl+S save, Ctrl+E export PDF, Ctrl+Z/X/0 zoom
- **Responsive** — Desktop-first, tablet & mobile adaptive
- **Go Backend (optional)** — Gin + GORM REST API, JWT auth, SQLite/MySQL
- **Docker Support** — Multi-stage Dockerfile (node build → nginx serve), docker-compose

### 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript 5, Vite 4 |
| PDF | pdfjs-dist 4 (import), html2pdf.js (export) |
| Backend (optional) | Go 1.24, Gin, GORM |
| Storage | localStorage / SQLite / MySQL |
| Container | Docker, nginx:alpine |

### 📦 Packages

- `pdfjs-dist` — PDF text extraction for import
- `html2pdf.js` — PDF generation for export
- `react` / `react-dom` — UI framework
- `uuid` — ID generation

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/).

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
