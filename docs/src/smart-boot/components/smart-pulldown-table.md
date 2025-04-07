# SmartPulldownTable下拉表格组件

::: tip

SmartPulldownTable 在[SmartTable](./smart-table.md)的基础上二次封装，支持所有SmartTable属性

:::

## 一、Usage

```typescript
{
  fieldName: 'packageId',
  label: t('system.views.tenant.manager.title.subscribe.packageId'),
  component: 'SmartPulldownTable',
  dependencies: {
    triggerFields: ['packageId'],
    disabled: (value) => {
      const isAdd = value.isAdd;
      return isAdd === false;
    }
  }
  componentProps: () => {
    return {
      alwaysLoad: false,
      immediate: false,
      showFunction: (row: any) => `${row.packageCode}-${row.packageName}`,
      valueField: 'id',
      pulldownProps: {
        destroyOnClose: false,
      },
      async api() {
        const tenantId = unref(tenantIdRef);
        if (!tenantId) {
          return [];
        }
        return listNoBindPackageByTenantIdApi({
          id: tenantId,
        });
      },
      tableProps: {
        border: true,
        columns: [
          {
            field: 'packageCode',
            sortable: true,
            title: '123',
            width: 120,
          },
          {
            field: 'packageName',
            title: '{system.views.tenant.package.title.packageName}',
            width: 120,
          },
          {
            field: 'effectTime',
            sortable: true,
            title: '{system.views.tenant.package.title.effectTime}',
            width: 165,
          },
          {
            field: 'expireTime',
            sortable: true,
            title: '{system.views.tenant.package.title.expireTime}',
            width: 165,
          },
          {
            field: 'remark',
            title: '{common.table.remark}',
            minWidth: 120,
          },
          {
            ...getTableUseYnColumnClass(),
            width: 120,
          },
        ],
      },
    };
  }
}
```

![image-20250407092305844](images\image-20250407092305844.png)

## 二、Props

| 属性 | 说明 | 类型/返回类型 | 可选值 | 默认值/参数 |
| --- | --- | --- | --- | --- | --- |
| allowClear | 是否允许输入框清除 | boolean |  | true |
| alwaysLoad | 下拉表格弹出是否加载数据 | boolean |  | false |
| api | 数据加载函数 | AnyPromiseFunction<any, any> |  |  |
| dropdownHeight | 下拉表格高度 px | number |  |  |
| dropdownWidth | 下拉表格宽度 px | number |  | 600 |
| filterOption | 自定义搜索过滤函数 | (searchValue: string, row: Record<string, any>) => boolean |  |  |
| immediate | 是否立即加载数据，true组件初始化后会立即加载数据 | boolean |  | true |
| pulldownProps | VxePulldownProps，参考VxePulldown | VxePulldownProps |  |  |
| searchIgnoreCase | 搜索是否忽略大小写 | boolean |  | true |
| showField | select回显字段，优先级比showFunction低 | string |  |  |
| showFunction | select回显函数，优先级高 | AnyNormalFunction<any, string> |  |  |
| showSearch | select是否可搜索 | boolean |  | true |
| tableProps | 下拉表格Props，SmartTableProps | SmartTableProps |  |  |
| value | select值 | number | string |  |  |
| valueField | select值字段 | string |  |  |

## 三、Events

| 时间名        | 说明                 | 函数                               |
| ------------- | -------------------- | ---------------------------------- |
| change        | 数据发生变更出发     | (value: number) => void            |
| select        | 选中table行触发      | (row: Record<string, any>) => void |
| visibleChange | 下拉表格显示隐藏触发 | (visible: boolean) => void         |
| value         | 支持v-model:value    |                                    |
