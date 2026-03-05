---
outline: deep
---

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

请参考 章节2 配置说明 smart.auth.ignores

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
