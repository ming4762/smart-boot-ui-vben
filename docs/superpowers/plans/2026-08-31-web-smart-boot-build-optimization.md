# Web Smart Boot 构建与首屏加载优化方案

> 文档日期：2026-08-31  
> 目标应用：`apps/web-smart-boot`  
> 文档性质：实施方案，不包含代码变更  
> 优化原则：减少启动关键路径，而不是单纯减少构建文件总数

## 1. 背景与结论

当前 `apps/web-smart-boot` 加载较慢的主要原因，不是路由懒加载本身，而是应用启动阶段一次性引入了表格导出、富文本编辑器、代码编辑器、完整表格体系等非首屏能力。

构建产物虽然实现了代码拆分，但启动模块依赖面过宽，Vite 在加载 `bootstrap` 时生成了大量 `modulepreload` 资源。仓库内的参考 Nginx 配置又未默认开启压缩和静态资源长期缓存，可能进一步放大弱网和高延迟环境下的问题。

本方案的核心方向是：

1. 建立可自动执行的构建性能预算。
2. 将 ExcelJS、编辑器等重型能力移出启动关键路径。
3. 将 SmartTable 从全局启动能力调整为按使用初始化的深模块。
4. 收窄 Smart Modules 页面扫描范围，减少无意义的动态入口。
5. 在启动依赖精简后，再调整 Vite chunk 分组。
6. 补齐压缩、缓存和 HTTP/2/HTTP/3 等交付层能力。

## 2. 当前构建基线

生产构建命令：

```bash
pnpm -F @vben/web-smart-boot run build
```

当前实测数据：

| 指标 | 当前值 |
|---|---:|
| 转换模块数量 | 9,794 |
| 启动入口及 preload 资源 | 164 个 |
| 启动 JS | 159 个 |
| 启动 CSS | 5 个 |
| 小于 5 KB 的启动资源 | 99 个 |
| 启动资源原始体积 | 5,569 KB |
| 启动资源理论 gzip 体积 | 1,604 KB |
| `bootstrap` 原始体积 | 1,590 KB |
| 构建目录 JS 总数 | 433 个 |
| 构建目录 CSS 总数 | 54 个 |
| 构建目录总体积 | 约 12 MB |

### 2.1 第一阶段性能预算

第一轮改造建议采用相对宽松的预算：

| 指标 | 第一阶段预算 |
|---|---:|
| 启动资源数量 | ≤ 80 |
| 启动 gzip 体积 | ≤ 1,000 KB |
| `bootstrap` gzip 体积 | ≤ 300 KB |
| 小于 5 KB 的启动资源 | ≤ 30 |

### 2.2 最终目标

| 指标 | 最终目标 |
|---|---:|
| 启动资源数量 | 30–50 个 |
| 启动 gzip 体积 | 500–700 KB |
| `bootstrap` gzip 体积 | ≤ 200 KB |
| 小于 5 KB 的启动资源 | ≤ 15 个 |
| 首屏包含 ExcelJS | 否 |
| 首屏包含 Tiptap/ProseMirror | 否 |
| 首屏包含 Tinymce | 否 |
| 首屏包含 CodeMirror 语言包 | 否 |

性能预算应作为防回退指标，而不是要求一次改造直接达到最终值。

## 3. 目标加载架构

建议将当前启动过程调整为以下结构：

```text
main.ts
  └── 应用基础启动
      ├── preferences
      ├── Vue / Router / Pinia
      ├── 国际化
      ├── 认证与权限
      ├── 基础布局
      └── 首屏基础组件

首次进入表格页面
  └── SmartTable Core
      ├── VXE Table
      ├── Antdv renderer
      ├── 表格基础样式
      └── 表格配置存储

用户首次点击 XLSX 导出
  └── XLSX Export Adapter
      ├── @vxe-ui/plugin-export-xlsx
      └── ExcelJS

页面首次使用编辑器
  ├── Tiptap
  ├── Tinymce
  ├── Markdown
  └── CodeMirror
```

### 3.1 建议保留的外部 interface

外部调用者只需要了解少量稳定 interface：

```ts
initApplication(): Promise<void>
ensureSmartTable(): Promise<void>
ensureXlsxExport(): Promise<void>
```

以下复杂度应隐藏在模块 implementation 内：

- 动态 import。
- 并发初始化去重。
- 初始化顺序。
- 重复注册保护。
- 加载失败后的重试。
- 加载状态和错误提示。
- 微前端环境下的实例隔离。

不要把初始化细节分散到每个业务页面，否则会形成大量浅模块和隐含调用顺序。

## 4. 阶段一：建立构建性能检测

### 4.1 新增启动资源分析脚本

建议新增：

```text
scripts/performance/analyze-initial-assets.mjs
```

脚本应完成：

1. 读取 `apps/web-smart-boot/dist/index.html`。
2. 定位应用入口 JS。
3. 解析入口生成的 preload 依赖。
4. 递归分析启动静态依赖。
5. 统计 JS、CSS、字体和图片资源数量。
6. 统计原始、gzip 和 Brotli 体积。
7. 输出最大的前 20 个启动资源。
8. 输出小于 5 KB 的资源数量。
9. 检测禁止进入首屏的重型依赖。
10. 超出性能预算时以非零状态退出。

建议检查的禁止项：

```text
exceljs
@vxe-ui/plugin-export-xlsx
@tiptap
prosemirror
tinymce
codemirror language packages
echarts（首屏不展示图表时）
```

### 4.2 建议增加的命令

```json
{
  "scripts": {
    "build:smart-boot:analyze": "...",
    "check:smart-boot:bundle": "..."
  }
}
```

### 4.3 CI 检查

建议 CI 执行：

```bash
pnpm -F @vben/web-smart-boot run build
pnpm run check:smart-boot:bundle
```

CI 输出至少包含：

```text
启动资源数量
启动原始体积
启动 gzip 体积
bootstrap 体积
最大资源列表
禁止依赖检查结果
相对基线的变化百分比
```

### 4.4 验收标准

- 本地和 CI 可以执行相同的检测命令。
- 相同构建产物的检测结果稳定。
- 超过预算时构建检查失败。
- 输出能够明确指出新增的大型依赖。

## 5. 阶段二：将 ExcelJS 移出启动路径

这是优先级最高、预期收益最大的改造。

### 5.1 当前问题

当前 `smart-common-page/src/adapter/smart-table.ts` 静态导入：

```ts
import VxeUIPluginExportXLSX from '@vxe-ui/plugin-export-xlsx';
import ExcelJS from 'exceljs';
```

并在全局 SmartTable 初始化时注册：

```ts
.use(VxeUIPluginExportXLSX, { ExcelJS })
```

构建分析显示，仅 ExcelJS 就在 `bootstrap` 中贡献约 1.29 MB 的模块渲染体积，估算 gzip 约 279 KB。

### 5.2 模块拆分

建议拆分为：

```text
adapter/
├── smart-table.ts
└── smart-table-xlsx.ts
```

#### `smart-table.ts`

只负责：

- SmartTable 基础配置。
- VXE Table 基础初始化。
- Antdv renderer。
- 用户配置存储。
- 国际化。
- 消息处理。
- 权限处理。

不得静态依赖：

```text
exceljs
@vxe-ui/plugin-export-xlsx
```

#### `smart-table-xlsx.ts`

负责：

- 动态加载 ExcelJS。
- 动态加载 XLSX 插件。
- 注册 XLSX 导出能力。
- 保证只初始化一次。
- 处理多个导出操作的并发初始化。
- 初始化失败后允许重试。

建议外部 interface：

```ts
ensureXlsxExport(): Promise<void>
```

implementation 内应缓存初始化 Promise，避免连续点击产生重复下载和重复注册。

### 5.3 加载时机

推荐顺序：

1. 用户首次点击“导出 XLSX”时加载。
2. 用户打开包含导出操作的菜单时预加载。
3. 进入明确需要导出的页面后，在浏览器空闲阶段预加载。

不建议只把静态 import 改为在 `bootstrap()` 中立即执行的动态 import，因为启动阶段仍然会下载，无法缩短关键路径。

### 5.4 用户体验

首次导出应提供明确状态：

```text
点击导出
  → 禁用重复点击
  → 显示“正在加载导出模块”
  → 加载成功后继续导出
  → 加载失败后恢复按钮并提供重试
```

### 5.5 风险与回滚

风险：

- VXE 插件可能要求在表格实例创建前注册。
- 第一次导出可能产生可感知等待。
- 微前端多实例可能重复注册插件。

应对：

- 先验证插件是否支持运行期注册。
- 如果不支持，将 XLSX Adapter 延迟到进入具有导出能力的页面时，而不是点击时。
- 使用模块级 Promise 和注册标记保证幂等。
- 保留原同步注册方式作为独立回滚提交。

### 5.6 验收标准

- 登录页不加载 ExcelJS。
- 普通页面不点击导出时不加载 ExcelJS。
- 首次导出成功且有加载反馈。
- 第二次导出不重复加载或注册。
- 导出文件格式、样式、合并单元格和数据类型与改造前一致。
- `bootstrap` gzip 预计至少下降约 250–300 KB。

## 6. 阶段三：重构组件适配器

### 6.1 当前问题

`smart-common-page/src/adapter/component/index.ts` 静态引入：

- `VbenTiptap`
- `SmartCodeEditor`
- `SmartPulldownTable`
- `VCropper`
- `IconPicker`
- 多个 Smart 业务组件

`bootstrap()` 在应用挂载前执行完整 `initComponentAdapter()`，导致所有静态依赖进入启动关键路径。

### 6.2 建议内部结构

```text
adapter/component/
├── index.ts
├── core-components.ts
├── async-components.ts
├── editor-components.ts
└── business-components.ts
```

#### `core-components.ts`

只保留首屏高频基础能力：

- Button
- Input
- Select
- Checkbox
- Radio
- Switch
- 基础消息提示
- 登录和基础布局明确需要的组件

#### `editor-components.ts`

全部采用异步加载：

- RichEditor/Tiptap
- SmartTinymceEditor
- SmartMarkdown
- SmartCodeEditor

#### `business-components.ts`

按实际体积和使用频率异步化：

- SmartPulldownTable
- SmartTableSelectUser
- IconPicker
- Cropper
- 复杂上传组件
- 日期和范围日期组件

外部仍然只暴露：

```ts
initComponentAdapter(): Promise<void>
```

拆分属于内部 implementation，不应要求 `bootstrap` 了解多个适配器的初始化顺序。

### 6.3 Tiptap

当前静态导入：

```ts
import { VbenTiptap } from '@vben/plugins/tiptap';
```

建议改为 Vue 异步组件，同时保持现有上传配置包装。

注意事项：

- Props 类型使用 `import type`。
- 不要通过会加载运行时代码的 barrel 入口获取纯类型。
- 编辑器加载时显示固定高度骨架，避免布局跳动。
- 加载失败时提供重试能力。
- 图片上传回调、`v-model` 和表单校验行为必须保持一致。

### 6.4 SmartCodeEditor

建议：

- 改成异步组件。
- 优先从代码编辑器模块的独立入口加载，避免大型公共 barrel。
- 继续按语言动态加载 CodeMirror 语言包。

期望行为：

```text
打开 JSON 编辑器 → 加载 JSON 语言包
打开 SQL 编辑器  → 加载 SQL 语言包
未打开编辑器     → 不加载 CodeMirror
```

### 6.5 SmartPulldownTable

如果组件依赖 SmartTable 初始化，组件内部应调用：

```ts
await ensureSmartTable();
```

不要要求业务页面手动记住初始化顺序。

### 6.6 验收标准

- 登录页不加载 Tiptap、ProseMirror、Tinymce、CodeMirror。
- 非编辑器页面不加载编辑器资源。
- 第一次打开编辑器时只产生一次加载。
- 编辑器加载失败后可以重试。
- 表单校验、上传和数据绑定行为不变。
- 组件注册表仍能按原组件名称解析组件。

## 7. 阶段四：将 SmartTable 初始化移出全局启动

### 7.1 当前问题

当前调用链：

```text
bootstrap()
  → initComponentAdapter()
    → doSetupSmartTable()
      → VXE Table
      → Antdv renderer
      → XLSX plugin
      → ExcelJS
```

登录页、退出成功页和错误页即使不使用表格，也必须承担完整表格体系的下载和初始化成本。

### 7.2 建议的 SmartTable 深模块

建议定义：

```ts
ensureSmartTable(): Promise<void>
```

该模块的 interface 应承诺：

- 第一次调用执行初始化。
- 后续调用复用初始化结果。
- 并发调用只初始化一次。
- 初始化失败后允许重试。
- 调用者无需了解插件注册顺序。
- 微前端环境中不会污染错误的应用实例。

### 7.3 推荐 seam

优先将 seam 放在 SmartTable 自身的创建流程：

```text
useSmartTable()
  → ensureSmartTable()
  → 创建表格
```

这样业务页面继续使用原有表格 interface，不需要在所有页面的 `onMounted()` 中复制初始化逻辑。

如果现有 `useSmartTable()` 必须同步返回，可以采用：

1. 保留最小同步注册。
2. 将大型 renderer 和可选插件延迟。
3. 或由异步 SmartTable 外层组件等待初始化。

### 7.4 验收标准

- 登录页不加载 VXE Table。
- 不使用表格的 Dashboard 不加载 VXE Table。
- 第一次进入表格页面正常显示。
- 多个表格并发挂载不会重复初始化。
- 主应用和微前端子应用不会重复注册或互相覆盖。
- 表格配置存储、国际化、权限和消息提示行为不变。

## 8. 阶段五：收窄 Smart Modules 扫描范围

### 8.1 当前问题

当前虚拟模块扫描：

```ts
smart-module-*/src/**/*.{vue,tsx}
```

这会为以下文件生成动态入口：

- 路由页面。
- 页面内部组件。
- Modal 和 Drawer。
- 表单子组件。
- 非路由 TSX。
- 只被其他页面使用的内部组件。

这是构建目录出现数百个 JS 文件的重要原因之一。

### 8.2 短期方案：排除非页面文件

在完成页面清单盘点后，逐步排除：

```text
**/components/**
**/*Modal.vue
**/*Drawer.vue
**/*.config.tsx
**/__tests__/**
**/internal/**
```

修改前必须将当前虚拟页面 key 与后端菜单返回的 `component` 字段进行比对，避免误删可路由页面。

### 8.3 长期方案：显式页面清单

每个业务模块维护页面清单：

```text
smart-module-system/src/pages.ts
smart-module-message/src/pages.ts
smart-module-file/src/pages.ts
```

概念结构：

```ts
export const pages = {
  '/smart-boot/.../UserListView.vue': () => import('./...'),
};
```

构建插件只合并这些清单，不再扫描所有 Vue/TSX 文件。

优点：

- 页面身份明确。
- 内部组件不会成为动态路由入口。
- 后端菜单路径可在构建期校验。
- 页面重命名时更容易发现遗漏。

代价：

- 新增页面需要维护清单。
- 需要迁移和校验现有后端组件路径。

### 8.4 构建期校验

虚拟模块应检查：

- 页面 key 是否重复。
- 文件是否存在。
- 是否错误包含 `components` 目录。
- 页面 key 是否符合统一格式。
- 后端配置使用的页面 key 是否能匹配前端页面。

### 8.5 验收标准

- 动态页面 key 与后端返回值全部匹配。
- 构建目录 JS 数量明显下降。
- 内部 Modal 和子组件不再作为路由入口。
- 所有动态菜单仍然可以打开。
- 404、403 和微前端页面映射不受影响。

## 9. 阶段六：调整 Vite 拆包策略

### 9.1 不建议优先执行

不建议直接关闭：

```ts
modulePreload: false
```

关闭 preload 不能减少必需代码，只可能把并行请求变成串行请求瀑布。

也不建议将所有依赖合成单一 `vendor.js`，否则会造成：

- 首屏下载更多非必要代码。
- 单文件解析和执行时间增加。
- 任意依赖更新导致整个 vendor 缓存失效。

### 9.2 执行顺序

先完成：

1. ExcelJS 延迟加载。
2. 编辑器异步加载。
3. SmartTable 延迟初始化。
4. 页面扫描范围收窄。

然后再根据剩余的首屏依赖图合并小 chunk。

### 9.3 建议 chunk 分组

可评估以下稳定分组：

```text
framework
  vue
  vue-router
  pinia

ui-core
  首屏实际使用的 Antdv 公共代码

app-core
  preferences
  access
  request
  locales

table-core
  VXE Table
  仅进入表格页面后加载

editor-*
  各编辑器独立异步 chunk
```

不要按每个 npm 包生成一个 chunk，否则仍会产生大量小请求。

### 9.4 构建告警

当前通用配置使用：

```ts
chunkSizeWarningLimit: 2000
reportCompressedSize: false
```

建议：

- 普通构建告警阈值调整为 700–1000 KB。
- analyze 模式启用压缩体积报告。
- CI 使用独立性能预算，不只依赖 Vite warning。
- 普通生产构建可关闭压缩统计以保持构建速度。

### 9.5 验收标准

- 首屏不存在明显的串行 chunk 瀑布。
- 没有为了减少请求而引入超大 vendor。
- framework chunk 缓存稳定。
- 重型异步模块不会被公共 chunk 反向拉回首屏。

## 10. 阶段七：部署层优化

### 10.1 开启压缩

仓库参考 Nginx 配置中的 gzip 当前被注释。建议至少开启：

```nginx
gzip on;
gzip_vary on;
gzip_comp_level 6;
gzip_min_length 1024;
gzip_types
  text/css
  application/javascript
  application/json
  image/svg+xml;
```

如果外层网关或 CDN 支持 Brotli，优先由网关/CDN 提供 Brotli。

如果采用构建期预压缩，需要同时保证：

- 生产环境生成 `.gz`/`.br` 文件。
- Nginx 开启静态压缩文件支持。
- CDN 不会重复压缩。

### 10.2 缓存策略

带内容 hash 的资源：

```text
/js/*
/css/*
/assets/*
```

建议：

```nginx
Cache-Control: public, max-age=31536000, immutable
```

以下资源不应长期强缓存：

```text
/index.html
/_app-config-*.js
```

建议：

```nginx
Cache-Control: no-cache
```

### 10.3 HTTP 协议

浏览器到外部网关/CDN 的连接建议使用 HTTP/2 或 HTTP/3。

容器内部使用 HTTP/1.1 并不一定构成问题，关键是浏览器 Network 的 Protocol 列是否显示 `h2` 或 `h3`。

### 10.4 验收标准

浏览器 Network 应观察到：

```text
Content-Encoding: br 或 gzip
Protocol: h2/h3
带 hash 资源: immutable 长缓存
index.html: no-cache 或重新验证
```

## 11. 阶段八：受控预取

只有在真正完成延迟加载后，才建议增加预取。

### 11.1 推荐时机

- 用户登录成功后。
- 首屏渲染完成且主线程空闲时。
- 用户悬停菜单时。
- 用户展开菜单分组时。
- 网络环境允许且未开启节省流量时。

### 11.2 可以预取

- 默认首页。
- 用户高频访问页面。
- 当前展开菜单的第一层页面。
- 表格基础模块。

### 11.3 不建议预取

- ExcelJS。
- Tinymce。
- Tiptap。
- 用户未访问的 CodeMirror 语言包。
- 用户没有权限的页面。
- 全部菜单页面。

## 12. 文件级修改清单

| 文件或模块 | 建议修改 |
|---|---|
| `apps/web-smart-boot/src/main.ts` | 保持最小启动逻辑，评估减少二阶段启动瀑布 |
| `apps/web-smart-boot/src/bootstrap.ts` | 不再等待完整表格和编辑器初始化 |
| `smart-common-page/src/adapter/component/index.ts` | 拆分基础组件与重型异步组件 |
| `smart-common-page/src/adapter/smart-table.ts` | 移除 ExcelJS 和 XLSX 插件静态依赖 |
| `smart-common-page/src/adapter/smart-table-xlsx.ts` | 新增按需导出 Adapter |
| SmartTable 创建模块 | 增加 `ensureSmartTable()` 幂等初始化 |
| CodeEditor 注册位置 | 改为异步组件和独立模块入口 |
| Tiptap 注册位置 | 改为异步组件 |
| `virtual-smart-modules.ts` | 收窄扫描范围或读取显式页面清单 |
| `internal/vite-config/src/config/common.ts` | 收紧告警并增加分析模式指标 |
| `apps/web-smart-boot/.env.production` | 根据交付方式启用预压缩 |
| `scripts/deploy/nginx.conf` | 开启压缩和正确的缓存策略 |
| 根目录 `package.json` | 增加构建性能检测命令 |
| CI 配置 | 增加 bundle budget 检查 |

## 13. 测试与回归范围

### 13.1 功能回归

必须覆盖：

- 普通登录。
- IAM 登录。
- 退出成功页。
- 权限路由生成。
- 动态菜单页面。
- 微前端主应用模式。
- 微前端子应用模式。
- 普通表格。
- 多表格同时挂载。
- 表格导出 XLSX。
- Tiptap 编辑和图片上传。
- Tinymce。
- Markdown。
- CodeEditor 各语言模式。
- 日期和范围选择。
- 文件上传。
- 用户选择组件。

### 13.2 性能回归

分别测试：

- 冷缓存登录页。
- 冷缓存默认首页。
- 热缓存默认首页。
- 首次进入表格页面。
- 首次打开编辑器。
- 首次点击 XLSX 导出。
- 弱网和高延迟。
- HTTP/1.1 与 HTTP/2 对比。

建议关注：

- 请求数量。
- 传输体积。
- LCP。
- INP。
- Long Task。
- JS Parse/Compile/Evaluate。
- 主线程阻塞时间。
- 缓存命中率。

## 14. 提交与回滚策略

建议按以下顺序形成独立提交：

```text
提交 1：增加构建性能分析和预算
提交 2：ExcelJS/XLSX 按需加载
提交 3：Tiptap 和 CodeEditor 异步加载
提交 4：SmartTable 延迟初始化
提交 5：组件适配器内部重构
提交 6：收窄虚拟模块扫描范围
提交 7：调整 chunk 分组
提交 8：部署压缩与缓存配置
提交 9：增加受控预取
```

每个提交应满足：

- 可以独立构建。
- 可以独立回滚。
- 包含修改前后的性能数据。
- 不同时混入无关业务修改。
- 功能回归通过后再进入下一阶段。

不建议把所有优化合入单个大型提交，否则出现兼容问题时难以定位是加载时机、插件注册还是拆包配置导致。

## 15. 推荐实施顺序

### 第一批：低风险、高收益

1. 建立性能预算脚本。
2. ExcelJS/XLSX 按需加载。
3. Tiptap 按需加载。
4. SmartCodeEditor 按需加载。
5. 开启压缩和静态缓存。

### 第二批：中等风险

1. SmartTable 延迟初始化。
2. 拆分组件适配器 implementation。
3. 调整核心 chunk 分组。

### 第三批：结构性修改

1. 收窄虚拟模块扫描范围。
2. 建立显式页面清单。
3. 增加后端菜单与页面映射校验。
4. 增加登录后的受控预取。

## 16. 预期收益

完成第一批后，合理预期：

- `bootstrap` 体积明显下降。
- 首屏移除 ExcelJS 和 ProseMirror。
- 启动 gzip 体积下降约 400–700 KB。
- 启动资源数量下降至约 80 个以内。
- 弱网首屏加载改善明显。

完成第二、三批后，目标是：

- 启动资源控制在 30–50 个。
- 启动 gzip 体积控制在 500–700 KB。
- 登录页只加载框架、认证、基础 UI 和国际化。
- 表格、编辑器、图表和导出能力仅在需要时加载。
- 构建文件总数显著下降，同时保留真正有价值的路由懒加载。

## 17. 最终验收清单

- [ ] 构建性能预算已加入 CI。
- [ ] 首屏不包含 ExcelJS。
- [ ] 首屏不包含 Tiptap/ProseMirror。
- [ ] 首屏不包含 Tinymce。
- [ ] 首屏不包含未使用的 CodeMirror 语言包。
- [ ] 登录页不加载 VXE Table。
- [ ] SmartTable 初始化幂等且支持并发调用。
- [ ] 首次 XLSX 导出有加载反馈且结果正确。
- [ ] 动态菜单页面映射完整。
- [ ] 内部 Modal 和子组件不再成为路由入口。
- [ ] 没有通过关闭 modulepreload 制造串行瀑布。
- [ ] 没有生成包含所有依赖的巨型 vendor chunk。
- [ ] JS/CSS 使用 gzip 或 Brotli。
- [ ] 浏览器到网关使用 HTTP/2 或 HTTP/3。
- [ ] 带 hash 的资源使用 immutable 长缓存。
- [ ] `index.html` 和运行时配置不会被长期强缓存。
- [ ] 冷缓存、热缓存、弱网和微前端场景均完成回归。

