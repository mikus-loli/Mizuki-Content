---
title: "Windows 启用 OpenSSH 指南"
published: 2026-07-25
pinned: false
description: "在 Windows 10/11 上启用 OpenSSH Server 和 Client 的完整教程，包括安装、配置、密钥认证和常见问题排查"
tags: [Windows, SSH, OpenSSH, 教程]
category: "技术"
author: "mikus"
draft: false
date: 2026-07-25
image: ''
pubDate: 2026-07-25
---

Windows 10 1809 和 Windows 11 已经内置了 OpenSSH，不需要装第三方工具就能当 SSH 服务端用。本文记录完整的启用和配置流程。

## 检查是否已安装

先看看系统里有没有装好。以管理员身份打开 PowerShell，执行：

```powershell
Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'
```

输出会显示 OpenSSH Client 和 Server 的安装状态：

```
Name  : OpenSSH.Client~~~~0.0.1.0
State : Installed

Name  : OpenSSH.Server~~~~0.0.1.0
State : NotPresent
```

默认情况下 Client 是装好的，Server 需要手动安装。

## 安装 OpenSSH Server

在管理员 PowerShell 里运行：

```powershell
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
```

等安装完成后启动服务并设为开机自启：

```powershell
Start-Service sshd
Set-Service -Name sshd -StartupType 'Automatic'
```

验证一下服务是否在跑：

```powershell
Get-Service sshd
```

看到 `Running` 就对了。

## 防火墙配置

Windows 默认防火墙一般会自动添加 SSH 的入站规则，不过最好确认一下：

```powershell
New-NetFirewallRule -DisplayName 'OpenSSH Server (sshd)' -Direction Inbound -Protocol TCP -LocalPort 22 -Action Allow
```

如果提示规则已存在，说明 Windows 自动配好了，不用管。

## 连接测试

现在从另一台机器连过来试试：

```bash
ssh username@windows-ip
```

第一次连会提示确认主机指纹，输入 `yes`，然后输密码就登进去了。

## 配置密钥认证（推荐）

每次输密码挺烦的，配个密钥登录省事多了。

### 在客户端生成密钥

如果你还没有 SSH 密钥：

```bash
ssh-keygen -t ed25519 -C "windows-ssh"
```

一路回车就行。会生成 `~/.ssh/id_ed25519` 和 `~/.ssh/id_ed25519.pub`。

### 把公钥复制到 Windows

方式一：用 `ssh-copy-id`（如果客户端是 Linux/macOS）

```bash
ssh-copy-id username@windows-ip
```

方式二：手动复制

把 `id_ed25519.pub` 的内容追加到 Windows 上的 `C:\Users\你的用户名\.ssh\authorized_keys` 文件里。

Windows 上如果 `.ssh` 目录不存在，先建一个：

```powershell
mkdir $env:USERPROFILE\.ssh
notepad $env:USERPROFILE\.ssh\authorized_keys
```

然后粘贴公钥内容保存。

### 配置 sshd 允许密钥登录

检查 `C:\ProgramData\ssh\sshd_config`，确认这几项是设好的：

```
PubkeyAuthentication yes
PasswordAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
```

改完后重启服务：

```powershell
Restart-Service sshd
```

现在再连应该就不用输密码了。

### 关于 authorized_keys 权限

Windows 的 OpenSSH 对 `authorized_keys` 的权限要求比较严格，权限不对会直接忽略密钥认证。如果配好后仍然要输密码，去检查文件权限：

在 PowerShell 里重置一下：

```powershell
# 修复 authorized_keys 权限
icacls $env:USERPROFILE\.ssh\authorized_keys /inheritance:r /grant "$env:USERNAME:(R)"
```

## 关闭密码登录（可选）

配好密钥验证后，可以关掉密码登录来提高安全性。编辑 `C:\ProgramData\ssh\sshd_config`：

```
PasswordAuthentication no
```

然后重启服务：

```powershell
Restart-Service sshd
```

**改之前一定确保密钥登录能正常工作**，不然你可能会把自己锁在外面。

## 常见问题

### 连接被拒绝

```bash
ssh: connect to host xxx.xxx.xxx.xxx port 22: Connection refused
```

检查 sshd 服务是否在运行，以及防火墙 22 端口是否开放。

### 密钥登录失败 / 仍要输密码

最可能的原因是 `authorized_keys` 权限不对。按上面的 icacls 命令修复一下。

另外检查 `sshd_config` 里有没有被其他配置覆盖：

```
# 确保这行没有被注释掉
PubkeyAuthentication yes
```

### 修改 SSH 端口

如果你不想用默认的 22 端口，编辑 `C:\ProgramData\ssh\sshd_config`：

```
Port 2222
```

然后别忘了在防火墙里放行新端口：

```powershell
New-NetFirewallRule -DisplayName 'OpenSSH Server (2222)' -Direction Inbound -Protocol TCP -LocalPort 2222 -Action Allow
```

重启 sshd 生效。

## 卸载 OpenSSH Server

不用了可以随时卸掉：

```powershell
Remove-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
```

## 总结

Windows 自带的 OpenSSH 已经够用了，不用折腾 Cygwin 或者第三方 SSH 服务器。装好配好密钥登录，日常管理 Windows 远程机器就方便多了。

如果需要管理多台 Windows 机器，可以考虑配合 Ansible 统一管理，那就是另一个话题了喵~
