---
outline: deep
---

# 页面级数据共享组件SmartPageProvider

::: tip

所有页面都被该组件包裹

基于vue provide/inject实现页面级的数据共享

目前实现了数据字典的数据共享

例如：当前页面及其子组件在多个地方使用同一个数据字典，每个地方加载字典会影响性能

通过页面数据共享可以解决上述问题

:::

## 一、ApiDictSelect

组件ApiDictSelect会默认使用数据共享，不会导致字典重复加载，所以可以放心随意使用该组件。

## 二、手动使用字典共享数据

在某些场景下，需要手动使用全局共享的数据

在使用之前需要注册数据字典

```typescript
import { useInjectPageDict } from '@vben/preferences';

// 注入注册函数、字典数据
const { pageDictRegister, pageDictMap, pageDictData } = useInjectPageDict();

// 注册数据字典
pageDictRegister('SYSTEM_I18N_PLATFORM', 'TEST_DICT_CODE');

// 函数会注入两种格式字典数据
// 1、pageDictData Map<string, any[]>，key：字典编码，value：字典项列表
// 2、pageDictMap Map<string, Map<string, string>>，第一层key：字典编码，第二次key：字典项编码，value：字典项值
```
