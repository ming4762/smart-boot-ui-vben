---
outline: deep
---

# 可调整尺寸布局组件 ResizableLayout

支持水平、垂直双区域布局，以及实时或预览式拖拽调整尺寸。

## 一、Usage

```vue
import { ResizableLayout } from '@vben/common-ui';

<ResizableLayout
  class="h-full"
  divider-size="5px"
  :first-size="240"
  resize-mode="preview"
  resizable
  size-unit="px"
>
  <template #first>
    左侧
  </template>
  <template #second>
    右侧
  </template>
</ResizableLayout>
```

## 二、Props

| 属性 | 说明 | 类型/返回类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| direction | 布局方向 | string | horizontal、vertical | horizontal |
| resizable | 是否允许拖拽 | boolean |  | true |
| resizeMode | 拖拽时实时调整或显示预览线 | string | realtime、preview | realtime |
| dividerSize | 分割线尺寸，数字按像素处理 | number \| string |  | 1 |
| firstSize | 第一块面板的初始尺寸 | number |  |  |
| secondSize | 第二块面板的初始尺寸 | number |  |  |
| sizeUnit | 两块面板的默认尺寸单位 | string | %、px | % |
| firstSizeUnit | 第一块面板的尺寸单位 | string | %、px |  |
| secondSizeUnit | 第二块面板的尺寸单位 | string | %、px |  |
| showDivider | 是否显示分割线 | boolean |  | false |
| showHandle | 是否显示拖动手柄 | boolean |  | true |

## 三、Slots

| 名称   | 说明                                           | 是否作用域插槽 |
| ------ | ---------------------------------------------- | -------------- |
| first  | 第一块面板；水平布局时在左侧，垂直布局时在上侧 | 是             |
| second | 第二块面板；水平布局时在右侧，垂直布局时在下侧 | 是             |
