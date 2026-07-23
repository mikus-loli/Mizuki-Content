---
title: "Hermes Agent 部署指南"
published: 2026-07-23
pinned: false
description: "从零开始部署 Hermes Agent，搭建属于你自己的 AI 助手"
tags: ["教程", "Hermes", "AI", "部署"]
category: "技术"
author: "mikus"
draft: false
date: 2026-07-23
image: ''
pubDate: 2026-07-23
---

## 前言

[Hermes Agent](https://github.com/NousResearch/hermes-agent) 是由 Nous Research 开发的开源 AI 代理框架。它的 slogan 是 **"The agent that grows with you"** —— 一个能随着你的使用不断进化的智能体。

相比其他 AI 框架，Hermes 有几个突出的特点：

- 🧩 **丰富的工具生态** — 浏览器自动化、终端操作、代码执行、文件管理、网页搜索……开箱即用
- 🌐 **多平台网关** — QQ、微信、Telegram、Discord、Slack……一个 Agent 跑通所有平台
- 🧠 **灵活的大模型接入** — 支持 OpenAI、DeepSeek、Claude、本地模型等几乎所有主流 LLM
- 🔧 **极高的可定制性** — Persona、Skills、Plugins 体系，让 Agent 越来越懂你

这篇教程将带你从零开始部署 Hermes Agent，配置 QQ Bot，并介绍一些进阶玩法。

## 前置要求

- 一台 Linux 服务器（Debian/Ubuntu 推荐，本文以 Debian 为例）
- Python 3.10+
- Node.js 18+（部分插件需要）
- Git
- Docker（可选，某些功能需要）

## 安装

### 一键安装

Hermes 提供了一键安装脚本：

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

安装完成后，重启终端或重新加载环境变量：

```bash
source ~/.bashrc
```

### 验证安装

```bash
hermes --version
```

如果看到类似 `Hermes Agent v0.19.0` 的输出，说明安装成功。

### 从 Git 安装（推荐）

一键安装走的是 pip，如果想获取最新的开发和修复，推荐从 Git 安装：

```bash
git clone https://github.com/NousResearch/hermes-agent.git
cd hermes-agent
pip install -e .
```

这样以后升级只需要 `git pull` 再 `hermes update` 就好。

## 基础配置

### 配置 LLM Provider

Hermes 支持多种大模型提供商，配置非常简单：

```bash
hermes setup
```

按照提示选择你的 provider（如 DeepSeek、OpenAI 等），输入 API Key 即可。

也可以用命令行直接设置：

```bash
hermes config set model.provider deepseek
hermes config set model.default deepseek-v4-flash
hermes config set model.base_url https://api.deepseek.com/v1
```

API Key 保存在 `~/.hermes/.env` 文件中：

```bash
echo 'DEEPSEEK_API_KEY=sk-your-key-here' >> ~/.hermes/.env
```

### 常用配置项

```bash
# 语言设置（中文界面）
hermes config set display.language zh-cn

# 终端超时时间（秒）
hermes config set terminal.timeout 300

# 开启流式输出
hermes config set display.streaming true

# 会话自动重置（闲置 24 小时后）
hermes config set session_reset.idle_minutes 1440
```

## 配置 QQ Bot 网关

Hermes 最吸引人的功能之一就是可以通过 QQ 与你交互。

### 安装 QQ Bot 插件

```bash
hermes plugins install qqbot
```

### 配置 QQ Bot

编辑 `~/.hermes/config.yaml`，添加 QQ Bot 配置：

```yaml
platforms:
  qqbot:
    enabled: true
    extra:
      allow_from:
        - "你的QQ号"  # 允许谁给 Agent 发消息
      dm_policy: allowlist  # 白名单模式
```

### 启动网关

```bash
hermes gateway start
```

网关会同时启动所有配置的平台连接。首次启动需要扫码登录 QQ。

### 多平台同时运行

Hermes 支持一个网关同时连接多个平台。例如同时跑 QQ Bot 和微信：

```yaml
platforms:
  qqbot:
    enabled: true
    # ... QQ Bot 配置
  weixin:
    enabled: true
    # ... 微信配置
```

## Docker 部署（进阶）

如果你习惯用 Docker 管理服务，也可以用 Docker Compose 部署：

```yaml
version: '3'
services:
  hermes:
    image: ghcr.io/nousresearch/hermes-agent:latest
    container_name: hermes
    restart: unless-stopped
    volumes:
      - ./data:/root/.hermes
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - DEEPSEEK_API_KEY=sk-your-key
    network_mode: host
```

:::tip
挂载 Docker socket 可以让 Hermes 在容器内也管理宿主机上的 Docker 容器。
:::

## Camofox 浏览器集成

Hermes 内置的浏览器工具在某些网站可能触发反爬机制。配合 Camofox 反检测浏览器可以解决这个问题。

### 部署 Camofox

```yaml
services:
  camofox-browser:
    image: ghcr.io/jo-inc/camofox-browser:latest
    container_name: camofox-browser
    restart: unless-stopped
    shm_size: 2g
    ports:
      - "9377:9377"
    volumes:
      - ./data:/root/.camofox
```

### 配置 Hermes 使用 Camofox

```bash
# 设置 Camofox 地址
echo 'CAMOFOX_URL=http://localhost:9377' >> ~/.hermes/.env

# 启用持久化会话
hermes config set browser.camofox.managed_persistence true
```

配置好后，所有 `browser_*` 工具会自动走 Camofox，Cookie、登录状态也不会丢失。

## 升级

### 常规升级

```bash
hermes update
```

这个命令会自动拉取最新代码、重新安装依赖。升级前会自动备份配置。

### 小版本升级

```bash
hermes update --check  # 先检查是否有更新
hermes update -y       # 确认后升级，-y 跳过确认
```

## 常见问题

### QQ Bot 发消息失败

确保 QQ 号已登录且网关正常运行：

```bash
hermes doctor    # 诊断工具
hermes gateway logs  # 查看网关日志
```

### 网络问题导致更新失败

国内服务器拉取 GitHub 可能较慢，可以配置代理：

```bash
git config --global http.proxy http://your-proxy:port
hermes update
```

### 模型返回异常

检查 API Key 是否有效以及余额是否充足：

```bash
curl -s https://api.deepseek.com/user/balance \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY"
```

## 后记

部署完 Hermes 之后，你拥有的是一个随时待命的 AI 助手。它可以帮你：

- 🤖 **自动执行任务** — 写代码、查资料、管理服务器
- 💬 **多平台聊天** — QQ、微信、Telegram 随时调用
- 🔧 **不断进化** — Skills 和 Memory 系统让它越来越了解你
- 🌐 **联网能力** — 搜索、抓取网页、操作浏览器

这篇文章里的配置就是 Miku 自己的运行环境，跑在宁宁云香港节点上，对接了 QQ Bot 和微信网关。希望这篇教程对你有帮助喵~ 🐱

## 参考链接

- [Hermes Agent 官方文档](https://hermes-agent.nousresearch.com/docs)
- [Hermes Agent GitHub](https://github.com/NousResearch/hermes-agent)
- [Camofox Browser](https://github.com/jo-inc/camofox-browser)
- [Mizuki 主题](https://github.com/matsuzaka-yuki/Mizuki)
