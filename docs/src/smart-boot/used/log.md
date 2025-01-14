---
outline: deep
---

# 日志

## 一、引入日志支持

```xml
<!--    单体架构引入    -->
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-boot-starter-log</artifactId>
</dependency>

<!--    微服务架构引入    -->
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-cloud-starter-log</artifactId>
    <version>${project.version}</version>
</dependency>
```

## 二、接口注解日志

在controller接口上添加注解：com.smart.framework.commons.core.log.Log

::: warning 注意

建议所有增删改操作都添加日志

重要的查询操作添加日志

:::

示例：

```java
@PostMapping("sys/auth/changePassword")
@Log(value = "更新密码", type = LogOperationTypeEnum.UPDATE, saveParameter = false, saveResult = true)
@Operation(summary = "更改密码")
public Result<Boolean> changePassword(@NonNull @RequestBody @Valid ChangePasswordDTO parameter)
```

注解属性：

| 注解属性 | 说明 | 可选值 |
| --- | --- | --- |
| value | 日志说明 |  |
| type | 日志类型 | 枚举：LogOperationTypeEnum：ADD、DELETE、UPDATE、QUERY |
| saveResult | 是否保存接口返回结果，除非重要，否则不建议保存 | true/false，默认false |
| saveParameter | 是否保存接口参数，除非不重要，否则建议保存 | true/false，默认true |

## 三、手动保存日志

系统提供com.smart.module.api.system.SysLogApi，进行手动日志保存

::: warning 注意

日志保存依赖系统模块！

:::

### 1、引入依赖

```xml
<!--    单体架构引入    -->
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-system-api</artifactId>
</dependency>

<!--    微服务架构引入    -->
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-cloud-system-api</artifactId>
</dependency>
```

### 2、保存日志

示例：

```java
SysLogSaveDTO.SysLogSaveDTOBuilder logBuilder = SysLogSaveDTO.builder()
        .operation(url.getRemark())
        .params(parameterJson)
        .requestPath(requestUrl)
        .platform(PLATFORM)
        .logSource(LogSourceEnum.MANUAL)
        .ident(LOG_IDENT)
        .createUserId(AuthUtils.getCurrentUserId())
        .statusCode(200)
        .createBy(AuthUtils.getCurrentFullName());
long startTime = System.nanoTime();
try {
    // ------ 业务代码
} catch (Exception e) {
    logBuilder.statusCode(500)
            .errorMessage(ExceptionUtils.throwableToString(e, true));
    throw e;
} finally {
    this.sysLogApi.saveLog(
            logBuilder
                    .useTime(TimeUnit.MILLISECONDS.convert(System.nanoTime() - startTime, TimeUnit.NANOSECONDS))
                    .build()
    );
}
```

## 四、查看日志

系统监控-接口日志 查看日志信息

![image-20250113194152458](images\image-20250113194152458.png)
