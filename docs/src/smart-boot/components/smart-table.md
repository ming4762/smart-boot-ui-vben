---
outline: deep
---

# Smart Table

Smart Table 基于[vxe-table](https://vxetable.cn/)进行二次封装，关于vxe-table请参考官方文档，本文档只列出与vxe-table不同的部分

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
      // 引入 antd 渲染器
      vxeUI
        // # 配置基于andt的可编辑表格组件
        .use(VxeUIPluginRenderAntd, {
          componentProvider: (name: string) => {
            if (name.startsWith('A')) {
              return globalShareState.getComponents()[name.slice(1)];
            }
            return globalShareState.getComponents()[name];
          },
        })
        // 用户配置信息存储到数据库中
        .use(SmartTableCustomStorageDBPlugin)
        .setConfig({
          size: 'small',
        });
    },
    // 国际化、语言、主题依赖与哪些属性变更
    watcherField: computed(() => {
      return {
        locale: unref(preference.locale),
        theme: unref(preference.theme),
      };
    }),
    // 获取组件的函数，smart-table需要一些外部组件，通过这种方式注入
    componentHandler: (name) => globalShareState.getComponents()[name],
    // i18n处理器
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
      if (!code) {
        return true;
      }
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

## 二、示例

## 三、API

### 1、组件属性

<DemoPreview dir="demos/smart-table/Api" />

### 2、use api

useSmartTable返回的第二个参数，具体参考 组件 Methods

```typescript
<script setup lang="ts">
import { useSmartTable } from '#/adapter/smart-table';

// SmartTable 为组件实例，smartTableApi 为表格函数
const [SmartTable, smartTableApi] = useSmartTable(options);
</script>

<template>
  <SmartTable />
</template>
```
