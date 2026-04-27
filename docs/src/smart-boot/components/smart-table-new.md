---
outline: deep
---

# Smart Table

Smart Table 基于 [vxe-table](https://vxetable.cn/) 进行二次封装，关于 vxe-table 请参考官方文档，本文档只列出与 vxe-table 不同的部分。

## 一、初始化与适配

通过适配器适配和初始化表格，示例如下：

::: details vxe-table 表格适配器

```typescript
import type { SmartAuthType } from '@vben/types';

import { computed, unref } from 'vue';

import { useAccess } from '@vben/access';
import {
  globalShareState,
  setupSmartTable,
  useSmartTable,
} from '@vben/common-ui';
import { usePreferences } from '@vben/preferences';

import VxeUIPluginRenderAntd from '@vxe-ui/plugin-render-antd-smart-boot';

import { $ct as t } from '#/locales';

import { SmartTableCustomStorageDBPlugin } from './plugins/smart-table-custom-storage-plugin';

const preference = usePreferences();

const doSetupSmartTable = () => {
  setupSmartTable({
    configSmartTable: (vxeUI) => {
      vxeUI
        .use(VxeUIPluginRenderAntd, {
          componentProvider: (name: string) => {
            if (name.startsWith('A')) {
              return globalShareState.getComponents()[name.slice(1)];
            }
            return globalShareState.getComponents()[name];
          },
        })
        .use(SmartTableCustomStorageDBPlugin)
        .setConfig({ size: 'small' });
    },
    // 国际化、语言、主题依赖的响应式字段
    watcherField: computed(() => ({
      locale: unref(preference.locale),
      theme: unref(preference.theme),
    })),
    // 组件提供函数
    componentHandler: (name) => globalShareState.getComponents()[name],
    // i18n 处理器
    i18nHandler: (key: string, args?: any) => t(key, args),
    // 消息适配器
    messageHandler: {
      success: (message: string) =>
        globalShareState.getMessage().success?.(message),
      warning: (message: string) =>
        globalShareState.getMessage().warning?.(message),
      error: (message: string) =>
        globalShareState.getMessage().error?.(message),
      confirm: (options: Record<string, any>) =>
        globalShareState.getMessage().confirm?.(options),
    },
    // 权限适配器
    permissionHandler: (code?: SmartAuthType) => {
      if (!code) return true;
      const { hasAccessByAuth } = useAccess();
      return hasAccessByAuth(code);
    },
  });
};

export { doSetupSmartTable, useSmartTable };

export type {
  SmartSearchFormSchema,
  SmartTableActionItem,
  SmartTableColumn,
  SmartTableProps,
} from '@vben/common-ui';

export {
  getTableBooleanColumnClass,
  getTableUseYnColumnClass,
  SmartVxeTableAction,
} from '@vben/common-ui';
```

:::

## 二、基础使用

### 1. 快速开始

```typescript
<script setup lang="ts">
import { useSmartTable } from '#/adapter/smart-table';

const [SmartTable, tableApi] = useSmartTable({
  id: 'my-table', // 唯一标识，用于存储用户偏好设置
  columns: getTableColumns(),
  proxyConfig: {
    ajax: {
      query: (params) => listApi(params.ajaxParameter),
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      save: ({ body: { insertRecords, updateRecords } }) =>
        batchSaveUpdateApi([...insertRecords, ...updateRecords]),
      getById: (model) => getByIdApi(model),
    },
  },
});
</script>

<template>
  <SmartTable />
</template>
```

### 2. 完整示例

::: details 查看完整示例

```typescript
<script setup lang="ts">
import type { SmartTableActionItem } from '@vben/common-ui';

import { SmartVxeTableAction, useSmartTable } from '@vben/common-ui';

const [SmartTable, tableApi] = useSmartTable({
  id: 'sys_user_list',
  columns: [
    { type: 'checkbox', width: 60, fixed: 'left' },
    { title: '用户名', field: 'username', width: 120, fixed: 'left' },
    { title: '姓名', field: 'fullName', width: 120 },
    { title: '邮箱', field: 'email', minWidth: 160 },
    { title: '状态', field: 'useYn', ...getTableUseYnColumnClass() },
    { title: '操作', field: 'operation', width: 120, fixed: 'right', slots: { default: 'table-operation' } },
  ],
  border: true,
  stripe: true,
  height: 'auto',
  pagerConfig: true,
  checkboxConfig: true,
  useSearchForm: true,
  searchFormConfig: {
    schema: getSearchSchemas(),
    searchWithSymbol: true,
    layout: 'inline',
    commonConfig: { labelWidth: 80 },
  },
  proxyConfig: {
    ajax: {
      query: (params) => listApi(params.ajaxParameter),
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      save: ({ body: { insertRecords, updateRecords } }) =>
        batchSaveUpdateApi([...insertRecords, ...updateRecords]),
      getById: (model) => getByIdApi(model),
    },
  },
  toolbarConfig: {
    refresh: true,
    zoom: true,
    custom: true,
    sizeSetting: true,
    buttons: [
      { code: 'ModalAdd', auth: 'sys:user:save' },
      { code: 'delete', auth: 'sys:user:delete' },
    ],
  },
  addEditConfig: {
    formConfig: { schema: getAddEditFormSchemas() },
  },
});

const getTableActions = (row: any): SmartTableActionItem[] => [
  { code: 'edit', auth: 'sys:user:update', onClick: () => tableApi.editByRowModal(row) },
  { code: 'delete', auth: 'sys:user:delete', onClick: () => tableApi.deleteByRow(row) },
];
</script>

<template>
  <SmartTable>
    <template #table-operation="{ row }">
      <SmartVxeTableAction :actions="getTableActions(row)" />
    </template>
  </SmartTable>
</template>
```

:::

## 三、核心配置说明

### 1. 列配置 (SmartTableColumn)

SmartTableColumn 继承自 vxe-table 的 `VxeGridPropTypes.Column`，扩展属性如下：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `component` | `string` | 列内置渲染组件：`booleanTag \| button \| copyText \| switch \| tag \| useYnTag` |
| `componentProps` | `Record<string, any> \| Function` | 内置组件 props，支持函数动态返回 |
| `dynamicClass` | `string \| Function` | 动态 class，函数参数为 `{ row, column, rowIndex, ... }` |
| `dynamicStyle` | `Function` | 动态 style |
| `formatter` | `'date' \| 'datetime' \| [type, format] \| VxeFormatter` | 列格式化 |
| `autoClass` | `'Boolean'` | 自动 class，`Boolean` 时根据值自动添加颜色样式 |
| `editRender` | `SmartTableEditRender` | 可编辑列配置，扩展了 `required`、`rules`、`stopEnterBubbling` |
| `type` | `string` | 列类型，在 vxe-table 基础上扩展了 `date`、`dateTime` |
| `flag` | `string` | 列标识：`ACTION \| CHECKBOX \| DEFAULT \| INDEX \| RADIO` |

**可编辑列 editRender 扩展属性：**

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `name` | `SmartTableEditRenderName` | - | 编辑组件，支持 `AInput \| ASelect \| ADatePicker \| ASwitch` 等 antd 组件 |
| `required` | `boolean` | - | 是否必填 |
| `rules` | `VxeTableDefines.ValidatorRule[]` | - | 校验规则 |
| `stopEnterBubbling` | `boolean` | `true` | 是否阻止回车键冒泡，阻止后回车不会跳至下一行 |

```typescript
const columns: SmartTableColumn[] = [
  { type: 'checkbox', width: 60 },
  { type: 'seq', width: 60 },
  {
    title: '用户名',
    field: 'username',
    width: 120,
    fixed: 'left',
    sortable: true,
  },
  // 日期格式化
  { title: '创建时间', field: 'createTime', width: 160, formatter: 'datetime' },
  // 动态样式
  {
    title: '状态',
    field: 'useYn',
    width: 80,
    align: 'center',
    dynamicClass: ({ row }) =>
      row.useYn ? 'text-color--success-bold' : 'text-color--danger-bold',
    formatter: ({ row }) => (row.useYn ? '启用' : '停用'),
  },
  // 内置组件渲染
  {
    title: '开关',
    field: 'enable',
    component: 'switch',
    componentProps: (params) => ({
      onChange: (val: boolean) => handleChange(params.row, val),
    }),
    width: 80,
    align: 'center',
  },
  // 可编辑列
  {
    title: '备注',
    field: 'remark',
    minWidth: 120,
    editRender: { name: 'AInput', autofocus: true, required: true },
  },
  {
    title: '操作',
    field: 'operation',
    width: 120,
    fixed: 'right',
    slots: { default: 'table-operation' },
  },
];
```

### 2. 搜索表单配置 (searchFormConfig)

`searchFormConfig` 类型为 `SmartSearchFormProps`，继承自 `VbenFormProps`，扩展属性如下：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `schema` | `SmartSearchFormSchema[]` | - | 搜索表单项配置 |
| `searchWithSymbol` | `boolean` | `false` | 参数是否携带查询符号（如 `username@like`） |
| `defaultVisible` | `boolean` | `true` | 默认是否显示搜索表单 |
| `visible` | `boolean` | - | 是否显示 |
| `separator` | `boolean \| object` | - | 搜索区域与表格之间是否显示分隔线 |

`SmartSearchFormSchema` 继承自 `VbenFormSchema`，扩展了 `searchSymbol` 和 `customSymbol`：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `searchSymbol` | `SearchSymbol` | 查询符号：`like \| likeLeft \| likeRight \| = \| <> \| > \| >= \| < \| <= \| between \| in \| notIn \| notLike \| groupBy` |
| `customSymbol` | `Function` | 自定义符号处理，返回 `Record<string, any>` |

```typescript
searchFormConfig: {
  searchWithSymbol: true,
  layout: 'inline',
  schema: [
    {
      label: '用户名',
      fieldName: 'username',
      component: 'Input',
      searchSymbol: 'like',
      componentProps: { placeholder: '请输入用户名', style: { width: '150px' } },
    },
    {
      label: '状态',
      fieldName: 'useYn',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: '启用', value: 1 },
          { label: '停用', value: 0 },
        ],
      },
    },
    {
      label: '创建时间',
      fieldName: 'createTime',
      component: 'RangePicker',
      searchSymbol: 'between',
    },
  ],
},
```

### 3. 数据代理配置 (proxyConfig)

`proxyConfig` 类型为 `SmartTableProxyConfig`，继承自 vxe-table 的 `VxeGridPropTypes.ProxyConfig`，`ajax` 扩展如下：

| ajax 属性 | 类型 | 说明 |
| --- | --- | --- |
| `query` | `Function` | 列表查询，参数中 `ajaxParameter` 包含合并后的搜索参数 |
| `delete` | `Function` | 删除，`body.removeRecords` 为待删除行数据 |
| `save` | `Function` | 保存，`body.insertRecords` 新增行，`body.updateRecords` 修改行 |
| `getById` | `Function` | 根据行数据获取详情，用于编辑时加载表单 |
| `useYn` | `Function` | 启用/停用，参数为 `(rows, useYn, params)` |

| 其他属性      | 类型       | 说明                  |
| ------------- | ---------- | --------------------- |
| `afterDelete` | `Function` | 删除成功后的回调      |
| `afterUserYn` | `Function` | 启用/停用成功后的回调 |

**query 函数参数说明：**

| 参数               | 说明                                   |
| ------------------ | -------------------------------------- |
| `ajaxParameter`    | 合并后的请求参数（含搜索表单、分页等） |
| `searchForm`       | 搜索表单原始参数（无符号）             |
| `searchFormSymbol` | 带符号的搜索表单参数                   |
| `pager`            | 分页参数：`currentPage`、`pageSize`    |
| `sorts`            | 排序参数                               |
| `filters`          | 过滤参数                               |

```typescript
proxyConfig: {
  ajax: {
    query: ({ ajaxParameter }) => listApi(ajaxParameter),
    delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
    save: ({ body: { insertRecords, updateRecords } }) =>
      batchSaveUpdateApi([...insertRecords, ...updateRecords]),
    getById: (model) => getByIdApi(model.id),
    useYn: (rows, useYn) => setUseYnApi(rows.map((r) => r.id), useYn),
  },
  afterDelete: () => { /* 删除后额外处理 */ },
},
```

### 4. 添加修改表单配置 (addEditConfig)

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `formConfig` | `SmartTableAddEditFormConfig` | 表单配置，参考 VbenForm |
| `modalConfig` | `SmartTableAddEditModalConfig` | 弹窗配置，参考 VbenModal；`slots` 支持 `prepend-footer \| center-footer \| append-footer` |
| `openModalHandler` | `Function` | 自定义弹窗打开逻辑，设置后接管默认弹窗行为 |
| `beforeSave` | `(data) => data \| Promise<data>` | 保存前对表单数据进行处理 |
| `afterSave` | `(result?) => boolean \| Promise<boolean>` | 保存成功后回调，默认刷新表格 |
| `afterLoadData` | `(data) => boolean \| Promise<boolean>` | 编辑时加载完数据后的回调 |
| `saveUpdateValidate` | `(isAdd, selectData?, formData?) => boolean \| Promise<boolean>` | 保存前业务校验，返回 `false` 阻止保存 |

```typescript
addEditConfig: {
  formConfig: {
    schema: [
      { label: '用户名', fieldName: 'username', component: 'Input', rules: 'required' },
      { label: '邮箱', fieldName: 'email', component: 'Input' },
    ],
  },
  modalConfig: {
    class: 'w-[700px]',
    slots: {
      'append-footer': 'custom-footer-slot', // 追加底部插槽
    },
  },
  beforeSave: (data) => ({ ...data, createBy: 'admin' }),
  afterSave: async () => { await tableApi.query(); return true; },
  saveUpdateValidate: (isAdd, selectData) => {
    if (!isAdd && selectData?.locked) {
      message.warning('锁定数据不允许修改');
      return false;
    }
    return true;
  },
},
```

### 5. 工具栏配置 (toolbarConfig)

`toolbarConfig` 类型为 `SmartTableToolbarConfig`，继承自 vxe-table 的 `VxeGridPropTypes.ToolbarConfig`，扩展如下：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `buttons` | `SmartTableButton[]` | 左侧操作按钮 |
| `tools` | `SmartTableToolbarTool[]` | 右侧工具按钮 |
| `sizeSetting` | `boolean \| SmartTableToolbarSizeSetting` | 是否显示尺寸设置按钮 |
| `showSearch` | `boolean \| SmartTableToolbarTool` | 是否显示搜索切换按钮 |
| `column` | `boolean \| SmartTableToolbarColumnConfig` | 列配置按钮 |

**SmartTableButton 内置 code 值：**

| code                        | 说明                   |
| --------------------------- | ---------------------- |
| `ModalAdd`                  | 打开新增弹窗           |
| `ModalEdit`                 | 打开编辑弹窗（选中行） |
| `delete`                    | 删除选中行             |
| `useYnTrue`                 | 启用选中行             |
| `useYnFalse`                | 停用选中行             |
| `save`                      | 保存（可编辑表格）     |
| `insert` / `insert_actived` | 新增行（可编辑表格）   |
| `reload`                    | 重新加载               |
| `export` / `open_export`    | 导出                   |
| `import` / `open_import`    | 导入                   |

**SmartTableButton 配置属性：**

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `code` | `SmartTableButtonCode` | 内置按钮编码 |
| `name` | `string` | 按钮文本 |
| `auth` | `string` | 权限编码 |
| `customRender` | `'ant' \| 'element'` | 使用 UI 框架组件渲染（非 vxe-table 原生按钮） |
| `props` | `Record<string, any> \| Ref \| ComputedRef` | 按钮组件 props |
| `clickLoading` | `boolean` | 点击后是否触发 loading |
| `dropdowns` | `SmartTableBasicButtonDropdowns[]` | 下拉菜单配置 |
| `slot` | `string \| Function` | 自定义插槽渲染 |
| `visible` | `boolean` | 是否显示 |
| `disabled` | `boolean \| ComputedRef<boolean>` | 是否禁用 |

```typescript
toolbarConfig: {
  refresh: true,
  zoom: true,
  custom: true,
  sizeSetting: true,
  buttons: [
    { code: 'ModalAdd', auth: 'sys:user:save' },
    { code: 'delete', auth: 'sys:user:delete' },
    { code: 'useYnTrue', auth: 'sys:user:setUseYn' },
    { code: 'useYnFalse', auth: 'sys:user:setUseYn' },
    // 自定义按钮（使用 ant-design 渲染）
    {
      name: '导出',
      auth: 'sys:user:export',
      customRender: 'ant',
      props: {
        type: 'primary',
        preIcon: 'ant-design:download-outlined',
        onClick: () => handleExport(),
      },
    },
  ],
  tools: [
    { name: '帮助', icon: 'ant-design:question-circle-outlined', onClick: () => showHelp() },
  ],
},
```

### 6. 权限配置 (authConfig)

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `authHandler` | `(auth?) => boolean` | - | 判断权限的函数 |
| `displayMode` | `'disabled' \| 'hide'` | `'disabled'` | 无权限时的显示方式：禁用或隐藏 |

```typescript
authConfig: {
  displayMode: 'hide',
  authHandler: (auth) => hasAccessByAuth(auth),
},
```

### 7. Checkbox 配置 (checkboxConfig)

SmartCheckboxConfig 继承自 vxe-table 的 `VxeTablePropTypes.CheckboxConfig`，扩展属性如下：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `rowTrigger` | `'single' \| 'multiple'` | 点击行时触发选中的模式 |
| `rowCtrl` | `boolean` | 是否支持 Ctrl 键多选（需 `rowTrigger` 为 `single`） |
| `rowShift` | `boolean` | 是否支持 Shift 键范围多选（需 `rowTrigger` 为 `single`） |

```typescript
checkboxConfig: {
  rowTrigger: 'single', // 点击行触发选中
  rowCtrl: true,         // 支持 Ctrl 多选
  rowShift: true,        // 支持 Shift 范围多选
  highlight: true,
},
```

### 8. 序号配置 (seqConfig)

SmartTableSeqConfig 继承自 `VxeTablePropTypes.SeqConfig`，扩展属性如下：

| 属性          | 类型      | 默认值  | 说明                             |
| ------------- | --------- | ------- | -------------------------------- |
| `seqBindPage` | `boolean` | `false` | 序号是否绑定分页（跨页连续编号） |

## 四、表格方法 (tableApi)

`useSmartTable` 返回的第二个参数 `tableApi`：

```typescript
const [SmartTable, tableApi] = useSmartTable(options);

// 重新加载数据
await tableApi.query();

// 打开新增弹窗
tableApi.showAddModal();
tableApi.showAddModal({ parentId: 1 }, { type: 'admin' }); // 传递附加数据

// 编辑
await tableApi.editByRowModal(row);
await tableApi.editByCheckbox();
await tableApi.editByRowModal(row, { extraField: 'value' }); // 传递额外数据

// 删除
await tableApi.deleteByRow(row);
await tableApi.deleteByCheckbox();

// 启用/停用
await tableApi.setUseYnByRow(row, true);
await tableApi.setUseYnByCheckbox(false);

// 搜索表单显隐（不传参数则取反）
tableApi.switchSearchFormVisible();
tableApi.switchSearchFormVisible(false);

// 设置 loading
tableApi.setLoading(true);

// 获取组件实例
const grid = tableApi.getGrid(); // vxe-grid 实例
const editForm = tableApi.getAddEditForm(); // 添加/编辑表单 API
const modal = tableApi.getAddEditModal(); // 添加/编辑弹窗 API
const searchForm = tableApi.getSearchForm(); // 搜索表单 API
```

**tableApi 方法列表：**

| 方法                                   | 说明                         |
| -------------------------------------- | ---------------------------- |
| `query(params?)`                       | 重新查询表格数据             |
| `setLoading(loading)`                  | 设置表格 loading 状态        |
| `setPagerConfig(config)`               | 动态设置分页配置             |
| `updateRowByIdProxy(id)`               | 根据 ID 调用后台更新单行数据 |
| `showAddModal(selectData?, formData?)` | 打开新增弹窗                 |
| `editByRowModal(row, formData?)`       | 打开编辑弹窗                 |
| `editByCheckbox()`                     | 编辑 checkbox 选中行         |
| `deleteByRow(row)`                     | 删除指定行                   |
| `deleteByCheckbox()`                   | 删除 checkbox 选中行         |
| `setUseYnByRow(row, useYn, params?)`   | 设置指定行启用/停用状态      |
| `setUseYnByCheckbox(useYn, params?)`   | 设置选中行启用/停用状态      |
| `switchSearchFormVisible(visible?)`    | 切换搜索表单显隐             |
| `getGrid()`                            | 获取 vxe-grid 实例           |
| `getAddEditForm()`                     | 获取添加/编辑表单 API        |
| `getAddEditModal()`                    | 获取添加/编辑弹窗 API        |
| `getSearchForm()`                      | 获取搜索表单 API             |

## 五、事件

SmartTable 支持 vxe-table 的所有事件，扩展事件如下：

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `@register` | `SmartTableAction` | 表格注册完成 |
| `@initialized` | - | 表格初始化完成 |
| `@formQuery` | - | 搜索表单查询触发 |
| `@proxy-query` | `params` | 代理查询触发 |
| `@proxyDelete` | `{ status: boolean }` | 代理删除触发 |
| `@addEditModalShow` | `{ formData, isAdd, selectData }` | 添加/编辑弹窗显示 |
| `@afterSaveUpdate` | `isAdd: boolean` | 保存/更新完成后 |
| `@cellClick` | `VxeGridDefines.CellClickEventParams` | 单元格点击 |
| `@toolbar-tool-click` | `params` | 工具栏工具点击 |

## 六、行操作组件 (SmartVxeTableAction)

`SmartVxeTableAction` 用于在操作列中渲染行级操作按钮。

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `actions` | `SmartTableActionItem[]` | - | 操作按钮列表 |
| `dropDownActions` | `SmartTableActionItem[]` | - | 下拉菜单操作列表 |
| `divider` | `boolean` | `true` | 按钮之间是否显示分隔线 |
| `stopButtonPropagation` | `boolean` | - | 是否阻止按钮点击事件冒泡 |

**SmartTableActionItem 配置：**

| 属性         | 类型                  | 说明                         |
| ------------ | --------------------- | ---------------------------- |
| `label`      | `string`              | 按钮文本                     |
| `code`       | `'edit' \| 'delete'`  | 内置编码，自动设置图标和颜色 |
| `icon`       | `string`              | 图标                         |
| `auth`       | `SmartAuthType`       | 权限编码                     |
| `ifShow`     | `boolean \| Function` | 业务控制是否显示             |
| `disabled`   | `boolean`             | 是否禁用                     |
| `danger`     | `boolean`             | 是否为危险按钮               |
| `onClick`    | `Function`            | 点击事件                     |
| `popConfirm` | `PopConfirm`          | 气泡确认框配置               |
| `tooltip`    | `string \| object`    | 提示文本                     |
| `divider`    | `boolean`             | 是否在该按钮后显示分隔线     |

```typescript
const getTableActions = (row: any): SmartTableActionItem[] => [
  // 内置编码，自动图标+颜色
  {
    code: 'edit',
    auth: 'sys:user:update',
    onClick: () => tableApi.editByRowModal(row),
  },
  // 气泡确认框
  {
    code: 'delete',
    auth: 'sys:user:delete',
    popConfirm: {
      title: '确认删除该用户？',
      confirm: () => tableApi.deleteByRow(row),
    },
  },
  // 自定义按钮，根据业务条件显示
  {
    label: '重置密码',
    icon: 'ant-design:key-outlined',
    auth: 'sys:user:resetPwd',
    ifShow: () => row.useYn === true,
    onClick: () => handleResetPwd(row),
  },
];
```

## 七、辅助工具函数

### 列样式工具

```typescript
import { getTableUseYnColumnClass, getTableBooleanColumnClass } from '@vben/common-ui';

// 启用/停用列（自动处理颜色、文本、宽度）
{
  title: '状态',
  ...getTableUseYnColumnClass(),           // 默认使用 useYn 字段
  // ...getTableUseYnColumnClass('status'), // 自定义字段名
  sortable: true,
}

// Boolean 类型列（自动处理颜色和是/否文本）
{
  title: '是否内置',
  ...getTableBooleanColumnClass('buildIn'),
  // 第二个参数 showFalse，控制 false 时是否渲染"否"，默认 true
  sortable: true,
}
```

## 八、API 参考

### 组件属性

<DemoPreview dir="demos/smart-table/Api" />
