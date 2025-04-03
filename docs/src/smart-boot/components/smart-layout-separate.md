---
outline: deep
---

# 分割布局组件SmartLayoutSeparate

支持上下左右布局分割组件，支持拖拽

## 一、Usage

```vue
import { SmartLayoutSeparate } from '@vben/common-ui';

<SmartLayoutSeparate
  class="h-full"
  layout="leftRight"
  first-size="240px"
  draggable
  show-line
>
    <template #first>
    	左侧
    </template>
    <template #second>
    	右侧
    </template>
</SmartLayoutSeparate>
```

## 二、Props

| 属性 | 说明 | 类型/返回类型 | 可选值 | 默认值/参数 |
| --- | --- | --- | --- | --- |
| layout | 上下/左右布局 | string | leftRight、topBottom | leftRight |
| draggable | 是否可拖拽 | boolean |  | false |
| firstSize | 第一块的宽度，支持百分比、px，与secondSize互斥，优先级高 | string \| number | 50%、600px=600 |  |
| secondSize | 第二块的宽度，支持百分比、px，与secondSize互斥，优先级低 | string \| number |  |  |
| showLine | 是否显示分割线 | boolean |  | false |
| lineStyle | 分割线样式 | string \| StyleValue |  |  |
| highLineStyle | 高亮分割线样式，拖拽过程中分割线会高亮 | string \| StyleValue |  | 'border-left': '2px solid rgb(24, 144, 255)' |

## 三、Slots

| 名称 | 说明 | 是否作用域插槽 |
| --- | --- | --- |
| first | 布局的第一块，如果是上下布局则是上侧；如果是左右布局则是左侧 | 否 |
| second | 布局的第二块 | 否 |
