---
title: "Random-pic API-随机图片"
published: 2026-01-15
pinned: false
description: "Mikus 自建的 Random-pic API，提供高颜值随机图片接口，支持横屏（PC）与竖屏（Mobile）两种尺寸，适合用于个人项目、网站背景或开发测试"
tags: [Random-pic, API]
category: "API"
licenseName: "MIT"
author: "mikus"
draft: false
date: 2026-01-15
image: ''
pubDate: 2026-01-15
---

# random-pic API

random-pic 是一个轻量、快速的随机图片 API 服务，由 Mikus 自建并维护。通过简单的 HTTP 请求即可获取一张随机图片，适合用作网站背景、个人项目占位图、Demo 开发测试等场景。

**API 地址**: https://random.mikus.ink

# 接口用法

## 横屏图片

请求 `/pc` 接口即可获取一张横屏（宽 > 高）随机图片：

```
https://random.api.mikus.ink/pc
```

## 竖屏图片

请求 `/mobile` 接口即可获取一张竖屏（高 > 宽）随机图片，适合手机壁纸等场景：

```
https://random.api.mikus.ink/mobile
```

## 请求方式

- 支持 **GET** 请求
- 直接访问接口地址即可返回图片资源（`Content-Type: image/*`），浏览器中打开或嵌入 `<img>` 标签使用均可
- 无需鉴权，开箱即用

:::caution[注意]
1. 本服务仅限个人学习与研究使用，禁止用于任何违法或商业用途
2. 请勿频繁请求或滥用，以免触发限流导致 IP 被封禁
3. 如有疑问、建议或发现图片链接失效，欢迎通过博客评论区或发送邮件联系博主反馈
:::
