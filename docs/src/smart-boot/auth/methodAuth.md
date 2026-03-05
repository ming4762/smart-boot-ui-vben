---
outline: deep
---

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
