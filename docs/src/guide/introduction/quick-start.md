---
outline: deep
---

# 快速开始 {#quick-start}

本文介绍如何在本地启动 Smart Boot 前端项目。第一次启动时，请先完成[后端项目快速开始](../../smart-boot/introduction/quick-start.md)，确认后端已经在 `http://localhost:8080` 正常运行。

## 一、准备开发环境

请先安装以下工具：

- [Node.js](https://nodejs.org/en) `22.18.0` 及以上的 22.x 版本，或 `24.12.0` 及以上的 24.x 版本
- [Git](https://git-scm.com/)
- [pnpm](https://pnpm.io/) 11.x

打开终端并执行以下命令，确认工具已经安装：

```bash
node -v
git -v
pnpm -v
```

如果 `pnpm -v` 提示找不到命令，可执行：

```bash
npm install -g corepack
corepack enable
pnpm -v
```

::: danger 目录要求

存放代码的目录及其父目录不要包含中文、韩文、日文或空格，否则依赖安装或项目启动可能失败。

:::

## 二、获取源码

在准备存放代码的目录中打开终端，执行：

```bash
git clone https://codeup.aliyun.com/6497f4a8d2963c5649be7c62/smart-framework/smart-boot-ui-vben.git
cd smart-boot-ui-vben
```

如果克隆时提示没有权限，请先确认当前账号已经获得 Codeup 项目访问权限，并按照终端提示完成登录。

## 三、安装依赖

确认终端当前位于包含 `package.json` 的项目根目录，然后执行：

```bash
pnpm install
```

安装完成且终端没有出现红色错误信息，即表示依赖安装成功。项目只支持使用 `pnpm` 安装依赖，请勿改用 `npm install` 或 `yarn`。

如果因网络问题无法访问 npm 源，可临时指定镜像后重试：

::: code-group

```bash [macOS/Linux]
export COREPACK_NPM_REGISTRY=https://registry.npmmirror.com
pnpm install
```

```powershell [Windows PowerShell]
$env:COREPACK_NPM_REGISTRY="https://registry.npmmirror.com"
pnpm install
```

:::

## 四、启动前端

请先确认后端已经在 `http://localhost:8080` 启动，然后在前端项目根目录执行：

```bash
pnpm run dev:smart-boot
```

终端出现类似下面的地址，表示前端启动成功：

```text
Local: http://localhost:5666/
```

在浏览器地址栏输入 `http://localhost:5666`，使用以下开发环境默认账号登录：

```text
账号：admin
密码：SMARTboot&71264#@
```

::: warning 账号安全

默认账号密码仅用于本地开发环境。部署到共享或生产环境前，必须修改默认密码。

:::

前端开发服务器会把 `/api` 请求代理到 `http://localhost:8080`。如果页面能够打开但登录或接口请求失败，请优先确认后端是否已经正常启动。

## 五、停止项目

回到运行前端的终端窗口，按 `Ctrl+C` 即可停止项目。

## 六、常见问题

### `pnpm` 命令不存在

重新执行 `npm install -g corepack` 和 `corepack enable`，然后关闭并重新打开终端。

### Node.js 版本不符合要求

执行 `node -v` 检查版本。请切换到 Node.js 22.18.0+ 的 22.x 版本，或 Node.js 24.12.0+ 的 24.x 版本，再重新安装依赖。

### 端口 5666 已被占用

关闭占用该端口的程序后重新启动前端，或者修改 `apps/web-smart-boot/.env.development` 中的 `VITE_PORT`。

### 页面打开但接口请求失败

依次检查：

1. 后端终端是否仍在运行；
2. 后端是否监听 `8080` 端口；
3. `apps/web-smart-boot/vite.config.ts` 中的代理地址是否与后端地址一致；
4. 修改配置后是否重新启动了前端。
