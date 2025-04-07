# Smart Button

SmartButton在antd button的基础上增加了两个组件

- SmartIconButton：结合vben IconifyIcon组件，添加按钮前置图标
- SmartAuthButton：支持设置权限按钮

## 一、SmartIconButton

### 1、Usage

```vue
<SmartAuthButton
  :loading="saveLoading"
  auth="db:codeConfig:save"
  class="ml-[5px]"
  pre-icon="ant-design:save-outlined"
  type="primary"
  @click="handleSave"
>
  {{ t('common.button.save') }}
</SmartAuthButton>
```

### 2、Props

支持所有antd button props

| 属性 | 说明 | 类型/返回类型 | 可选值 | 默认值/参数 |
| --- | :-- | --- | --- | --- |
| preIcon | 前置图标 | string | 参考[iconify](https://github.com/iconify/iconify) |  |
| preIcon | 后置图标 | string | 同上 |  |

## 二、SmartAuthButton

### 1、Usage

```vue
<SmartAuthButton
  :size="getButtonSize as never"
  auth="sys:dept:save"
  pre-icon="ant-design:plus-outlined"
  type="primary"
  @click="handleAdd"
>
  {{ $t('common.button.add') }}
</SmartAuthButton>
```

### 2、Props

支持所有SmartIconButton props

| 属性 | 说明 | 类型/返回类型 | 可选值 | 默认值/参数 |
| --- | :-- | --- | --- | --- |
| auth | 权限信息 | SmartAuthType \| string |  |  |
| tooltipProps | 无权限tooltio props | andt TooltipProps |  |  |

SmartAuthType 参数说明

| 属性 | 说明 | 类型 | 可选值 |
| --- | --- | --- | --- |
| displayMode | 显示模式：disabled不可点击 hide不显示，默认disabled | string | disabled、hide |
| multipleMode | 多个权限值权限模式，默认and | string | and 、or |
| permission | 权限值 | string \| string[] |  |
