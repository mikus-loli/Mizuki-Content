---
title: "Music-Cookie"
published: 2026-06-6
pinned: false
description: "是一个自动抓取 QQ 音乐和网易云音乐客户端 Cookie 的工具"
tags: [Cookie,Music]
category: "mikus维护的开源项目"
licenseName: "MIT"
author: "mikus"
draft: false
date: 2026-06-6
image: ''
pubDate: 2026-06-6
---

## 项目简介

Music Cookie 是一个自动抓取 QQ 音乐和网易云音乐客户端 Cookie 的工具。它通过 MITM 代理拦截客户端网络请求，提取登录凭证，并自动发送到 [Meting-API](https://github.com/mikus-loli/Meting-API) 进行统一管理。

**项目地址**:
::github{repo="mikus-loli/Music-Cookie"}

## 核心功能

| 功能 | 说明 |
|------|------|
| 多平台支持 | QQ音乐 + 网易云音乐 |
| 自动抓取 | MITM 代理拦截客户端请求中的 Cookie |
| 自动发送 | 提取后自动 POST 到 Meting-API |
| 定时循环 | 每24小时自动执行一次完整流程 |
| 通知推送 | 支持 Miotify 实时推送执行状态 |
| Web 管理 | 可视化管理界面，查看/管理 Cookie |

## 工作流程

```
启动代理 (60s等待)
    │
    ├─► QQ音乐流程 ──────────────────────────────►
    │   1. 启动 QQ 音乐客户端
    │   2. 等待60秒应用初始化
    │   3. 等待有效 Cookie (最长300秒)
    │   4. 发送 Cookie 到 Meting-API
    │   5. 关闭 QQ 音乐客户端
    │
    ├─► 网易云音乐流程 ──────────────────────────►
    │   1. 启动网易云音乐客户端
    │   2. 等待60秒应用初始化
    │   3. 等待有效 Cookie (最长300秒)
    │   4. 发送 Cookie 到 Meting-API
    │   5. 关闭网易云音乐客户端
    │
    └─► 停止代理 → 清理文件 → 等待24小时 → 循环
```

## 环境准备

### 系统要求

- Windows 操作系统
- Python 3.10+
- **Visual C++ 生成工具**（编译 mitmproxy 依赖必需）
- QQ音乐客户端（已登录）
- 网易云音乐客户端（已登录）

### 1. 安装 Visual C++ 生成工具（必需）

`mitmproxy` 的某些底层依赖（`zstandard`、`cffi`）需要 C++ 编译器才能安装。

**方式一：安装 Visual Studio Build Tools（推荐）**

1. 访问 [Visual Studio 下载页面](https://visualstudio.microsoft.com/zh-hans/downloads/)
2. 展开 **"所有下载"** → 找到 **"Visual Studio 2022 生成工具"** → 下载
3. 运行安装程序，勾选 **"C++ 生成工具"** 
4. 确保包含以下组件：
   - MSVC v143 - VS 2022 C++ x64/x86 生成工具
   - Windows 11 SDK (最新版本)
   - C++ CMake 工具（可选）

### 2. 安装 Python

如果尚未安装 Python，请从 [python.org](https://www.python.org/downloads/) 下载安装。

> **重要**：安装时勾选 "Add Python to PATH"。

### 3. 创建虚拟环境（推荐）

```powershell
# 在项目目录打开终端
cd D:\miku\QQMusic-Cookie

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
venv\Scripts\activate
```

## 安装配置

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

依赖说明：

| 依赖 | 版本 | 用途 |
|------|------|------|
| mitmproxy | 10.4.2 | MITM 代理抓包 |
| fastapi | 0.109.0 | Web API 服务 |
| uvicorn | 0.27.0 | ASGI 服务器 |
| apscheduler | 3.10.4 | 定时任务调度 |
| httpx | 0.26.0 | HTTP 客户端 |
| pydantic | 2.5.3 | 数据验证 |

### 2. 配置 .env 文件

```bash
# 复制配置模板
copy .env.example .env
```

打开 `.env` 文件，填写以下关键配置：

```.env
# ===== 必填配置 =====
# Meting-API 地址（你的 Meting-API 服务地址）
TARGET_API_URL=https://meting.mikus.ink/admin/cookies

# Meting-API Token（在 Meting-API 管理后台获取，以 mapi_ 开头）
TARGET_API_TOKEN=mapi_your_token_here

# QQ音乐客户端路径
QQMUSIC_PATH=C:\QQMusic\QQMusic.exe

# 网易云音乐客户端路径
NETEASEMUSIC_PATH=C:\Program Files\Netease\CloudMusic\cloudmusic.exe

# Miotify 通知（详见下方通知配置章节）#也支持 gotify 通知
MIOTIFY_ENABLED=false
MIOTIFY_URL=http://localhost:8080
MIOTIFY_TOKEN=

# 代理配置（一般无需修改）
PROXY_HOST=127.0.0.1
PROXY_PORT=8080

# API 服务配置
API_HOST=0.0.0.0
API_PORT=5000
API_TOKEN=your_api_token
```

### 3. 安装 MITM 证书

MITM 代理需要安装 SSL 证书才能解密 HTTPS 流量。

**步骤：**

1. 启动代理（任选一种方式）：
   ```bash
   python main.py --proxy-only
   ```

2. 打开浏览器访问 `http://mitm.it`

3. 下载 Windows 证书：
   - 点击 **Windows** 图标下载 `mitmproxy-ca-cert.p12`

4. 安装证书：
   - 双击下载的证书文件
   - 选择 **"本地计算机"**
   - 选择 **"将所有证书放入下列存储"**
   - 点击 **"浏览"** → 选择 **"受信任的根证书颁发机构"**
   - 完成安装

或者通过命令行安装：

```bash
certutil -addstore root %USERPROFILE%\.mitmproxy\mitmproxy-ca-cert.cer
```

## 客户端代理设置

代理抓包需要客户端将所有网络请求发送到 MITM 代理。

### QQ音乐客户端

1. 打开 QQ音乐客户端
2. 点击右上角 **菜单**（三条横线图标）
3. 选择 **设置**
4. 找到 **网络设置** 或 **代理设置**
5. 选择 **自定义代理**
6. 填写：
   - 类型：**HTTP 代理**
   - 服务器地址：`127.0.0.1`
   - 端口：`8080`
7. 点击 **保存** 或 **确定**

### 网易云音乐客户端

1. 打开网易云音乐客户端
2. 点击右上角 **设置**（齿轮图标）
3. 找到 **工具** 或 **代理设置**
4. 选择 **自定义代理**
5. 填写：
   - 类型：**HTTP 代理**
   - 服务器地址：`127.0.0.1`
   - 端口：`8080`
6. 点击 **保存** 或 **确定**

> **注意**：两个客户端都需要先登录账号，否则捕获的 Cookie 无效。

## 运行方式

### 方式一：双击运行（最简单）

| 文件 | 功能 |
|------|------|
| `run_automate.bat` | 24小时自动化循环 |
| `run_once.bat` | 执行一次 |

直接双击对应的 `.bat` 文件即可启动。

### 方式二：命令行运行

#### 自动化模式（推荐）

```bash
# 每24小时循环一次，抓取所有平台
python automate.py --interval 24

# 只抓取 QQ音乐
python automate.py --interval 24 --platform qqmusic

# 只抓取 网易云音乐
python automate.py --interval 24 --platform netease

# 执行一次后退出
python automate.py --once
python automate.py --once --platform qqmusic
```

**参数说明：**

| 参数 | 可选值 | 默认值 | 说明 |
|------|--------|--------|------|
| `--interval` | 数字 | 24 | 循环间隔（小时） |
| `--once` | - | - | 仅执行一次 |
| `--platform` | all / qqmusic / netease | all | 目标平台 |

#### 手动模式

```bash
# 完整服务（代理 + API + 定时任务）
python main.py

# 仅启动 API 服务
python main.py --api-only

# 仅启动代理抓包
python main.py --proxy-only

# 手动发送已存储的 Cookie 到 Meting-API
python main.py --send-now

# 查看当前 Cookie 状态
python main.py --status
```



## 自动化流程详解

### 各阶段说明

| 阶段 | 说明 | 耗时 |
|------|------|------|
| 启动代理 | 启动 MITM 代理子进程，绑定 127.0.0.1:8080 | ~5秒 |
| 等待稳定 | 等待代理完全启动并准备接收连接 | 60秒 |
| 启动客户端 | 启动 QQ音乐/网易云音乐 EXE | ~3秒 |
| 应用初始化 | 等待客户端加载 UI、连接网络、发送请求 | 60秒 |
| 等待 Cookie | 轮询检查是否捕获到有效登录凭证 | 最长300秒 |
| 发送 Cookie | POST 到 Meting-API 保存 | ~3秒 |
| 关闭客户端 | 优雅关闭客户端进程 | ~5秒 |
| 清理文件 | 删除临时 cookie 文件 | ~1秒 |
| 等待循环 | 休眠至下次执行 | 24小时 |

### 定时执行

- 脚本会每24小时自动执行一次完整流程
- 执行时间取决于首次启动时间（例如首次 17:00 启动，下次也是 17:00）
- 按 `Ctrl+C` 可随时停止

## Miotify 通知配置

Miotify 是一个轻量级消息推送服务器，兼容 Gotify API。配置后可以实时收到 Cookie 抓取和发送的状态推送。

### 1. 部署 Miotify

```bash
git clone https://github.com/mikus-loli/Miotify
cd Miotify
docker-compose up -d
```

服务默认运行在 `http://localhost:8080`。

### 2. 获取 App Token

1. 浏览器打开 `http://localhost:8080`
2. 使用默认账号登录（admin / admin）
3. 点击 **Apps** → **Create Application**
4. 输入应用名称（如 "Cookie Manager"）
5. 创建后会生成一个 App Token（UUID 格式），复制保存

### 3. 配置 .env

```ini
MIOTIFY_ENABLED=true
MIOTIFY_URL=http://localhost:8080
MIOTIFY_TOKEN=你的App_Token_（UUID格式）
```

### 4. 通知类型

| 通知 | 标题 | 场景 |
|------|------|------|
| 自动化周期开始 | 第 N 次 Cookie 抓取周期已启动 | 每个周期开始时 |
| QQ音乐 Cookie 已抓取 | 成功抓取 QQ 音乐 Cookie | UIN 已获取 |
| QQ音乐 Cookie 抓取失败 | 未捕获到有效的 QQ 音乐 Cookie | 超时或未找到 |
| QQ音乐 Cookie 已发送 | Cookie 已成功发送到 Meting-API | POST 成功 |
| QQ音乐 Cookie 发送失败 | 发送到 Meting-API 失败 | 网络错误等 |
| 自动化周期完成 | 所有平台处理完毕 | 周期结束汇总 |
| 系统错误 | 异常错误详情 | 脚本异常 |

### Cookie 状态检查

```bash
python main.py --status
```

输出示例：

```
QQ Music Cookie Status
========================================
  UIN: 3166326944
  Key: Q_H_L_63k3NLuJcvgUCi...
  Refresh Token: Yes
  Status: Valid
```

## API 接口说明

### 认证方式

需要认证的接口使用 Bearer Token：

```bash
curl -H "Authorization: Bearer your_token" http://localhost:5000/api/meting
```

### 接口列表

| 方法 | 路径 | 认证 | 说明 |
|------|------|------|------|
| GET | `/` | 否 | 服务运行状态 |
| GET | `/health` | 否 | 健康检查 |
| GET | `/api/meting` | 是 | 获取完整 Cookie 数据 |
| GET | `/api/meting/simple` | 是 | 获取简化 Cookie 数据 |
| POST | `/api/cookies` | 是 | 手动添加 Cookie |
| POST | `/api/send` | 是 | 发送 Cookie 到 Meting-API |
| DELETE | `/api/cookies` | 是 | 清空所有 Cookie |

## Cookie 格式说明

### QQ音乐

**最简格式**（基本播放功能）：

```
uin=你的QQ号; qqmusic_key=Q_H_L_开头的key
```

**完整格式**（支持自动续期）：

```
uin=你的QQ号; qqmusic_key=Q_H_L_...; qm_keyst=Q_H_L_...; psrf_qqrefresh_token=...; psrf_qqaccess_token=...; qqmusic_guid=...
```

### 网易云音乐

```
MUSIC_U=用户token; MUSIC_A=认证key; __csrf=csrf值
```

## 发送到 Meting-API 的数据格式

### QQ音乐

```json
{
  "platform": "tencent",
  "cookie": "uin=3166326944; qqmusic_key=Q_H_L_63k3...; psrf_qqrefresh_token=...",
  "note": "Auto-synced from Music-Cookie-Manager",
  "isActive": true
}
```

### 网易云音乐

```json
{
  "platform": "netease",
  "cookie": "MUSIC_U=00FD08B3B2141E00C258...; __csrf=...",
  "note": "Auto-synced from Music-Cookie-Manager",
  "isActive": true
}
```

## 项目结构

```
Music-Cookie/
├── automate.py        # 自动化脚本
├── main.py            # 主程序入口
├── config.py          # 配置管理
├── api_server.py      # REST API服务
├── proxy_capture.py   # MITM代理抓包
├── cookie_store.py    # Cookie存储
├── scheduler.py       # 定时任务
├── notify.py          # 通知推送
├── run_automate.bat   # 自动化启动脚本
├── run_once.bat       # 单次执行脚本
├── static/            # 前端静态文件
├── data/              # 数据目录
├── logs/              # 日志目录
├── requirements.txt   # 完整依赖
├── requirements-lite.txt # 精简依赖
└── .env.example       # 配置示例
```

## 安全建议

1. **设置API_TOKEN** - 防止Cookie被未授权访问
2. **使用HTTPS** - 生产环境建议配置反向代理
3. **限制访问IP** - 通过防火墙限制API访问来源
4. **定期更换Token** - 提高安全性

## 常见问题

### Q: 安装依赖报错 `error: Microsoft Visual C++ 14.0 or greater is required`？

`mitmproxy` 的底层依赖 `zstandard` 和 `cffi` 需要 C++ 编译器。解决方案：

1. 安装 Visual Studio Build Tools（推荐）
2. 使用预编译 wheel 安装
3. 使用精简版依赖 `requirements-lite.txt`

### Q: 自动化模式无法启动应用？

检查 `.env` 中的 `QQMUSIC_PATH` 和 `NETEASEMUSIC_PATH` 是否正确，或确保应用安装在默认路径。

### Q: Cookie抓取失败？

1. 确保已安装MITM证书
2. 确保客户端已配置代理 `127.0.0.1:8080`
3. 确保客户端已登录账号

### Q: 发送失败？

检查 `TARGET_API_URL` 和 `TARGET_API_TOKEN` 配置是否正确。

### Q: 网易云音乐抓取不到Cookie？

1. 网易云音乐需要在设置中配置代理
2. 确保已登录账号
3. 检查代理日志 `logs/proxy.log`
