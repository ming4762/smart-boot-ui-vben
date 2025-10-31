# SmartCopyText 复制文本组件

::: tip

SmartCopyText 复制文本组件

点击图标复制文本

:::

## 一、Usage

```typescript

// 1、直接使用组件
import { SmartCopyText } from '@vben/common-ui';

<template>
  <SmartCopyText text="要复制的文本" />
</template>

// 2、在SmartTable列中使用
{
  title: '复制文本',
  field: 'copyText',
  width: 180,
  component: 'copyText',
  componentProps: {
    iconPosition: 'end',
  },
},


```

## 二、Props

| 属性 | 说明 | 类型/返回类型 | 可选值 | 默认值/参数 |
| --- | --- | --- | --- | --- |
| text | 要复制的文本 | string |  |  |
| iconPosition | 图标位置，默认在文本尾部 | string | 'right'/'left'/'end' | 'end' |
| margin | 图标与文本间距 | number |  | 3 |
| showMode | 显示模式 | string | 'always'/'hover' | 'always' |
| noTextVisible | 文本不存在是否显示图标 | boolean |  | false |
| icon | 自定义图标 | string |  | ant-design:copy-outlined |

## 三、Events

| 事件名 | 说明                 | 函数   |
| ------ | -------------------- | ------ |
| copy   | 点击图标复制文本触发 | string |
