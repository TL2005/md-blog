# 如何部署到Cloudflare Pages

*发布于: 2023-05-28*

Cloudflare Pages是一个JAMstack平台，可以让你轻松地部署静态网站。本文将介绍如何将我们的Markdown博客部署到Cloudflare Pages。

## 准备工作

在开始之前，你需要：

1. 一个Cloudflare账户
2. 一个GitHub账户
3. 已经将博客代码推送到GitHub仓库

## 部署步骤

### 1. 登录Cloudflare Dashboard

首先，访问[Cloudflare Dashboard](https://dash.cloudflare.com/)并登录你的账户。

### 2. 创建新的Pages项目

1. 在左侧菜单中点击"Pages"
2. 点击"创建项目"按钮
3. 选择"连接到Git"

### 3. 连接GitHub仓库

1. 点击"连接GitHub账户"并授权Cloudflare访问你的GitHub仓库
2. 从列表中选择包含你博客代码的仓库

### 4. 配置构建设置

在配置页面中，设置以下参数：

- **项目名称**: 你的博客名称（例如：my-markdown-blog）
- **生产分支**: main（或master，取决于你的默认分支）
- **构建命令**: `npm run build`
- **构建输出目录**: `dist`
- **环境变量**: 通常不需要额外的环境变量

### 5. 开始构建

点击"保存并部署"按钮开始构建过程。Cloudflare会自动从你的GitHub仓库拉取代码，运行构建命令，并部署生成的静态文件。

### 6. 查看部署状态

构建过程可能需要几分钟时间。完成后，你会看到一个成功的部署消息，以及你的网站URL（通常是`项目名称.pages.dev`）。

## 自定义域名（可选）

如果你想使用自己的域名而不是Cloudflare提供的默认域名，可以按照以下步骤操作：

1. 在项目页面中，点击"自定义域"
2. 输入你想要使用的域名
3. 按照Cloudflare的指示配置DNS记录

## 自动部署

Cloudflare Pages会自动监控你的GitHub仓库。每当你推送新的提交到指定分支时，Cloudflare会自动触发新的构建和部署。

## 查看构建日志

如果部署过程中出现问题，你可以查看构建日志来诊断问题：

1. 在项目页面中，点击特定的部署
2. 查看"构建日志"部分

## 总结

通过Cloudflare Pages，你可以轻松地将Markdown博客部署到全球CDN网络，享受快速、安全的静态网站托管服务。整个过程只需几分钟，而且完全免费。

一旦部署完成，你只需要专注于创作Markdown内容，将其推送到GitHub仓库，Cloudflare会自动处理剩下的部署工作。