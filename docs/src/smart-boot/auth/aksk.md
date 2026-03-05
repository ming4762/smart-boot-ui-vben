
::: tip

AK/SK认证用于第三方系统基于AK/SK模式进行对接

:::

### 1、开启AK/SK认证

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
| 8 | nonce | string | 随机字符串，10分钟内不可重复使用 | header/query |

PARAMETER构成

parameter按照下面参数的顺序拼接

| 序号 | 参数 |
| --- | --- |
| 1 | PATH：请求路径，例如接口地址：localhost:8080/access/api/test，path：/access/api/test |
| 2 | query：URLquery参数，按照字典排序拼接，例如：a1=a&a2=a&b1=b |
| 3 | body参数：按照字典排序，json如果是多层，每一层都需要排序 |

::: details 代码示例

```java
String httpMethod = request.getMethod();
String contentType = request.getHeader(HttpHeaders.CONTENT_TYPE).split(";")[0];
String date = request.getHeader(HttpHeaders.DATE);
String parameterStr = "构建参数";
String nonce ="随机字符串";
String encryptKey = String.join(":", List.of(httpMethod, contentType, date, nonce, parameterStr));

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
