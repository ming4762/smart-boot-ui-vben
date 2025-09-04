---
outline: deep
---

# 常用功能

## 一、接口限流

基于注解式的接口限流

提供基于Redis令牌桶算法和Guava令牌桶算法两种实现

### 1、如何使用

#### 1）项目启动类添加enable注解：`com.smart.framework.commons.core.spring.EnableRateLimit`

#### 2）需要限流的函数添加注解 @RateLimit

> 注解可以添加在任意函数上，不局限于controller接口

```java
@RateLimit(limit = 1)
public Result<String> rateLimitDemo() {
    return Result.success("rateLimitDemo");
}
```

### 2、 注解参数说明

| 序号 | 属性    | 类型       | <div style="width: 200px">说明</div> | 可选值 | 默认值                                                       |
| ---- | ------- | ---------- | ------------------------------------ | ------ | ------------------------------------------------------------ |
| 1    | value   | String     | 限流的key                            |        | 函数限定名，例如com.smart.service.system.TestController#rateLimitDemo() |
| 2    | limit   | Long       | 单位时间内访问次数限制               |        |                                                              |
| 3    | unit    | ChronoUnit | 时间单位                             |        | ChronoUnit.SECONDS                                           |
| 4    | message | String     | 触发限流的提示信息                   |        | The maximum access times limit is exceeded. Please try again later |

### 3、使用Redis限流

Redis支持分布式限流

引入maven

```xml
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-boot-starter-redis</artifactId>
    <version>${project.version}</version>
</dependency>
```

### 4、使用Guava限流

引入maven

```xml
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-boot-starter-guava</artifactId>
    <version>${project.version}</version>
</dependency>
```

