---
title: "Meting API"
published: 2026-01-15
pinned: false
description: "mikus自建的Meting API"
tags: [Meting, API]
category: "API"
licenseName: "MIT"
author: "mikus"
draft: false
date: 2026-01-15
image: 'https://picflow-api.mikus.ink//converted/pc/webp/43054ED7F3EE24FAEE8C3DD6DFB71A6D.webp'
pubDate: 2026-01-15
---

# Meting API
Meting API地址: https://meting.mikus.ink

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

### 资源ID (id)
对应获取类型的唯一标识符：
- 对于歌单：歌单ID
- 对于单曲：歌曲ID
- 对于专辑：专辑ID
- 对于艺术家：艺术家ID

## API 端点格式
Meting API 的端点格式为：
```
{api_base_url}?server={server}&type={type}&id={id}&auth={auth}&r={r}
```
其中：
- `api_base_url` - API 基础URL
- `server` - 音乐源服务器
- `type` - 获取类型
- `id` - 资源ID
- `auth` - 认证参数（通常为空）
- `r` - 随机数（用于防止缓存，通常是时间戳）

## 响应格式

- `type=url`：以 `@` 开头返回纯文本，否则 302 重定向到音频 URL
- `type=pic`：302 重定向到图片 URL
- `type=lrc`：返回纯文本歌词（含翻译合并）
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
1. 仅用于个人学习和研究使用，禁止违法用途  
2. 请勿滥用，否则可能会被限制访问或封禁 IP 
3. 若有疑问或建议，可通过博客评论区或邮箱联系博主