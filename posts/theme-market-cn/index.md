---
title: "Komari Theme Market CN — EdgeOne 加速国内主题市场"
published: 2026-07-26
pinned: false
description: "利用 EdgeOne Pages 为 Komari 监控主题市场搭建国内加速镜像，解决 GitHub 资源访问慢的问题"
tags: [EdgeOne, Komari, 主题, CDN, 加速]
category: "项目"
author: "mikus"
draft: false
date: 2026-07-26
image: ''
pubDate: 2026-07-26
---

[Komari](https://github.com/komari-monitor/komari) 是一款精致的服务器监控面板，它的主题市场默认从 GitHub 拉取主题目录和资源。但在国内，GitHub 的访问速度懂的都懂——预览图加载慢、主题包下载超时，体验很打折扣。

**Komari Theme Market CN** 就是为了解决这个问题而生的：它通过 EdgeOne Pages 为 Komari 主题市场搭建了一个国内加速镜像站。

项目地址：[github.com/mikus-loli/theme-market-cn](https://github.com/mikus-loli/theme-market-cn)

## 工作原理

整个流程围绕上游的 `v1.json`（主题目录文件）展开：

```
GitHub 上游仓库 (komari-monitor/theme-market)
     │  定时同步 v1.json
     ▼
data/v1.json  ──►  构建脚本下载所有 preview / download 资源
     │                      │
     │                      ▼
     │               dist/resources/（资源本地副本）
     │                      │
     ▼                      ▼
仅替换 v1.json 中的资源链接为 EdgeOne 加速链接
     │
     ▼
部署到 EdgeOne Pages → https://komari-market.mikus.ink
```

简单来说就是三步：
1. **同步** — 从上游拉取最新的 `v1.json`
2. **构建** — 下载所有主题的预览图和安装包到本地，然后把 `v1.json` 里的链接换成 EdgeOne 的加速地址
3. **部署** — 推送到 EdgeOne Pages

## 项目结构

```
theme-market-cn/
├── config/config.json              # 全局配置
├── scripts/
│   ├── sync-upstream.js            # 上游同步脚本
│   ├── build.js                    # 构建 + 资源下载 + 链接替换
│   ├── utils.js                    # 工具函数
│   └── logger.js                   # 日志系统
├── data/                           # 同步下来的数据
├── dist/                           # 构建产物（部署到 EdgeOne）
├── src/                            # Vue3 前端
└── .github/workflows/
    └── sync-and-deploy.yml         # CI/CD 工作流
```

## 技术细节

### 配置驱动

所有配置集中在 `config/config.json` 里：

```json
{
  "upstream": {
    "repo": "komari-monitor/theme-market",
    "branch": "main",
    "mirrorRawUrl": "https://mirror.mikus.ink/https://raw.githubusercontent.com"
  },
  "edgeone": {
    "domain": "https://komari-market.mikus.ink",
    "resourcePath": "/resources/"
  },
  "build": {
    "concurrency": 8,
    "timeoutMs": 60000,
    "maxRetries": 3
  }
}
```

### 同步脚本

`sync-upstream.js` 会按优先级依次尝试三种方式拉取 `v1.json`：

1. **GitHub API**（有 Token 时优先，限流更高）
2. **GitHub Raw**（直连）
3. **镜像地址**（通过 `mirror.mikus.ink` 兜底）

拉取后会与本地的 `data/v1.json` 做内容对比，**没有变化就跳过后续流程**，避免不必要的构建和部署。

### 构建脚本

`build.js` 负责核心的加速逻辑：

1. 读取 `data/v1.json`，遍历每个主题
2. 并发下载 `preview`（预览图）和 `download`（主题包）到 `dist/resources/`
3. 替换 `v1.json` 中的原始 GitHub 链接为 EdgeOne 加速链接
4. 运行 Vite 构建前端
5. **下载失败的资源保留原始 URL**，不影响其他资源

并发数、超时、重试次数均可配置。默认 8 并发、60 秒超时、3 次重试。

### CI/CD

GitHub Actions 工作流做了几件事：

- **定时触发** — 每天 UTC 12:05 自动同步一次
- **push 触发** — 代码更新时自动同步
- **手动触发** — 支持 `workflow_dispatch`
- **提交同步数据** — 检测到上游更新时，自动 commit 并 push
- **提交构建产物** — 构建完成后提交 `dist/` 目录
- **EdgeOne 部署** — 可选的 EdgeOne CLI 部署，或者用 EdgeOne Git 集成自动部署

```yaml
on:
  schedule:
    - cron: '5 12 * * *'   # 每天 UTC 12:05
  workflow_dispatch:
  push:
    branches: [main, master]
```

### 日志系统

日志同时输出到控制台和文件，按天滚动保留 14 天：

```
[2026-07-26T12:05:00.000Z] [INFO] [build] 下载成功 {"type":"preview","theme":"Mikus","size":49956}
[2026-07-26T12:05:01.000Z] [INFO] [build] 下载成功 {"type":"download","theme":"Mikus","size":284561}
```

## 部署

两种部署方式：

**方式一：EdgeOne Git 集成（推荐）**
在 EdgeOne 控制台创建 Pages 项目，关联本仓库，设置构建命令 `npm run sync:build`，输出目录 `dist`，绑定域名就完事了。

**方式二：GitHub Actions + EdgeOne CLI**
配置 `EDGEOONE_API_TOKEN`，工作流会自动调用 `edgeone makers deploy` 部署。

## 总结

Komari Theme Market CN 本质上是一个思路很简单的项目——GitHub 慢，就在国内 CDN 上存一份。通过 EdgeOne Pages 的 Git 集成，配合 GitHub Actions 实现全自动的同步 → 构建 → 部署流水线。

如果你也在用 Komari，可以参考这个项目的思路来解决类似的问题。

::github{repo="mikus-loli/theme-market-cn"}
