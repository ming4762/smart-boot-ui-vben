# ApiDictSelect 字典Api Select组件

该组件在[ApiSelect](../../components/common-ui/vben-api-component.md)的基础上，扩展增加了字典的功能。

## 一、Usage

```typescript
{
  fieldName: 'storageType',
  label: t('smart.file.storage.title.storageType'),
  component: 'ApiDictSelect',
  componentProps: {
    dictCode: 'FILE_STORAGE_TYPE',
    style: { width: '140px' },
  },
  searchSymbol: '=',
},
```

## 二、Props

| 属性     | 说明     | 类型/返回类型 | 可选值 | 默认值/参数 |
| -------- | -------- | ------------- | ------ | ----------- |
| dictCode | 字典编码 |               |        |             |
