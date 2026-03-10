---
outline: deep
---

::: tip

微信登录支持小程序登录和微信服务号扫码登录

后续增加微信OAUTH登录

:::

## 一、开启微信登录

### 1、引入maven依赖

```xml
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-boot-starter-auth-wechat</artifactId>
</dependency>
```

### 2、SecurityFilterChain引入微信配置

> 基于默认配置开启微信登录

默认登录地址：

小程序登录：/auth/wechat/miniapp/login

服务号创建二维码：/auth/wechat/mp/createQrcode

服务号登录：/auth/wechat/mp/login

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) {
    return httpSecurity
            .with(AuthWechatSecurityConfigurer.wechat(), config -> {
                // 开启微信服务号二维码扫码登录
                config.mpQrcode();
                // 开启微信小程序扫码登录
                config.miniapp();
            }).build();
}
```

### 3、添加微信配置

```yml
smart:
  wechat:
    # 微信存储redis的key
    key-prefix: smart:wechat
    minapp:
      configs:
        - appid: ${your appid}
          secret: ${your secret}
          token: ${your token}
    mp:
      configs:
        - appid: ${your appid}
          secret: ${your secret}
          token: ${your token}
```

## 二、前台调用

### 1、小程序登录

> YOUR_APPID参数可选，如果后台配置多个小程序，可以通过前台指定需要登录哪个小程序

```she
curl -X POST http://your-domain.com/auth/wechat/miniapp/login \
     -d "appid=YOUR_APPID&code=YOUR_CODE"
```

### 2、服务号扫码登录

::: details 示例

```typescript

/**
 * 定时刷新计时器
 */
let timer: NodeJS.Timeout | null = null;
/**
 * 循环获取登录状态
 */
let loopExecutor: LoopExecutor | null = null;

/**
 * 登录函数
 */
async function mpQrcodeLogin() {
  const scene = unref(sceneRef);
  if (!scene) {
    throw new Error('系统异常，scene为null');
  }
  const loginResult = await authMpQrcodeLoginApi(scene);
  const { code, subCode } = loginResult;
  if (code === 401 && subCode === 40_030) {
    // 用户还未扫码
    return;
  }
  if (code === 401 && subCode === 40_029) {
    // 二维码已过期
    fetchQrCode();
    return;
  }
  // 用户未绑定
  if (code === 401 && subCode === 40_031) {
    // todo: 跳转到绑定页面
    return;
  }
  // TODO: 处理登录成功逻辑
  // 判断是否登录成功，成功终止循环
  if (loopExecutor) {
    loopExecutor.stop();
  }
}

async function fetchQrCode() {
  if (timer) {
    clearTimeout(timer);
  }
  if (loopExecutor) {
    // 终止之前的循环
    loopExecutor.stop();
  }
  loadingRef.value = true;
  sceneRef.value = '';
  // Simulate fetching QR code
  try {
    const { scene, url, expireSeconds } = await authCreateQrcodeApi();
    qrCodeUrlRef.value = url;
    sceneRef.value = scene;
    // 超时后重新刷新
    if (expireSeconds) {
      timer = setTimeout(() => {
        fetchQrCode();
      }, expireSeconds * 1000);
    }
    // 循环获取登录扫码状态
    loopExecutor = createLoopExecutor({
      action: mpQrcodeLogin,
      interval: 2000,
      duration: expireSeconds * 1000,
    });
    setTimeout(() => loopExecutor?.start(), 2000);
  } finally {
    loadingRef.value = false;
  }
}
```
:::


## 使用认证域

```java
@Bean
public SecurityFilterChain adminSecurityFilterChain(HttpSecurity httpSecurity) {

    httpSecurity.with(AuthWechatSecurityConfigurer.wechat(), config -> {
                // 添加微信小程序登录
                config.miniapp().addAuthDomain("CLIENT", new SmartAuthDomainConfig("/auth/client/wechat/miniappLogin"));
                // 添加服务号二维码登录
                config.mpQrcode().addAuthDomain("CLIENT", new SmartAuthDomainConfig("/auth/client/wechat/mpLogin"));
            });
    return httpSecurity.build();
}
```

