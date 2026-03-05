---
outline: deep
---

## 七、短信登录

### 1、引入依赖

```xml
<!--      引入短信支持模块，系统提供阿里云和腾讯云，当然也可以自行实现接口：com.smart.framework.message.core.service.SmartSmsChannelService      -->
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-boot-starter-message-sms-aliyun</artifactId>
</dependency>
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-boot-starter-message-sms-tencent</artifactId>
</dependency>

<!--      引入短信登录支持      -->
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-boot-starter-auth-sms</artifactId>
</dependency>
```

### 2、配置短信通道

在页面`消息中心-消息通道`配置短信通道

![image-20250120142644563](images\image-20250120142644563.png)

### 3、配置认证配置

在默认的过滤器链配置短信登录

```java
@SneakyThrows(Exception.class)
    @Bean
    @Order(0)
    public SecurityFilterChain securityFilterChainConfig(HttpSecurity httpSecurity, SmartAuthPersistentTokenRememberMeServices rememberMeServices, AuthenticationSuccessHandler authenticationSuccessHandler) {
        super.configure(httpSecurity);
        httpSecurity.formLogin(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .rememberMe(
                        config -> config.rememberMeServices(rememberMeServices)
                                .authenticationSuccessHandler(authenticationSuccessHandler)
                )
                .sessionManagement(configurer -> configurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // JWT配置
                .with(AuthJwtSecurityConfigurer.jwt(), Customizer.withDefaults())
                // 验证码配置
                .with(AuthCaptchaSecurityConfigurer.captcha(), Customizer.withDefaults())
                // 短信登录支持
                .with(AuthSmsSecurityConfigurer.sms(), Customizer.withDefaults())
                // 租户支持
                .with(AuthTenantSecurityConfigurer.tenant(), Customizer.withDefaults());
        return httpSecurity.build();
    }
```

## 八、认证域设置

::: tip

认证域用于强制隔离认证授权，防止不同客户端权限溢出

:::

### 1、引入依赖

```xml
<dependency>
  <groupId>com.smart</groupId>
  <artifactId>smart-boot-starter-auth-domain</artifactId>
</dependency>
```

### 2、为SecurityFilterChain设置认证域，以JWT为例

```java
public SecurityFilterChain adminSecurityFilterChainConfig(HttpSecurity httpSecurity) {
      super.configure(httpSecurity);
      httpSecurity.formLogin(AbstractHttpConfigurer::disable)
              .httpBasic(AbstractHttpConfigurer::disable)
              // JWT配置
              .sessionManagement(config -> config.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
              .with(AuthJwtSecurityConfigurer.jwt(), jwt -> jwt.authDomain(AuthDomainConstants.AUTH_DOMAIN_ADMIN))
      return httpSecurity.build();
  }
```

### 3、指定接口认证域

> 函数和接口都可添加认证域，函数优先级高
>
> 认证域可指定多个，用户有任何一个即可访问该接口

```java
@RestController
@RequestMapping("test")
@AuthDomain({"ADMIN", "CLIENT"})
public class TestController {

    @PostMapping("test")
    @AuthDomain("CLIENT")
    public Result<Boolean> test() {
        return Result.success(true);
    }
}
```
