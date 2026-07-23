---
title: "Github加速源"
published: 2026-01-18
pinned: false
description: "mikus 自建的 GitHub 加速源，支持 Releases 下载、Raw 文件获取及仓库克隆，解决国内访问 GitHub 速度慢的问题"
tags: ["Github", "加速源"]
category: "加速源"
licenseName: "MIT"
author: "mikus"
draft: false
date: 2026-01-18
image: ''
pubDate: 2026-01-18
---

# GitHub 加速源

由于国内网络环境限制，直接访问 GitHub 下载 Releases 资源、获取 Raw 文件或执行 `git clone` 往往速度缓慢甚至超时。mikus 搭建了一套基于 `mirror.mikus.ink` 的反向代理加速服务，只需在原始 GitHub 链接前加上镜像前缀即可享受高速下载。

## 使用方法

在任意 GitHub 链接（Releases、Raw 文件或仓库地址）前加上 `https://mirror.mikus.ink/` 即可。以下以 hubproxy 项目为例：

### 加速 Releases 下载

大文件 Releases 是 GitHub 访问速度最慢的场景之一，通过镜像可以大幅提升下载速度。

```
https://mirror.mikus.ink/https://github.com/sky22333/hubproxy/releases/download/v1.2.1/hubproxy-v1.2.1-linux-amd64.tar.gz
```

### 加速 Raw 文件获取

脚本和配置文件的 Raw 链接同样支持加速，方便 `curl` 或 `wget` 一键获取。

```
https://mirror.mikus.ink/https://raw.githubusercontent.com/sky22333/hubproxy/main/install.sh
```

### 加速仓库克隆

使用镜像地址替换原有的 Git 仓库链接，即可加速 `git clone` 操作。

```
https://mirror.mikus.ink/https://github.com/sky22333/hubproxy.git
```

> 使用示例：`git clone https://mirror.mikus.ink/https://github.com/sky22333/hubproxy.git`

:::caution[注意]
1. 本服务仅限个人学习与研究使用，**严禁用于任何违法用途**
2. 请勿滥用或进行大流量刷取，否则可能会被限制访问或封禁 IP
3. 若有疑问或建议，欢迎通过博客评论区或邮箱联系博主
:::
