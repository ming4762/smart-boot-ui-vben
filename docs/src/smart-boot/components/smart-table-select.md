# SmartTableSelect 表格选择组件

共提供4个组件：

- SmartTableSelectModal：弹窗组件
- SmartTableSelectUsrModal：用户弹窗选择组件
- SmartTableSelect：表格选择组件
- SmartTableSelectUser：用户表格选择组件

## 一、SmartTableSelectModal

### 1、Usage

```typescript
const [Modal, modalApi] = useVbenModal({
  connectedComponent: SmartTableSelectModal,
  title: $t('system.views.role.button.setRoleUser'),
});

h(Modal, {
  showSelect: true,
  class: 'w-[1200px]',
  onSelected: handleSetUser,
  listUserApi,
  selectValues: unref(selectUserList),
});
```

![image-20250407102219719](images\image-20250407102219719.png)

### 2、Props

| 属性 | 说明 | 类型/返回类型 | 可选值 | 默认值/参数 |
| --- | :-- | --- | --- | --- |
| tableProps | 表格参数 | [SmartTableProps](./smart-table.md) |  |  |
| selectTableProps | 右侧选择表格参数 | [SmartTableProps](./smart-table.md) |  |  |
| multiple | 是否支持多选 | boolean |  | true |
| labelField | label字段 | string |  |  |
| valueField | value字段 | string |  |  |
| showSelect | 是否显示选中的行 | boolean |  | false |
| selectValues | 选中的值 | any[] |  |  |
| listApi | 查询列表API | (data: any) => Promise |  |  |
| alwaysLoad | 是否每次打开modal都加载数据 | boolean |  | false |

### 3、Events

| 事件名 | 说明 | 函数 |
| --- | --- | --- |
| optionChange | select option发生变更事件 | (Record<string, any>) => void |
| selectData | 选择的数据发生变更 | (Record<stringm,any>, any[]) => void |

## 二、SmartTableSelect

### 1、Usage

```vue
<SmartTableSelect
  v-model:value="model.templateIdList"
  :list-api="listByIdApi"
  :table-props="{}"
  allow-clear
  fullscreen
  label-field="name"
  multiple
  title="选择模板"
  value-field="templateId"
>
</SmartTableSelect>
```
