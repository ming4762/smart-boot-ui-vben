# 关于Smart Boot

2016年，GC Framework 1.0版本，实现了ExtJS与Spring Boot技术栈的组合，同时研发基于模板的代码生成器，极大的提高了开发效率和代码标准。

2021年，随着HTML5、ES5、CSS3的前端技术和微服务后端概念的潮流，框架改名为Smart Framework 2.0，与Spring Boot 2.0命名保持一致，积极拥抱开源技术栈，技术栈同步升级到Vue与Spring Boot/Spring Cloud双服务端继承方案，可同时适配大中小型各种规模的项目。同时引入系统建模低代码开发模式，可以快速构建业务模块。

2023年，Smart Framework 3.0发布，随着Spring Boot 2的维护周期结束，Smart Framework在国内同行中优先适配Spring Boot 3技术栈，为未来长期技术维护提供保障。

2024年，随着AI浪潮的到来，Smart Framework结合AI，同时适配Vben5，发布Smart Framework5.0版本。

## 技术栈

### 前端

::: tip前端技术栈使用Vben5，具体请参考Vben5文档 :::

### 后端

- 语言：java17+，默认版本java21
- 版本依赖：Maven
- 基础框架：SpringBoot 3.4.1
- 微服务框架：SpringCloud 2024.0.0 SpringCloudAlibaba 2023.x
- 权限框架：SpringSecurity
- ORM框架：Mybatis3.5 MybatisPlus 3.5.9
- 连接池：Druid 1.2.20
- 分页插件：PageHelper 2.1.0
- 缓存：Reidis/Redisson3.37.0
- 接口文档：Knife4j 4.5.0
- 定时任务：2.4.1-springboot3（springboot3定制版）
- AI：Spring AI 1.0.0-M4 Spring AI Alibaba 1.0.0-M3
- 数据库：默认MySQL 8+

### 支持数据库

::: tip默认提供MySql、Oracle、PostgreSQL初始化脚本 :::

| 数据库     | 版本要求               |
| ---------- | ---------------------- |
| MySql      | 8.0+                   |
| Oracle     | 11G                    |
| PostgreSQL | 无要求                 |
| Sqlserver  | 2008                   |
| 其他数据库 | 理论上支持JDBC的都支持 |

### 文件存储支持

::: tip具体参考文件存储器说明文档 :::

| 文件存储  | 是否支持 |
| --------- | -------- |
| 磁盘本地  | 支持     |
| 阿里云OSS | 支持     |
| FTP       | 支持     |
| Minio     | 支持     |
| 七牛云    | 支持     |
| SFTP      | 支持     |
| Amazon S3 | 支持     |
