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

## 三、方法权限校验

### 1、配置文件开启方法权限校验（默认已开启）

```yaml
smart:
  auth:
    method: true
```

### 2、在需要权限的方法上添加注解

```java
// 需要sys:function:save 或 sys:function:update 权限可访问该接口
@PostMapping("saveUpdate")
@PreAuthorize("hasPermission('sys:function', 'save') or hasPermission('sys:function', 'update')")
public Result<Boolean> saveUpdate(@RequestBody SysFunctionPO model)
```

### 3、功能管理中配置相应的权限，并在角色管理中授权

![image-20250120094643660](images\image-20250120094643660.png)

### 4、前台权限

前台参考`vben5文档-深入-权限：按钮细粒度控制`章节

在vben的基础上，提供一个函数：hasAccessByAuth，请优先使用该函数

```typescript
import { useAccess } from '@vben/access';

const { hasAccessByAuth } = useAccess();

function hasAccessByAuth(auth?: SmartAuthType);
```

## 四、临时令牌

::: tip

JWT模式下，认证信息通过header传输，在一些特殊场景下无法设置请求头（例如文件下载），认证会失效导致401错误，这些场景需要使用临时令牌验证方式

开启临时令牌需要在认证配置类添加注解 @EnableAuthTempToken

:::

### 1、申请临时令牌

临时令牌请求地址：`/auth/tempToken/apply`

临时令牌默认有效期60S，可以通过配置文件修改，具体参考`章节2 配置说明`

请求参数：

resource：临时令牌需要使用的资源，用户必须拥有该权限才可申请相应的临时令牌

once：临时令牌是否只可使用一次，默认true

```json
// 请求参数示例
{
    "resource": "sys:test:temp",
    "once": true
}
// 返回结果示例
{
    "code": 200,
    "message": "成功",
    "success": true,
    "data": "eyJpcCI6IjA6MDowOjA6MDowOjA6MSIsInVzZXJJZCI6MSwicmVzb3VyY2UiOiJzeXM6dGVzdDp0ZW1wIiwib25jZSI6dHJ1ZX0="
}
```

前台已提供快捷获取临时token的办法

```typescript
import { useAuthStore } from '#/store';

const { applyTempToken } = useAuthStore();
// 申请临时令牌
const tempToken = await applyTempToken('smart:file:download');
```

### 2、使用临时令牌

::: tip

使用临时令牌接口需要取消登录认证，认证交由临时令牌校验，否则会报401错误

请参考 章节2 配置说明 gc.auth.ignores

:::

#### 2.1、接口添加临时令牌校验注解

com.smart.framework.auth.core.annotation.TempToken

参数说明：

resource：接口对应的资源权限，临时令牌申请的权限和该权限必须一致

ipValidate：是否验证IP，申请令牌的IP和使用令牌的IP必须一致，默认true

示例：

```java
// 接口示例
@PostMapping("public/test")
@TempToken(resource = "smart:file:download")
public Result<Boolean> download() {
    return Result.success(true);
}
```

#### 2.2、前台请求接口时在URL上拼接临时令牌

临时令牌的key为：access-token

请求地址示例：/public/test?access-token=eyJpcCI6IjA6MDowOjA6MDowOjA6MSIsInVzZXJJZCI6MSwicmVzb3VyY2UiOiJzeXM6dGVzdDp0ZW1wIiwib25jZSI6dHJ1ZX0=

## 五、获取用户信息

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

## 六、access secret认证

::: tip

access secret模式用于第三方系统基于AK/SK模式进行对接

:::

### 1、开启access secret模式

在认证配置类中添加access secret过滤器链，开启access secret

需要特别注意 bean 的order，设置为Integer.MIN_VALUE，保证过滤链在最前

```java
@Configuration(proxyBeanMethods = false)
@EnableWebSecurity
public class SecurityConfig extends AuthWebSecurityConfigurerAdapter {

    @SneakyThrows({Exception.class})
    @Bean
    @Order(Integer.MIN_VALUE)
    public SecurityFilterChain secretSecurityFilterChain(HttpSecurity httpSecurity) {
        super.configure(httpSecurity);
        httpSecurity.formLogin(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .sessionManagement(configurer -> configurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            	// access secret拦截的地址
                .securityMatcher("/access/api/**")
                .with(AuthAccessSecretSecurityConfigurer.build(), Customizer.withDefaults());
        return httpSecurity.build();
    }
}
```

### 2、在后台管理页面`系统工具-Access Secret`添加access secret

![image-20250120111240199](images\image-20250120111240199.png)

### 3、第三方系统如何生成签名

::: tip

需要将生成的token放到header或URL query：Authorization

请求header需要额外添加的参数：Content-Type、Date，具体请参考下面的参数说明；

:::

参数说明

| 序号 | 参数 | 类型 | 说明 | 传输方式 |
| --- | --- | --- | --- | --- |
| 1 | ACCESS_KEY | string | 提供的ACCESS_KEY |  |
| 2 | SECRET_KEY | string | 提供的SECRET_KEY，secret应严格保存，不用放到前台或通过接口传输 |  |
| 3 | HTTP_METHOD | PUT、GET、POST、HEAD、DELETE、OPTIONS | http请求头 | header |
| 4 | CONTENT_TYPE | string | 请求类型，例如：application/json | header |
| 5 | DATE | string | 请求的时间，格式为GMT，且与服务器时间差值不能大于10分钟，请求头key为：Date | header/query |
| 6 | PARAMETER | string | 参数信息，由3部分构成，参考下面的说明 |  |
| 7 | PREFIX | string | 系统前缀，一般用第三方系统的简称 |  |

PARAMETER构成

parameter按照下面参数的顺序拼接

| 序号 | 参数                                                         |
| ---- | ------------------------------------------------------------ |
| 1    | PATH：请求路径，例如接口地址：http://localhost:8080/access/api/test，path：/access/api/test |
| 2    | query：URLquery参数，按照字典排序拼接，例如：a1=a&a2=a&b1=b  |
| 3    | body参数：按照字典排序，json如果是多层，每一层都需要排序     |

::: details 代码示例

```java
String httpMethod = request.getMethod();
String contentType = request.getHeader(HttpHeaders.CONTENT_TYPE).split(";")[0];
String date = request.getHeader(HttpHeaders.DATE);
String parameterStr = "构建参数";
String encryptKey = String.join(":", List.of(httpMethod, contentType, date, parameterStr));

// 生成签名
String signature = base64(hmacSha256Encrypt(SECRET_KEY, encryptKey))
// 生成Authorization
String Authorization = "${PREFIX}" + ACCESS_KEY + ":" + signature;


// hmacSha1 加密
public static byte[] hmacSha256Encrypt(String encryptContent, String encryptKey) {

    byte[] keyBytes = encryptKey.getBytes(StandardCharsets.UTF_8);
    SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, "HmacSHA256");

    Mac mac = Mac.getInstance("HmacSHA256");
    mac.init(secretKeySpec);
    byte[] contentBytes = encryptContent.getBytes(StandardCharsets.UTF_8);

    return mac.doFinal(contentBytes);
}

// base64编码
public static String base64(@NonNull byte[] bytes) {
    return Base64.getEncoder().encodeToString(bytes);
}
```

:::

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
