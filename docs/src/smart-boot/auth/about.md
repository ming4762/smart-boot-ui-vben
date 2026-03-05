---
outline: deep
---

# 认证

认证模块基于spring-security二次开发

## 一、准备

### 1、启动服务模块引入maven依赖

```xml
<!--	引入认证支持 	-->
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-module-auth</artifactId>
</dependency>

<!--	引入认证缓存支持，这里引入redis 	-->
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-boot-starter-auth-cache-redis</artifactId>
</dependency>

<!--	根据需要引入扩展模块，这里引入jwt支持 	-->
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-boot-starter-auth-jwt</artifactId>
</dependency>
```

### 2、具体的业务模块引入认证核心包，即可使用认证的相关功能

```xml
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-auth-core</artifactId>
    <version>${project.version}</version>
</dependency>
```

### 3、添加认证配置类

::: details 认证配置类

```java
import com.smart.auth.extensions.access.secret.AuthAccessSecretSecurityConfigurer;
import com.smart.framework.auth.core.properties.AuthProperties;
import com.smart.framework.auth.core.remember.SmartAuthPersistentTokenRememberMeServices;
import com.smart.framework.auth.extensions.jwt.AuthJwtSecurityConfigurer;
import com.smart.module.auth.config.AuthCaptchaSecurityConfigurer;
import com.smart.module.auth.config.AuthTenantSecurityConfigurer;
import com.smart.module.auth.config.AuthWebSecurityConfigurerAdapter;
import lombok.SneakyThrows;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;

@Configuration(proxyBeanMethods = false)
@EnableWebSecurity
public class SecurityConfig extends AuthWebSecurityConfigurerAdapter {

    public SecurityConfig(AuthProperties authProperties) {
        super(authProperties);
    }

    @SneakyThrows(Exception.class)
    @Bean
    @Order(0)
    public SecurityFilterChain securityFilterChainConfig(HttpSecurity httpSecurity, SmartAuthPersistentTokenRememberMeServices rememberMeServices, AuthenticationSuccessHandler authenticationSuccessHandler) {
        super.configure(httpSecurity);
        httpSecurity.formLogin(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .sessionManagement(configurer -> configurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // JWT配置
                .with(AuthJwtSecurityConfigurer.jwt(), Customizer.withDefaults())
                // 验证码配置
                .with(AuthCaptchaSecurityConfigurer.captcha(), Customizer.withDefaults())
                // 租户支持
                .with(AuthTenantSecurityConfigurer.tenant(), Customizer.withDefaults());
        return httpSecurity.build();
    }
}
```

:::

## 二、配置说明

::: details yaml配置

```yaml
smart:
  auth:
    #    认证缓存的前缀，多个系统使用一个缓存应单独设置
    prefix: smart-session
    #    是否是开发模式：开发模式下，不进行认证（一般不建议设置为true）
    development: false
    #    是否开启方法权限校验
    method: true
    jwt:
      #      是否启用jwt
      enabled: false
      #      是否使用缓存存储权限信息,如果设置为false,权限信息会写入jwt中,可能导致jwt过长
      permission-cache: false
      #      jwt私钥
      private-key: classpath:auth/jwt/key/pri.key
      #      jwt公钥
      public-key: classpath:auth/jwt/key/pub.key
    session:
      timeout:
        #        session全局过期时间
        global: 1800s
        #        移动端过期时间
        mobile: 2592000s
        #        开启remember功能后，过期时间
        remember: 604800s
    #    SAML2单点登录配置
    saml2:
      #      saml2 entity
      entity-id: null
      key:
        name: null
        file-path: null
        password: null
      entity-base-url: null
      #      saml2登录失败重试次数
      retry: 5
      identity:
        discovery-enabled: true
        metadata-file-path: null
    #    忽略认证配置
    ignores:
      #      需要忽略的 URL 格式，不考虑请求方法
      pattern:
        - /public/**
      #      忽略的 GET 请求，以下同此
      get:
      post:
      delete:
      put:
      head:
      patch:
      options:
      trace:
    #    临时token配置
    temp-token:
      timeout: 60s
    #    短信登录配置
    sms:
      #      短信签名
      sign-name: null
      #      短息模板
      template: null
    #    验证码配置
    captcha:
      enabled: true
      #      验证码类型：SLIDER滑块 CONCAT滑动还原 WORD_IMAGE_CLICK文字点选 TEXT_PNGpng格式 TEXT_GIFGIF文本 TEXT_CHINESE中文文本 TEXT_CHINESE_GIF中文GIF文本 TEXT_ARITHMETIC算数类型
      type: text_png
      #      获取验证码的URL
      create-url: /auth/createCaptcha
      #      验证码有效期
      expire-in: 5m
      #      文本验证码参数
      text:
        #        字符长度
        length: 4
        #        宽度
        width: 130
        #        高度
        height: 40
        #        字体
        font: null
        #        文本类型：1 字母数字混合，2 纯数字，3 纯字母，4 纯大写字母，5 纯小写字母，6 数字大写字母
        char-type:
        #        是否忽略大小写
        ignore-case: true
    #    access secret模式配置
    access-secret:
      #      校验的URL
      url-matcher:
      #      token前缀
      token-prefix: SMART-BOOT
      #      过期时间
      expire: 10m
```

:::

## 三、获取用户信息

### 1、后台获取用户信息

后台提供静态工具类`com.smart.framework.auth.core.utils.AuthUtils`用于获取用户信息

::: details AuthUtils

```java
public final class AuthUtils {

    /**
     * 是否是超级管理员
     * @return 是否是超级管理员
     */
    boolean isSuperAdmin();

    /**
     * 获取当前登录用户
     * @return 当前用户
     */
    RestUserDetails getCurrentUser();

    /**
     * 获取当前登录用户（不能为null）
     * @return 当前登录用户
     */
   	RestUserDetails getNonNullCurrentUser();

    /**
     * 获取当前登录人员用户名
     * @return 用户名
     */
    String getCurrentUsername();

    /**
     * 获取当前用户ID
     * @return 当前用户ID
     */
    Long getCurrentUserId();

    /**
     * 获取当前登录用户ID（不能为null）
     * @return 当前登录用户ID
     */
    Long getNonNullCurrentUserId();

    /**
     * 判断是否拥有权限
     * @param permission 权限
     * @return true：拥有权限
     */
    boolean hasPermission(@NonNull String permission);

    /**
     * 当前用户是否是平台管理租户
     * @return boolean
     */
    boolean isPlatformTenant();

    /**
     * 获取当前租户ID
     * @return 租户ID
     */
    Long getCurrentTenantId();

    /**
     * 获取当前租户ID
     * @return 租户ID
     */
    Long getNonNullCurrentTenantId();

    /**
     * 获取Authentication
     * @return Authentication
     */
    Authentication getAuthentication();
}
```

:::

### 2、前台获取用户信息

前台提供store：useUserStore获取用户信息

::: details useUserStore

```typescript
import { useUserStore } from '@vben/stores';

const userStore = useUserStore();

// 用户信息
userStore.userInfo;
// 用户角色
userStore.userRoles;
// 是否是平台管理租户
userStore.getIsPlatformTenant;
// 是否是超级管理员角色
userStore.getIsSuperAdmin;
// 获取用户租户信息
userStore.getUserTenant;
```

:::
