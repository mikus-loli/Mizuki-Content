---
title: "Docker加速源"
published: 2026-01-14
pinned: false
description: "mikus 自建的 Docker 镜像加速源，支持 Docker Hub、GHCR、Quay、K8s 等多个主流仓库的镜像拉取加速"
tags: ["Docker", "加速源"]
category: "加速源"
licenseName: "MIT"
author: "mikus"
draft: false
date: 2026-01-14
image: ''
pubDate: 2026-01-14
---

# Docker 加速源

国内直接拉取 Docker 镜像时常遇到速度缓慢或连接超时的问题。本文介绍的是一套自建的 Docker 镜像加速服务，覆盖 Docker Hub、GHCR、Quay、K8s 等主流仓库，可帮助大家更顺畅地拉取容器镜像。

- Docker Hub 加速源 https://mirror.mikus.ink
- GHCR 加速源 https://mirror.mikus.ink/ghcr.io
- Quay 加速源 https://mirror.mikus.ink/quay.io
- K8s 加速源 https://mirror.mikus.ink/registry.k8s.io

# 配置使用示例

## Linux/Mac 系统配置

### 1. 编辑 Docker 配置文件
```bash
sudo nano /etc/docker/daemon.json
```

### 2. 添加加速源配置
```json
{
  "registry-mirrors": [
    "https://mirror.mikus.ink"
  ]
}
```

### 3. 重启 Docker 服务
```bash
# Ubuntu/Debian
sudo systemctl restart docker

# CentOS/RHEL
sudo service docker restart

# Mac (Docker Desktop)
# 无需命令，配置后自动生效
```

## Windows 系统配置

1. 打开 Docker Desktop
2. 点击右上角设置图标
3. 选择 Docker Engine 选项卡
4. 在配置中添加加速源：
```json
{
  "registry-mirrors": [
    "https://mirror.mikus.ink"
  ]
}
```
5. 点击应用并重启

## 验证配置

运行以下命令，查看加速源是否生效：
```bash
docker info --format '{{.RegistryConfig.Mirrors}}'
```

如果输出显示配置的加速源 URL，说明配置成功。

## 使用示例

### 拉取 Docker Hub 镜像
```bash
docker pull mirror.mikus.ink/nginx:latest
```

### 拉取 GHCR 镜像
```bash
docker pull mirror.mikus.ink/ghcr.io/microsoft/vscode:latest
```

### 拉取 K8S 镜像
```bash
docker pull mirror.mikus.ink/registry.k8s.io/pause:3.8
```

:::caution[注意]
1. 本加速源仅限个人学习与研究使用，禁止用于任何违法用途  
2. 请勿滥用，否则可能被限制访问或封禁 IP  
3. 如有疑问或建议，欢迎通过博客评论区或邮箱联系博主
:::
