---
outline: deep
---

# 数据权限

## 一、数据权限介绍

数据权限功能[基于mybatis plus数据权限](https://baomidou.com/plugins/data-permission/)插件二次开发

smart-boot提供4中模式进行数据权限

- 函数式数据权限，`优先级最高`，参考`函数式数据权限`

- 基于注解模式：@SmartDataPermission

  支持多个注解叠加

  ![image-20250326163905341](images\image-20250326163905341.png)

- 基于角色-数据权限配置

  改模式灵活，可以在通过后台灵活配置

- 基于`数据权限编码`

  相当于前两种方式的结合

  ![image-20250326165003448](images\image-20250326165003448.png)

## 二、函数式数据权限

`com.smart.framework.crud.datapermission.handler.SmartDataPermissionController`

::: warning 注解的生效范围

支持手动通过函数调用的方式设置数据权限，这种最灵活，一旦设置其他方式的数据权限`失效`

生效范围：当前线程，所以要严格使用，并注意调用`clear`清除上下文，防止权限溢出，导致业务异常

:::

### 1、忽略所有数据权限设置

```java
SmartDataPermissionController.ignoreAll();
```

所有配置的数据权限都会失效

### 2、根据表名忽略数据权限

```java
 SmartDataPermissionController.ignoreTable("sys_parameter");

// 推荐使用
SmartDataPermissionController.ignoreTable(SysParameterPO.class);
```

### 3、根据mapperId忽略数据权限

```java
SmartDataPermissionController.ignoreMapper("com.smart.module.system.mapper.SysParameterMapper.list");
```

### 4、添加数据权限

```java
SmartDataPermissionController.addManualDataPermission(
        SmartDataPermissionModel.builder()
                // 设置属性
    		    .tableClass(SysParameterPO.class)
                .scope(DataPermissionScopeEnum.DATA_PERSONAL)
                .build(),
        SmartDataPermissionModel.builder()
                // 设置属性
                .build()
);
```

### 5、清除手动设置的数据权限（重要）

忽略的数据权限和添加的数据权限都会清除

```java
SmartDataPermissionController.clear();
```

## 三、基于注解数据权限

`com.smart.framework.crud.datapermission.annotation.SmartDataPermission`

::: warning 注解的生效范围

注解可以添加在任意函数上，生效范围在当前函数栈范围，压栈后生效，出栈后失效

例如：在函数A上加注解

A -> B -> C，A调用B，B调用C

D，A执行完，在执行B

那么注解会在A、B、C3个函数内生效，D不生效

:::

### 1、注解字段说明

- scope：数据权限范围，可选值参考`数据权限范围`,默认值：DATA_ALL
- column：需要过滤的数据权限字段，如果为null，则会根据scope的默认字段过滤，参考`数据权限范围`默认字段
- tableName：需要进行数据权限过滤的表名，未设置`configCode`则不能为空（和tableClass二选一），优先级比tableClass高
- tableClass：需要进行数据权限过滤的实体类class，优先级比tableName低，`建议使用这种方式`
- permissionValue：集合scope.DATA_CUSTOM，编写自定义过滤逻辑，具体使用请参考`自定义权限逻辑`
- configCode：使用后台配置的数据权限配置，设置了configCode，上述所有字段都可为null，默认都从数据库中获取

### 2、数据权限范围说明

`com.smart.module.api.crud.constants.DataPermissionScopeEnum`

| 枚举 | 默认字段 | 备注 |
| --- | --- | --- |
| DATA_ALL |  | 全部可见，相当于没有配置数据权限 |
| DATA_DEPT | dept_id | 当前部门可见：只能查看当前登录用户部门的数据 |
| DATA_DEPT_AND_CHILD | dept_id | 当前部门及下级可见：只能查看当前登录用户部门和下级部门数据的数据 |
| DATA_PERSONAL | create_user_id | 本人可见，只能查看当前登录用户的数据 |
| DATA_CUSTOM |  | 自定义过滤规格，和permissionValue结合使用 |

### 3、自定义权限逻辑

配置自定义SQL进行数据过滤，SQL支持占位符，支持的占位符参数包括：

- userId：当前登录用户ID
- username：当前登录用户名
- fullName：当前登录用户姓名
- tenantId：当前登录租户ID
- tenantCode：当前登录租户编码
- isSuperAdmin：是否超级管理员
- userDept：当前登录用户所属部门（可能有多个）
- userDeptWithChildren：当前登录用户所属部门和下级部门

## 四、基于角色的数据权限

采用可视化的方式配置数据权限，依赖系统模块管理数据权限

### 1、配置数据权限

在`系统管理-功能管理`配置数据权限

数据权限绑定到哪个功能菜单上没有具体的作用，只是用来分类

![image-20250328161958743](images\image-20250328161958743.png)

在弹出层查看、管理功能绑定的数据权限

![image-20250328162119539](images\image-20250328162119539.png)

### 2、给角色分配数据权限

在`系统管理-角色管理`配置角色对应的数据权限

点击具体的数据权限可以查看权限的详情

![image-20250328162429006](images\image-20250328162429006.png)

## 三、基于数据权限编码方式

注解模式和角色模式结合，实现半自动的权限配置

将在功能菜单配置的数据权限编码写入注解

```java
@SmartDataPermission(configCode = "test_code")
public Result<Object> list(@RequestBody @NonNull PageSortQuery parameter) {
    return super.list(parameter);
}
```
