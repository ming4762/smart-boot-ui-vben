# 目录说明

使用maven多模块管理项目，项目结构如下：

```bash
.
├─deployment # 部署文档
├─smart-boot-framework # spring-boot相关包
│  ├─smart-boot-actuator # actuator增强
│  ├─smart-boot-actuator-autoconfigure # actuator自动配置
│  ├─smart-boot-autoconfigure # smart-boot自动配置
│  └─smart-boot-starters # starters
│      ├─smart-boot-starter-actuator # actuator增强starter
│      ├─smart-boot-starter-auth # 认证模块starter
│      │  ├─smart-boot-starter-auth-access-secret # access-secret扩展
│      │  ├─smart-boot-starter-auth-cache-guava # 认证缓存 基于guava实现
│      │  ├─smart-boot-starter-auth-cache-redis # 认证缓存 基于redis实现
│      │  ├─smart-boot-starter-auth-captcha # 验证码扩展
│      │  ├─smart-boot-starter-auth-jwt # jwt扩展
│      │  ├─smart-boot-starter-auth-saml2 # SAML2单点登录扩展
│      │  ├─smart-boot-starter-auth-sms # 短信登录扩展
│      │  └─smart-boot-starter-auth-wechat # 微信登录扩展
│      ├─smart-boot-starter-captcha # 验证码starter
│      ├─smart-boot-starter-crud # crud starter
│      ├─smart-boot-starter-dingtalk # dingtalk扩展starter
│      ├─smart-boot-starter-document # 文档相关模块
│      │  ├─smart-boot-starter-document-code-zxing # 基于zxing实现starter
│      │  ├─smart-boot-starter-document-converter-jod # jod转换模块starter
│      │  ├─smart-boot-starter-document-converter-office # 基于office转换模块starter
│      │  └─smart-boot-starter-document-excel-jxls # jxls增强starter
│      ├─smart-boot-starter-exception # 异常模块starter
│      ├─smart-boot-starter-file # 文件扩展模块starter
│      │  ├─smart-boot-starter-file-aliyun # 阿里云OSS starter
│      │  ├─smart-boot-starter-file-disk # 磁盘文件存储starter
│      │  ├─smart-boot-starter-file-ftp # ftp存储starter
│      │  ├─smart-boot-starter-file-minio # minio存储starter
│      │  ├─smart-boot-starter-file-qiniu #七牛云文件存储starter
│      │  ├─smart-boot-starter-file-s3 # S3文件存储starter
│      │  └─smart-boot-starter-file-sftp # SFTP文件存储starter
│      ├─smart-boot-starter-freemarker # freemarker增强starter
│      ├─smart-boot-starter-guava # gauva缓存starter
│      ├─smart-boot-starter-i18n # 国际化增强starter
│      ├─smart-boot-starter-kettle # kettle starter
│      ├─smart-boot-starter-license-client # license客户端starter
│      ├─smart-boot-starter-license-server # license服务端starter
│      ├─smart-boot-starter-log # 日志存储模块starter
│      ├─smart-boot-starter-message # 消息模块
│      │  ├─smart-boot-starter-message-dingtalk # 钉钉消息starter
│      │  ├─smart-boot-starter-message-email # 邮件starter
│      │  ├─smart-boot-starter-message-sms-aliyun # 阿里云SMS starter
│      │  ├─smart-boot-starter-message-sms-tencent # 腾讯云SMS starter
│      │  └─smart-boot-starter-message-websocket # websocket starter
│      ├─smart-boot-starter-monitor-client # 监控模块客户端（已废弃）
│      ├─smart-boot-starter-monitor-server # 监控模块服务端（已废弃）
│      ├─smart-boot-starter-redis # redis扩展starter
│      ├─smart-boot-starter-tool-database # 数据库工具starter
│      ├─smart-boot-starter-wechat # 微信扩展starter
│      └─smart-boot-starter-xxl # xxl执行器starter
├─smart-cloud-framework # 微服务模块
│  ├─smart-cloud-common-core # 微服务核心包
│  ├─smart-cloud-module-api # 微服务服务件接口
│  │  ├─smart-cloud-auth-api # 认证模块接口
│  │  ├─smart-cloud-file-api # 文件模块接口
│  │  ├─smart-cloud-message-api # 消息模块接口
│  │  └─smart-cloud-system-api # 系统模块接口
│  └─smart-cloud-starters # 微服务模块starter
│      ├─smart-cloud-starter-auth # 认证模块starter
│      ├─smart-cloud-starter-exception # 异常模块starter
│      ├─smart-cloud-starter-feign # feign starter，使用feign的微服务都应引入
│      ├─smart-cloud-starter-i18n # 国际化starter
│      └─smart-cloud-starter-log # 日志模块starter
├─smart-cloud-services # 微服务启动模块
│  ├─smart-cloud-service-auth # 认证模块
│  ├─smart-cloud-service-code # 代码生成器模块
│  ├─smart-cloud-service-file # 文件管理模块
│  ├─smart-cloud-service-gateway # gateway
│  ├─smart-cloud-service-message # 消息模块
│  └─smart-cloud-service-system # 系统管理模块
├─smart-framework # smart-boot框架
│  ├─smart-auth # 认证模块
│  │  ├─smart-auth-cache-guava # guava缓存扩展
│  │  ├─smart-auth-cache-redis # redis缓存扩展
│  │  ├─smart-auth-captcha # 验证码模块
│  │  ├─smart-auth-core # 认证核心包
│  │  ├─smart-auth-extensions-access-secret # access-secret扩展
│  │  ├─smart-auth-extensions-jwt # jwt扩展
│  │  ├─smart-auth-extensions-saml2 #SAML2单点登录扩展
│  │  ├─smart-auth-extensions-sms # 短信登录若站
│  │  └─smart-auth-extensions-wechat # 微信登录扩展
│  ├─smart-cache-guava # guava缓存
│  ├─smart-commons # commons包
│  │  ├─smart-commons-core # 框架核心包
│  │  ├─smart-commons-jwt # jwt工具包
│  │  ├─smart-commons-server # 获取服务器信息工具包
│  │  └─smart-commons-validate # 验证工具包
│  ├─smart-crud # crud 增强mybatis plus
│  ├─smart-document # 文档模块
│  │  ├─smart-document-code-zxing # zxing
│  │  ├─smart-document-converter-jod # 基于JOD文档转换
│  │  ├─smart-document-converter-office # 基于office文档转换
│  │  ├─smart-document-core # 文档模块核心包
│  │  └─smart-document-excel-jxls # jxls扩展包
│  ├─smart-exception # 异常管理
│  ├─smart-extensions # 扩展包
│  │  ├─smart-extensions-captcha # 验证码扩展包
│  │  ├─smart-extensions-dingtalk # 钉钉扩展包
│  │  └─smart-extensions-wechat # wechat扩展包
│  ├─smart-file # 文档模块
│  │  ├─smart-file-core # 文档模块核心包
│  │  ├─smart-file-extensions-aliyun-oss # 阿里云oss
│  │  ├─smart-file-extensions-disk # 磁盘存储
│  │  ├─smart-file-extensions-ftp # ftp
│  │  ├─smart-file-extensions-minio # minio
│  │  ├─smart-file-extensions-qiniu # 七牛云
│  │  ├─smart-file-extensions-s3 # S3
│  │  └─smart-file-extensions-sftp # SFTP
│  ├─smart-freemarker # freemark扩展包
│  ├─smart-i18n # 国际化
│  ├─smart-kettle # kettle扩展包
│  ├─smart-license # license模块
│  │  ├─smart-license-client # license 客户端
│  │  ├─smart-license-core # license核心包
│  │  └─smart-license-server # license服务端
│  ├─smart-log # 日志增强模块
│  ├─smart-message # 消息模块
│  │  ├─smart-message-core
│  │  ├─smart-message-extension-dingtalk
│  │  ├─smart-message-extension-email
│  │  ├─smart-message-extension-sms
│  │  │  ├─smart-message-extensions-sms-aliyun
│  │  │  └─smart-message-extensions-sms-tencent
│  │  └─smart-message-extension-websocket
│  ├─smart-monitor
│  │  ├─smart-monitor-client
│  │  ├─smart-monitor-core
│  │  └─smart-monitor-server
│  ├─smart-redis # redis增强模块
│  └─smart-tools
│      └─smart-tool-database # 数据库工具包
├─smart-module-api # 模块间接口定义
│  ├─smart-auth-api # 认证接口
│  ├─smart-file-api # 文件接口
│  ├─smart-message-api # 消息接口
│  └─smart-system-api # 系统接口
├─smart-modules # 服务模块
│  ├─smart-module-auth # 认证服务
│  ├─smart-module-code # 代码生成器服务
│  ├─smart-module-document # 文档服务
│  ├─smart-module-file # 文件管理服务
│  ├─smart-module-message # 消息模块服务
│  ├─smart-module-monitor-server # 已废弃
│  └─smart-module-system # 系统管理服务
├─smart-services # 启动类
│  └─smart-service-system # 带系统管理启动类
```
