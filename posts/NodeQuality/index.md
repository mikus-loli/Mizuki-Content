---
title: "NodeQuality 适配国内环境"
published: 2026-01-18
pinned: false
description: "NodeQuality 是一款服务器性能测试脚本，mikus 针对国内网络环境进行了适配和优化。"
tags: ["NodeQuality", "服务器测试", "脚本",]
category: "脚本"
licenseName: "MIT"
author: "mikus"
draft: false
date: 2026-01-18
image: ''
pubDate: 2026-01-18
---

# NodeQuality 适配国内环境

## 项目介绍

NodeQuality 是一款功能强大的服务器性能测试工具，能够全面评估服务器的各项性能指标，包括网络延迟、带宽、CPU 性能、内存使用等。

## 原项目

::github{repo="LloydAsp/NodeQuality"}

## 适配说明

在测试国内服务器时，发现原项目因网络问题（主要是无法访问部分国外测试节点和资源）无法正常运行。为此，我对其进行了以下适配修改：

1. **替换国外测试节点**：改用国内可访问的测试节点
2. **优化网络连接**：调整超时设置，提升在国内网络环境下的稳定性
3. **修复依赖问题**：确保所有依赖项在国内环境中能够顺利安装

## 使用方法

### 一键使用

```bash
bash <(curl -sL https://static.mikus.ink/NodeQuality/NodeQuality.sh)
```

### 使用流程

1. 将上述命令复制到服务器终端
2. 回车执行，脚本将自动安装并运行
3. 等待测试完成，查看详细的性能报告

## 注意事项

:::caution[使用注意]
1. 本工具仅供个人学习和研究使用，禁止用于任何违法用途
2. 请勿频繁滥用，否则可能导致测试节点限制访问或封禁 IP
3. 如有疑问或建议，可通过博客评论区或邮箱联系博主
:::
