---
title: "Meting API"
published: 2026-01-15
pinned: false
description: "mikus 自建的 Meting API 服务，支持 VIP 歌曲解析"
tags: [Meting, API]
category: "API"
licenseName: "MIT"
author: "mikus"
draft: false
date: 2026-01-15
image: ''
pubDate: 2026-01-15
---

# Meting API
Meting API 地址：https://meting.mikus.ink

## API 参数

### 服务器地址 (server)
支持的音乐源服务器：
- `netease` - 网易云音乐
- `tencent` - QQ音乐

### 获取类型 (type)
| 类型 | 说明 | 网易云 | QQ音乐 |
|------|------|--------|--------|
| song | 单曲信息 | ✅ | ✅ |
| playlist | 歌单 | ✅ | ✅ |
| artist | 歌手歌曲 | ✅ | ❌ |
| search | 搜索 | ✅ | ❌ |
| url | 播放链接 | ✅ | ✅ |
| lrc | 歌词 | ✅ | ✅ |
| pic | 封面图片 | ✅ | ✅ |

### 资源 ID (id)
对应获取类型的唯一标识符：
- `playlist`（歌单）：歌单 ID
- `song`（单曲）：歌曲 ID
- `artist`（艺术家）：艺术家 ID

## API 端点格式

请求格式如下：

```
{api_base_url}?server={server}&type={type}&id={id}&auth={auth}&r={r}
```

参数说明：
- `api_base_url` — API 基础地址
- `server` — 音乐源服务器（netease / tencent）
- `type` — 获取类型（song / playlist / artist / search / url / lrc / pic）
- `id` — 资源 ID
- `auth` — 认证参数（通常为空）
- `r` — 随机数，用于防止缓存（通常取时间戳）

## 响应格式

根据 `type` 参数不同，返回格式如下：
- `type=url`：以 `@` 开头的纯文本（播放链接），否则返回 302 重定向到音频 URL
- `type=pic`：302 重定向到封面图片 URL
- `type=lrc`：纯文本歌词（含翻译合并）
- 其他类型：返回 JSON 数组

## 使用示例

### 获取歌单信息
```播放歌单
https://meting.mikus.ink/api?server=netease&type=playlist&id=7326220404
```

### 获取单曲信息
```播放单曲
https://meting.mikus.ink/api?server=tencent&type=song&id=004Yi5BD3ksoAN
```

### 获取播放链接
```链接
https://meting.mikus.ink/api?server=netease&type=url&id=22704470
```

### 获取歌词
```歌词
https://meting.mikus.ink/api?server=tencent&type=lrc&id=004Yi5BD3ksoAN
```

:::caution[注意]
1. 本服务仅限个人学习与研究使用，禁止用于商业或违法用途
2. 请勿滥用，否则可能被限制访问或封禁 IP
3. 如有疑问或建议，可通过博客评论区或邮箱联系博主