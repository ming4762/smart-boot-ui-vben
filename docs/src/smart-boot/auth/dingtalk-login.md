# 钉钉登录使用说明

## 1. 快速开始

三步启用钉钉登录。

**第一步：引入依赖**

```xml
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-boot-starter-auth-dingtalk</artifactId>
</dependency>
```

**第二步：添加配置**

```yaml
smart:
  auth:
    dingtalk:
      client-id: your-dingtalk-client-id
      client-secret: your-dingtalk-client-secret
```

**第三步：注册配置器**

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.with(new SmartAuthDingtalkConfigurer<>(), Customizer.withDefaults());
    return http.build();
}
```

完成。前端将钉钉授权码发送到 `POST /auth/dingtalk/webLogin?code=xxx` 即可登录。

---

## 2. 登录接口

| 接口     | 方法 | 地址                      | 参数                |
| -------- | ---- | ------------------------- | ------------------- |
| 钉钉登录 | POST | `/auth/dingtalk/webLogin` | `code` — 钉钉授权码 |

---

## 3. 配置属性

配置前缀：`smart.auth.dingtalk`

| 属性            | 必填 | 说明                                         |
| --------------- | ---- | -------------------------------------------- |
| `client-id`     | 是   | 钉钉应用 ClientID                            |
| `client-secret` | 是   | 钉钉应用 ClientSecret                        |
| `corp-id`       | 否   | 组织ID，限定用户登录所选组织，不配置则不限制 |

> 在钉钉开放平台（https://open.dingtalk.com）创建应用时获取 ClientID 和 ClientSecret，需确保应用已开通 **登录** 能力并配置了授权回调地址。

---

## 4. 自定义扩展

### 4.1 自定义认证域

区分不同端的钉钉登录，配置独立的登录路径：

```java
http.with(new SmartAuthDingtalkConfigurer<>(), configurer ->
    configurer.addAuthDomain(
        AuthDomainConstants.AUTH_DOMAIN_ADMIN,
        SmartAuthDomainConfig.builder()
            .loginUrl("/auth/dingtalk/adminLogin")
            .build()
    )
);
```

### 4.2 自定义登录成功/失败处理器

```java
http.with(new SmartAuthDingtalkConfigurer<>(), configurer ->
    configurer
        .authenticationSuccessHandler(mySuccessHandler)
        .authenticationFailureHandler(myFailureHandler)
);
```

### 4.3 自定义用户加载逻辑

Starter 默认注册了 `DefaultDingtalkUserDetailServiceImpl`，通过 `SystemAuthUserApi` 根据 unionId 查询用户。自定义实现会自动替换默认实现：

```java
@Component
public class MyDingtalkUserDetailService implements DingtalkUserDetailService {

    @Override
    public RestUserDetails loadUserByUnionId(String unionId) {
        // 根据 unionId 查询系统用户，返回 null 表示未绑定
        return userService.findByDingtalkUnionId(unionId);
    }

    @Override
    public RestUserDetails loadUserByOpenId(String clientId, String openId) {
        return userService.findByDingtalkOpenId(clientId, openId);
    }

    @Override
    public RestUserDetails loadUserByMobile(String mobile) {
        return userService.findByMobile(mobile);
    }
}
```

---

## 5. 认证流程

从整体视角理解钉钉登录的完整流程：

```
用户 ──授权──> 钉钉 ──authCode──> 前端 ──code──> 后端 ──认证成功──> 登录凭证
```

具体步骤：

1. 前端引导用户到钉钉授权页面
2. 用户在钉钉端确认授权
3. 钉钉回调前端，携带授权码（authCode）
4. 前端将 authCode 发送至后端钉钉登录接口
5. 后端完成认证，返回登录凭证

---

## 6. 核心组件

后端认证流程由三个核心组件协作完成：

```
DingtalkLoginFilter（拦截请求）
        │
        ▼
DingtalkAuthenticationProvider（执行认证）
        │
        ▼
DingtalkUserDetailService（加载用户）
```

### 6.1 DingtalkLoginFilter — 拦截登录请求

职责：拦截钉钉登录请求，从请求参数中提取授权码。

- 拦截路径默认为 `/auth/dingtalk/webLogin`
- 从请求中获取 `code` 参数，创建 `DingtalkAuthenticationToken`
- 将 Token 交给 `AuthenticationManager` 处理

### 6.2 DingtalkAuthenticationProvider — 执行认证

职责：调用钉钉 API 完成认证，核心逻辑如下：

1. 切换到配置的钉钉应用（`clientId`）
2. 使用 authCode 调用钉钉 API 换取用户访问令牌（UserAccessToken），同时获取 `corpId`
3. 使用 UserAccessToken 获取钉钉用户信息（unionId 等）
4. 调用 `DingtalkUserDetailService.loadUserByUnionId()` 查询系统用户
5. 校验认证域权限
6. 认证成功，构造已认证的 `DingtalkAuthenticationToken`

### 6.3 DingtalkUserDetailService — 加载系统用户

职责：根据钉钉用户标识查询系统用户，接口定义了三种查询方式：

| 方法                | 参数             | 说明                              |
| ------------------- | ---------------- | --------------------------------- |
| `loadUserByUnionId` | unionId          | 默认认证流程使用，按 unionId 查询 |
| `loadUserByOpenId`  | clientId, openId | 按 openId 查询                    |
| `loadUserByMobile`  | mobile           | 按手机号查询                      |

返回 `null` 表示该钉钉用户未绑定系统账号，将抛出 `DingtalkNotBoundException`。

---

## 7. DingtalkAuthenticationToken

钉钉登录的认证凭证，继承自 `AbstractEnhanceAuthenticationToken`：

| 字段          | 类型         | 说明                               |
| ------------- | ------------ | ---------------------------------- |
| `corpId`      | String       | 用户登录时所选的组织ID             |
| `credentials` | Object       | 授权码（authCode）                 |
| `principal`   | Object       | 认证成功后为 `RestUserDetailsImpl` |
| `authType`    | AuthTypeEnum | 固定为 `DINGTALK`                  |
| `authDomain`  | String       | 当前登录的认证域                   |

获取钉钉登录特有信息：

```java
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
if (auth instanceof DingtalkAuthenticationToken dingtalkToken) {
    String corpId = dingtalkToken.getCorpId();
}
```

---

## 8. 异常处理

| 异常 | 父类 | 触发场景 |
| --- | --- | --- |
| `DingtalkNotBoundException` | `BadCredentialsException` | 钉钉用户未绑定系统账号 |
| `AuthException` | RuntimeException | 用户不在指定认证域内 |
| `IllegalArgumentException` | RuntimeException | 请求未携带 code 参数 |

### 8.1 处理未绑定用户

`DingtalkNotBoundException` 携带了钉钉用户信息（`GetUserResponseBody`），可用于引导绑定：

```java
if (exception instanceof DingtalkNotBoundException e) {
    GetUserResponseBody dingtalkUser = e.getDingtalkUser();
    String mobile = dingtalkUser.getMobile();
    // 引导用户绑定系统账号
}
```

---

## 9. SmartAuthDingtalkConfigurer 详解

`SmartAuthDingtalkConfigurer` 是钉钉登录的 Spring Security 配置器，负责将上述组件注册到安全过滤器链中。

### 9.1 配置过程

1. 创建 `DingtalkAuthenticationProvider` 并注册为认证提供者
   - 优先从 Spring 容器获取，不存在则自动创建
2. 为每个认证域创建 `DingtalkLoginFilter`，注册到 `BasicAuthenticationFilter` 之前

### 9.2 认证域默认值

未配置认证域时，默认使用 `NONE` 域，登录路径为 `/auth/dingtalk/webLogin`：

```java
Map.of(
    AuthDomainConstants.AUTH_DOMAIN_NONE,
    SmartAuthDomainConfig.builder()
        .loginUrl(DefaultAuthUrlEnum.DINGTALK_WEB_LOGIN.getUrl())
        .build()
)
```

### 9.3 与其他认证方式组合

```java
http
    .with(AuthWebSecurityConfigurer.web(), web -> web
        .addAuthDomain("ADMIN",
            SmartAuthDomainConfig.builder().loginUrl("/auth/login").build()))
    .with(new SmartAuthDingtalkConfigurer<>(), Customizer.withDefaults())
    .with(AuthSmsSecurityConfigurer.sms(), sms -> sms
        .addAuthDomain("NONE",
            SmartAuthDomainConfig.builder().loginUrl("/auth/sms/login").build()));
```

---

## 10. 钉钉应用与 DingtalkApi

钉钉 API 调用由 `smart-extensions-dingtalk` 模块提供，`smart-boot-starter-dingtalk` 负责自动配置。

`DingtalkApi` 是统一入口，支持多应用切换：

```java
@Autowired
private DingtalkApi dingtalkApi;

// 切换到指定应用
dingtalkApi.switchover("your-client-id");

// 用户相关 API
UserApi userApi = dingtalkApi.userApi();

// OAuth2 登录相关 API
AccessSecureApi accessSecureApi = dingtalkApi.accessSecureApi();
```

钉钉登录认证流程中，`DingtalkAuthenticationProvider` 会自动使用 `smart.auth.dingtalk.client-id` 切换到对应应用，无需手动调用。
