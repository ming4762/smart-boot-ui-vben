# 短信验证码登录模块（smart-auth-extensions-sms）使用说明

## 1. 快速开始

### 1.1 引入依赖

**单体架构（Boot 模式）** 引入 Starter：

```xml
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-boot-starter-auth-sms</artifactId>
</dependency>
```

该 Starter 会自动引入 `smart-auth-extensions-sms`（核心模块）和 `smart-boot-auth-sms`（自动配置模块），并注册所需的 Bean。

**微服务架构（Cloud 模式）** 直接引入核心模块：

```xml
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-auth-extensions-sms</artifactId>
</dependency>
```

> 微服务模式下需自行注册 `SmsAuthenticationProvider`、`SmsCreateValidateProvider`、`SmsUserDetailService` 等 Bean。

### 1.2 选择并引入短信渠道模块

短信登录的验证码发送依赖消息模块的短信渠道实现。框架提供了 3 种短信渠道，根据实际使用的云平台选择引入其中一个：

| 渠道 | Maven 模块 | 云平台 | 适用场景 |
|---|---|---|---|
| 阿里云短信 | `smart-boot-starter-message-sms-aliyun` | 阿里云 | 通用场景，国内主流选择 |
| 腾讯云短信 | `smart-boot-starter-message-sms-tencent` | 腾讯云 | 腾讯云生态用户 |
| 山东港口短信 | `smart-boot-starter-message-sms-sdport` | 山东港口短信平台 | 山港内部系统 |


**单体架构（Boot 模式）** 引入 Starter：

```xml
<!-- 阿里云短信（推荐） -->
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-boot-starter-message-sms-aliyun</artifactId>
</dependency>

<!-- 或 腾讯云短信 -->
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-boot-starter-message-sms-tencent</artifactId>
</dependency>

  <!-- 或 山东港口短信 -->
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-boot-starter-message-sms-sdport</artifactId>
</dependency>
```

**微服务架构（Cloud 模式）** 直接引入框架模块：

```xml
<!-- 阿里云 -->
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-message-extensions-sms-aliyun</artifactId>
</dependency>

<!-- 或 腾讯云 -->
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-message-extensions-sms-tencent</artifactId>
</dependency>

<!-- 或 山东港口 -->
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-message-extensions-sms-sdport</artifactId>
</dependency>
```

> 三个渠道模块互斥，只需引入其中一个。引入后，消息模块会自动注册对应的 `SmartSmsChannelService` 实现（山东港口除外）。

### 1.3 配置短信参数

在 `application.yml` 中配置短信签名和模板：

```yaml
smart:
  auth:
    sms:
      sign-name: "你的短信签名"
      template: "你的短信模板编码"
```

### 1.4 启用短信登录

在 `SecurityFilterChain` 中通过 `AuthSmsSecurityConfigurer` 开启短信登录：

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.with(AuthSmsSecurityConfigurer.sms(), Customizer.withDefaults());
    return http.build();
}
```

### 1.5 接口说明

启用后，框架自动注册以下两个接口：

| 接口 | 方法 | 地址 | 说明 |
|---|---|---|---|
| 发送验证码 | POST | `/auth/sms/createCode` | 参数：`phone`（手机号） |
| 短信登录 | POST | `/auth/sms/login` | 参数：`phone`（手机号）+ `code`（验证码） |

### 1.6 调用流程

```
1. 前端调用 POST /auth/sms/createCode?phone=13800138000
   → 框架生成6位数字验证码 → 发送短信 → 验证码缓存5分钟

2. 用户输入验证码，前端调用 POST /auth/sms/login?phone=13800138000&code=123456
   → 框架校验验证码 → 查询用户 → 返回登录凭证
```

---

## 2. 配置详解

### 2.1 默认配置项

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `smart.auth.sms.sign-name` | 无（必填） | 短信签名名称 |
| `smart.auth.sms.template` | 无（必填） | 短信模板编码 |

各短信渠道还需要在消息模块中配置对应平台的参数，详见 [2.5 短信渠道配置](#25-短信渠道配置)。

### 2.2 短信渠道配置

短信渠道的参数通过 `SmartSmsChannelService` 的 `channelProperties` 传入（通常为 JSON 格式），不同渠道的参数结构如下：

#### 阿里云短信（`SmartSmsAliyunChannelProperties`）

| 参数 | 说明 |
|---|---|
| `accessKey` | 阿里云 AccessKey ID |
| `accessSecret` | 阿里云 AccessKey Secret |
| `endpoint` | 短信 API 端点，默认 `dysmsapi.aliyuncs.com` |

#### 腾讯云短信（`SmartSmsTencentChannelProperties`）

| 参数 | 说明 |
|---|---|
| `accessKey` | 腾讯云 SecretId |
| `accessSecret` | 腾讯云 SecretKey |
| `appid` | 短信应用 SdkAppId（在[短信控制台](https://console.cloud.tencent.com/smsv2/app-manage)查看） |
| `region` | 地域信息，枚举值：`BEIJING`（华北-北京）、`GUANGZHOU`（华南-广州）、`NANJING`（华东-南京） |

#### 山东港口短信平台（`SmartSmsSdportChannelProperties`）

| 参数 | 默认值 | 说明 |
|---|---|---|
| `endpoint` | 无（必填） | SOAP 服务接口地址，例如 `http://10.171.19.193:8080/dxpt/ws/shortMessageWs` |
| `namespace` | `http://impl.service.cxf.com/` | SOAP 服务命名空间 |
| `dwdm` | 无（必填） | 单位代码，用于标识发送方身份，例如 `HYJT`（航运集团） |
| `connectTimeout` | `5000` | 连接超时时间（毫秒） |
| `readTimeout` | `10000` | 读取超时时间（毫秒） |

> 山东港口短信平台基于 SOAP 1.1 协议，单次最多支持100个手机号，短信内容不超过350个字符。

### 2.3 默认接口地址

短信登录相关的默认 URL 由 `DefaultAuthUrlEnum` 定义：

| 枚举值 | URL | 说明 |
|---|---|---|
| `SMS_CREATE_CODE` | `/auth/sms/createCode` | 验证码创建路径 |
| `SMS_LOGIN` | `/auth/sms/login` | 短信登录路径 |

### 2.4 多认证域配置

当需要同时支持多端短信登录（如管理端 + 移动端各有独立登录入口）时，可通过 `addAuthDomain` 配置：

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.with(AuthSmsSecurityConfigurer.sms(), configurer ->
        configurer
            // 管理端
            .addAuthDomain(
                AuthDomainConstants.AUTH_DOMAIN_ADMIN,
                SmartAuthDomainConfig.builder()
                    .loginUrl("/auth/admin/sms/login")
                    .build()
            )
            // 移动端
            .addAuthDomain(
                "MOBILE",
                SmartAuthDomainConfig.builder()
                    .loginUrl("/auth/mobile/sms/login")
                    .build()
            )
    );
    return http.build();
}
```

每个认证域会创建独立的 `SmsLoginFilter`，绑定到对应的登录 URL。

### 2.5 自定义成功/失败处理器

```java
http.with(AuthSmsSecurityConfigurer.sms(), configurer ->
    configurer
        .authenticationSuccessHandler(mySuccessHandler)
        .authenticationFailureHandler(myFailureHandler)
);
```

如果不指定，默认使用 `HttpSecurity` 共享的 `AuthenticationSuccessHandler` / `AuthenticationFailureHandler`。

---

## 3. 自定义扩展

### 3.1 自定义用户查询逻辑

框架默认通过 `DefaultSmsUserDetailServiceImpl` 调用 `SystemAuthUserApi.getByMobile()` 查询用户。如需自定义，实现 `SmsUserDetailService` 接口并注册为 Bean：

```java
@Component
public class MySmsUserDetailService implements SmsUserDetailService {
    @Override
    public RestUserDetails loadUserByMobile(String mobile) throws AuthenticationException {
        // 根据手机号从自定义数据源查询用户
        User user = userRepository.findByMobile(mobile);
        if (user == null) {
            throw new BadCredentialsException("手机号未注册");
        }
        return buildUserDetails(user);
    }
}
```

> 注册自定义 Bean 后，`SmartAuthSmsAutoConfiguration` 中的 `@ConditionalOnMissingBean` 会自动跳过默认实现。

### 3.2 自定义验证码创建与校验逻辑

框架默认实现 `DefaultSmsCreateValidateProviderImpl` 的逻辑为：
- **创建**：生成6位随机数字验证码 → 调用 `SmartMessageApi.sendSms()` 发送短信 → 验证码缓存5分钟
- **校验**：从缓存读取验证码比对 → 验证通过后删除缓存（一次性使用）

如需自定义（例如接入第三方短信平台、修改验证码格式、调整有效期等），实现 `SmsCreateValidateProvider` 接口：

```java
@Component
public class MySmsCreateValidateProvider implements SmsCreateValidateProvider {

    @Override
    public String create(@NonNull String phone) {
        // 自定义验证码生成与发送逻辑
        String code = generateCode();
        sendSmsViaThirdParty(phone, code);
        cacheCode(phone, code);
        return code;
    }

    @Override
    public boolean validate(@NonNull String phone, String code) {
        // 自定义验证码校验逻辑
        String cachedCode = getCachedCode(phone);
        return code != null && code.equals(cachedCode);
    }
}
```

### 3.3 自定义 AuthenticationProvider

如需完全自定义短信认证逻辑（例如增加设备指纹校验、IP 限制等），可替换 `SmsAuthenticationProvider`：

```java
@Component
public class MySmsAuthenticationProvider implements AuthenticationProvider {
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        // 完全自定义认证逻辑
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return SmsAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
```

---

## 4. 原理深入

### 4.1 模块结构总览

**认证模块（smart-auth-extensions-sms）：**

```
smart-auth-extensions-sms
├── AuthSmsSecurityConfigurer       ← 入口配置器，组装整个短信登录功能
├── authentication/
│   ├── SmsAuthenticationToken      ← 认证令牌，承载手机号与验证码
│   └── SmsAuthenticationProvider   ← 认证提供者，执行验证码校验+用户查询
├── filter/
│   ├── SmsCodeCreateFilter         ← 验证码生成过滤器
│   └── SmsLoginFilter              ← 登录认证过滤器
├── provider/
│   ├── SmsCreateValidateProvider          ← 验证码创建/校验接口
│   └── DefaultSmsCreateValidateProviderImpl ← 默认实现
└── userdetails/
    ├── SmsUserDetailService               ← 手机号查用户接口
    └── DefaultSmsUserDetailServiceImpl    ← 默认实现
```

**短信渠道模块（smart-message-extension-sms）：**

```
smart-message-extension-sms
├── smart-message-extensions-sms-aliyun     ← 阿里云短信渠道
│       ├── SmartAliyunSmsChannelService           ← 渠道接口（继承 SmartSmsChannelService）
│       ├── SmartAliyunSmsChannelServiceImpl        ← 渠道实现（阿里云 SMS SDK）
│       └── SmartSmsAliyunChannelProperties         ← 渠道参数（accessKey/accessSecret/endpoint）
├── smart-message-extensions-sms-tencent   ← 腾讯云短信渠道
│       ├── SmartTencentSmsChannelService          ← 渠道接口（继承 SmartSmsChannelService）
│       ├── SmartTencentSmsChannelServiceImpl       ← 渠道实现（腾讯云 SMS SDK）
│       ├── SmartSmsTencentChannelProperties        ← 渠道参数（accessKey/accessSecret/appid/region）
│       └── constants/TencentRegionEnum             ← 地域枚举
└── smart-message-extensions-sms-sdport    ← 山东港口短信平台渠道
        ├── SmartSdportSmsChannelService           ← 渠道接口（继承 SmartSmsChannelService）
        ├── SmartSdportSmsChannelServiceImpl        ← 渠道实现（SOAP 1.1 协议）
        └── SmartSmsSdportChannelProperties         ← 渠道参数（endpoint/namespace/dwdm）
```

### 4.2 Spring Security 集成机制

`AuthSmsSecurityConfigurer` 继承自 `SmartSecurityConfigurerAdapter`，后者继承自 Spring Security 的 `SecurityConfigurerAdapter`。通过 `HttpSecurity.with()` 方法将其纳入安全过滤链。

**核心配置逻辑**（[AuthSmsSecurityConfigurer.configure()](../smart-framework/smart-auth/smart-auth-extensions-sms/src/main/java/com/smart/framework/auth/extensions/sms/AuthSmsSecurityConfigurer.java)）：

```java
@Override
public void configure(H builder) {
    builder
        // 注册自定义 AuthenticationProvider
        .authenticationProvider(this.getBean(SmsAuthenticationProvider.class, this.serviceProvider.authenticationProvider))
        // 在 BasicAuthenticationFilter 之前插入过滤器链
        .addFilterBefore(this.createLoginFilter(builder), BasicAuthenticationFilter.class);
}
```

它做了两件事：
1. **注册 `SmsAuthenticationProvider`**：使其能处理 `SmsAuthenticationToken` 类型的认证请求
2. **注入 `FilterChainProxy`**：将验证码创建和登录两个过滤器包装在同一个代理中，插入到 Spring Security 过滤链

### 4.3 过滤器链详解

`createLoginFilter()` 方法创建了一个 `FilterChainProxy`，其中包含两条 `SecurityFilterChain`：

```
FilterChainProxy
├── SecurityFilterChain[/auth/sms/createCode] → SmsCodeCreateFilter
└── SecurityFilterChain[/auth/sms/login]      → SmsLoginFilter
```

`FilterChainProxy` 会根据请求 URL 自动匹配到对应的 Filter，不会交叉执行。

### 4.4 验证码创建流程

当请求 `POST /auth/sms/createCode?phone=13800138000` 时：

```
SmsCodeCreateFilter.doFilterInternal()
    │
    ├── 1. 从请求参数获取 phone
    ├── 2. 调用 SmsCreateValidateProvider.create(phone)
    │       │
    │       ├── 生成6位随机数字验证码
    │       ├── 调用 SmartMessageApi.sendSms() 发送短信
    │       │       │
    │       │       └── SmartMessageApi → SmartSmsChannelService.send()
    │       │               根据渠道类型路由到具体实现：
    │       │               ├── SmartAliyunSmsChannelServiceImpl   → 阿里云 SMS SDK
    │       │               ├── SmartTencentSmsChannelServiceImpl  → 腾讯云 SMS SDK
    │       │               └── SmartSdportSmsChannelServiceImpl   → 山东港口 SOAP 协议
    │       │
    │       └── 将验证码存入 AuthCache，有效期5分钟
    │           key: smart_auth_sms_login_{phone}
    │           value: 验证码
    │
    └── 3. 返回 Result.success()
```

> 注意：`SmsCodeCreateFilter` 中预留了行为验证码校验（`AuthCaptchaApi.validateToken()`），当前代码已注释，如需防刷可启用。

### 4.5 登录认证流程

当请求 `POST /auth/sms/login?phone=13800138000&code=123456` 时：

```
SmsLoginFilter.attemptAuthentication()
    │
    ├── 1. 从请求参数解析 phone + code → SmsLoginParameter
    ├── 2. 创建未认证的 SmsAuthenticationToken(phone, code)
    ├── 3. 设置 authDomain（认证域）
    └── 4. 交给 AuthenticationManager.authenticate()
            │
            └── SmsAuthenticationProvider.authenticate()
                    │
                    ├── 1. 校验 phone 和 code 非空
                    ├── 2. 调用 SmsCreateValidateProvider.validate(phone, code)
                    │       │
                    │       ├── 从 AuthCache 读取验证码
                    │       ├── 比对验证码是否一致
                    │       └── 验证通过后删除缓存（一次性使用）
                    │
                    ├── 3. 调用 SmsUserDetailService.loadUserByMobile(phone) 查询用户
                    ├── 4. 设置认证类型为 AuthTypeEnum.SMS
                    └── 5. 创建已认证的 SmsAuthenticationToken（含用户权限信息）并返回
```

### 4.6 SmsAuthenticationToken 设计

`SmsAuthenticationToken` 继承自 `AbstractEnhanceAuthenticationToken`，关键属性：

| 属性 | 来源 | 说明 |
|---|---|---|
| `principal` | 手机号 | 认证主体 |
| `credentials` | 验证码 | 认证凭证 |
| `authType` | `AuthTypeEnum.SMS` | 固定为短信登录类型 |
| `authDomain` | 由 `SmsLoginFilter` 设置 | 标识来源认证域（如 ADMIN、MOBILE） |
| `authorities` | 认证成功后由 `UserDetails` 提供 | 用户权限列表 |

Token 有两种状态：
- **未认证**：`new SmsAuthenticationToken(phone, code)` — 无权限列表，`authenticated = false`
- **已认证**：`new SmsAuthenticationToken(userDetails, code, authorities)` — 含权限列表，`authenticated = true`

`SmsAuthenticationProvider.supports()` 方法声明只处理 `SmsAuthenticationToken` 类型，Spring Security 的 `ProviderManager` 据此路由认证请求。

### 4.7 自动配置机制

Boot 模式下的自动配置类 `SmartAuthSmsAutoConfiguration` 通过 Spring Boot 的 `AutoConfiguration.imports` 机制加载，注册三个 Bean：

| Bean | 条件 | 默认实现 |
|---|---|---|
| `SmsAuthenticationProvider` | `@ConditionalOnMissingBean` | 组合 `SmsUserDetailService` + `SmsCreateValidateProvider` |
| `SmsCreateValidateProvider` | `@ConditionalOnMissingBean` | `DefaultSmsCreateValidateProviderImpl`（依赖 `AuthCache` + `SmartMessageApi` + `AuthProperties`） |
| `SmsUserDetailService` | `@ConditionalOnMissingBean` | `DefaultSmsUserDetailServiceImpl`（依赖 `SystemAuthUserApi` + `UserDetailsBuilder`） |

所有 Bean 均使用 `@ConditionalOnMissingBean`，自定义实现只需注册同类型 Bean 即可覆盖默认行为。

### 4.8 依赖关系

**Boot 模式（推荐使用 Starter）：**

```
smart-boot-starter-auth-sms
    ├── smart-auth-extensions-sms          ← 认证核心模块
    │       ├── smart-auth-core            ← 基础认证框架
    │       ├── spring-security-config
    │       ├── smart-message-api          ← 短信发送 API（接口定义）
    │       └── commons-lang3
    └── smart-boot-auth-sms                ← 认证自动配置模块
            ├── smart-auth-extensions-sms (optional)
            └── smart-boot-auth-common   (optional)

+ [短信渠道 Starter - 按需选一个]
    ├── smart-boot-starter-message-sms-aliyun   ← 阿里云 Starter
    │       ├── smart-message-extensions-sms-aliyun   ← 阿里云渠道实现
    │       └── smart-boot-message-sms-aliyun          ← 阿里云自动配置
    ├── smart-boot-starter-message-sms-tencent  ← 腾讯云 Starter
    │       ├── smart-message-extensions-sms-tencent  ← 腾讯云渠道实现
    │       └── smart-boot-message-sms-tencent         ← 腾讯云自动配置
    └── smart-message-extensions-sms-sdport      ← 山东港口（无Starter，需手动注册Bean）
```

**Cloud 模式（直接引用框架模块）：**

```
smart-auth-extensions-sms          ← 认证核心模块
+ [短信渠道模块 - 按需选一个]
    ├── smart-message-extensions-sms-aliyun   ← 阿里云（依赖 dysmsapi20170525 SDK）
    ├── smart-message-extensions-sms-tencent  ← 腾讯云（依赖 tencentcloud-sdk-java-sms）
    └── smart-message-extensions-sms-sdport   ← 山东港口（无外部SDK依赖，使用 JDK HttpClient）
```

`SmartAuthSmsAutoConfiguration` 通过 `@ConditionalOnClass(AuthSmsSecurityConfigurer.class)` 确保只有 classpath 中存在核心模块时才激活。

短信渠道模块与认证模块通过 `SmartMessageApi` 接口解耦：认证模块只依赖 `smart-message-api`（接口定义），实际发送短信的逻辑由渠道模块提供。引入不同的渠道模块即可切换短信服务商，无需修改认证模块代码。

### 4.9 缓存机制

验证码的存储和校验依赖 `AuthCache` 接口，默认实现提供两种选择：

| 实现 | 依赖模块 | 适用场景 |
|---|---|---|
| `RedisAuthCache` | `smart-auth-cache-redis` | 生产环境，支持集群部署 |
| `GuavaAuthCache` | `smart-auth-cache-guava` | 开发/测试环境，单机部署 |

验证码缓存 key 格式：`smart_auth_sms_login_{phone}`，有效期5分钟，验证通过后立即删除。

---

## 5. 注意事项

1. **短信渠道选型**：默认实现依赖 `SmartMessageApi`，需额外引入 `smart-message-extension-sms` 下的一个渠道模块（阿里云/腾讯云/山东港口），否则短信无法实际发送。
2. **用户表字段**：默认实现通过 `SystemAuthUserApi.getByMobile()` 查询用户，需确保用户表中有手机号字段。
3. **防刷保护**：当前验证码创建接口未启用行为验证码校验（代码已注释），生产环境建议启用或自行增加频率限制。
4. **验证码有效期**：默认5分钟，如需调整需自定义 `SmsCreateValidateProvider` 实现。
5. **验证码一次性**：默认实现在验证通过后立即删除缓存，同一验证码不可重复使用。
