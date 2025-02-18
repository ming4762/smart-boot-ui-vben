---
outline: deep
---

# CRUD

CRUD模块是在mybatis plus（以下简称MP）的基础上，做了一系列功能增强

[mybatis plus文档](https://baomidou.com/introduce/)

本模块分页插件使用 PageHelper_2.1.0，mybatis plus原分页插件与业务代码耦合度较高

::: warning 注意

mybatis plus 在3.5.9版本，对service进行重构，增加CrudRepository，将业务代码和crud功能解耦，但是并不彻底，smart-crud模块暂不跟进，等mybatis plus完全解耦后，再跟进

:::

## 框架配置

### 1、引入依赖

::: details maven依赖

```xml
<!--      在业务模块引入      -->
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-boot-starter-crud</artifactId>
</dependency>

<!--      在启动服务模块引入      -->
<!--      推荐使用druid数据源      -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-3-starter</artifactId>
</dependency>
<!--      根据需要引入数据库驱动      -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
</dependency>
```

:::

### 2、创建配置类MybatisConfig

::: details MybatisConfig

```JAVA
@Configuration
@MapperScan(basePackages = {
     	// mapper包扫描
    	// 系统管理模块
        MapperPackageConstants.MODULE_SYSTEM,
    	// 文件管理模块
        MapperPackageConstants.MODULE_FILE,
    	// 代码生成器模块
        MapperPackageConstants.DATABASE_GENERATOR,
    	// 消息支持模块
        MapperPackageConstants.MODULE_MESSAGE,
    	// 其他模块  com.xx.xxx.mapper
})
// 开启事务
@EnableTransactionManagement
public class MybatisConfig {

    @Bean
    @ConfigurationProperties("spring.datasource")
    @Primary
    public DataSource systemDatasource() {
        return DruidDataSourceBuilder.create().build();
    }

    /**
     * 创建事务管理器
     * @param dataSource 数据源
     * @return DataSourceTransactionManager
     */
    @Bean("systemTransactionManager")
    @Primary
    public DataSourceTransactionManager systemDataSourceTransactionManager(@Qualifier("systemDatasource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}
```

:::

### 3、配置文件

::: details yml配置

```yml
spring:
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    driver-class-name: com.mysql.cj.jdbc.Driver
    # druid 控制台配置
    druid:
      filter:
        wall:
          enabled: true
        stat:
          enabled: true
      web-stat-filter:
        enabled: true
      stat-view-servlet:
        enabled: true
        login-username: root
        login-password: root
        deny:
      filter-class-names: stat,wall
    # 数据库连接信息
    url: jdbc:mysql://localhost:3308/smart-system?useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC
    username: root
    password: root
```

:::

## 开发常用

## 多数据源

mybatis plus自动配置类`com.baomidou.mybatisplus.autoconfigure.MybatisPlusAutoConfiguration`有限定条件：@ConditionalOnSingleCandidate(DataSource.class)

所以多数据源mybatis plus自动配置会失效，需要手动创建

### 1、配置文件增加多数据源

相同配置可复用，例如spring.datasource.type 都是 com.alibaba.druid.pool.DruidDataSource，那么可以直接放到datasource下，其他同理

::: details 添加 first和second两个数据源配置

```yml
spring:
  datasource:
  	# 可复用配置
    type: com.alibaba.druid.pool.DruidDataSource
    druid:
      filter:
        wall:
          enabled: true
        stat:
          enabled: true
      web-stat-filter:
        enabled: true
      stat-view-servlet:
        enabled: true
        login-username: root
        login-password: root
        deny: ""
        allow: ""
      filter-class-names: stat,wall
    # 数据源1
    first:
      driver-class-name: oracle.jdbc.OracleDriver
      url: jdbc:oracle:thin:@localhost:1521:orcl
      username: username
      password: password
    # 数据源2
    second:
      driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://localhost:3306/test?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
      username: username
      password: password&
```

:::

### 2、创建配置类

有几个数据源就创建几个配置类

关键在于@MapperScan指定扫描包和注入的sqlSessionTemplate

::: details 数据源1配置

```java
@Configuration
@MapperScan(basePackages = {
        MapperPackageConstants.MODULE_SYSTEM,
        MapperPackageConstants.MONITOR_SERVER,
        MapperPackageConstants.MODULE_FILE,
        MapperPackageConstants.DATABASE_GENERATOR,
        MapperPackageConstants.MODULE_MESSAGE,
        MapperPackageConstants.MODULE_KETTLE,
        MapperPackageConstants.MODULE_YANJI
}, sqlSessionTemplateRef = "firstSqlSessionTemplate")
public class FirstMybatisConfig extends MybatisPlusAutoConfiguration {

    public MybatisConfig(MybatisPlusProperties properties, ObjectProvider<Interceptor[]> interceptorsProvider, ObjectProvider<TypeHandler[]> typeHandlersProvider, ObjectProvider<LanguageDriver[]> languageDriversProvider, ResourceLoader resourceLoader, ObjectProvider<DatabaseIdProvider> databaseIdProvider, ObjectProvider<List<ConfigurationCustomizer>> configurationCustomizersProvider, ObjectProvider<List<SqlSessionFactoryBeanCustomizer>> sqlSessionFactoryBeanCustomizers, ObjectProvider<List<MybatisPlusPropertiesCustomizer>> mybatisPlusPropertiesCustomizerProvider, ApplicationContext applicationContext) {
        super(properties, interceptorsProvider, typeHandlersProvider, languageDriversProvider, resourceLoader, databaseIdProvider, configurationCustomizersProvider, sqlSessionFactoryBeanCustomizers, mybatisPlusPropertiesCustomizerProvider, applicationContext);
    }

    private static final String DATA_SOURCE_NAME = "firstDatasource";

    @Bean(DATA_SOURCE_NAME)
    @ConfigurationProperties("spring.datasource.first")
    @Primary
    public DataSource firstDatasource() {
        return DruidDataSourceBuilder.create().build();
    }

    /**
     * 创建事务管理器
     * @param dataSource 数据源
     * @return DataSourceTransactionManager
     */
    @Bean("firstTransactionManager")
    @Primary
    public DataSourceTransactionManager firstDataSourceTransactionManager(@Qualifier(DATA_SOURCE_NAME) DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Override
    @Primary
    @Bean(name = "firstSqlSessionFactory")
    public SqlSessionFactory sqlSessionFactory(@Qualifier(DATA_SOURCE_NAME) DataSource dataSource) throws Exception {
        return super.sqlSessionFactory(dataSource);
    }

    @Override
    @Bean(name = "firstSqlSessionTemplate")
    public SqlSessionTemplate sqlSessionTemplate(@Qualifier("firstSqlSessionFactory") SqlSessionFactory sqlSessionFactory) {
        return super.sqlSessionTemplate(sqlSessionFactory);
    }
}
```

:::

::: details 数据源2配置

```java
@Configuration
@MapperScan(basePackages = "com.xxx.xx.mapper", sqlSessionTemplateRef = "secondSqlSessionTemplate")
public class FesMybatisConfig extends MybatisPlusAutoConfiguration {

    private static final String DATA_SOURCE_NAME = "secondDatasource";

    public FesMybatisConfig(MybatisPlusProperties properties, ObjectProvider<Interceptor[]> interceptorsProvider, ObjectProvider<TypeHandler[]> typeHandlersProvider, ObjectProvider<LanguageDriver[]> languageDriversProvider, ResourceLoader resourceLoader, ObjectProvider<DatabaseIdProvider> databaseIdProvider, ObjectProvider<List<ConfigurationCustomizer>> configurationCustomizersProvider, ObjectProvider<List<SqlSessionFactoryBeanCustomizer>> sqlSessionFactoryBeanCustomizers, ObjectProvider<List<MybatisPlusPropertiesCustomizer>> mybatisPlusPropertiesCustomizerProvider, ApplicationContext applicationContext) {
        super(properties, interceptorsProvider, typeHandlersProvider, languageDriversProvider, resourceLoader, databaseIdProvider, configurationCustomizersProvider, sqlSessionFactoryBeanCustomizers, mybatisPlusPropertiesCustomizerProvider, applicationContext);
    }

    @Bean(DATA_SOURCE_NAME)
    @ConfigurationProperties("spring.datasource.second")
    public DataSource fesDatasource() {
        return DruidDataSourceBuilder.create().build();
    }

    /**
     * 创建事务管理器
     * @param dataSource 数据源
     * @return DataSourceTransactionManager
     */
    @Bean("secondTransactionManager")
    public DataSourceTransactionManager secondDataSourceTransactionManager(@Qualifier(DATA_SOURCE_NAME) DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Override
    @Bean(name = "secondSqlSessionFactory")
    public SqlSessionFactory sqlSessionFactory(@Qualifier(DATA_SOURCE_NAME) DataSource dataSource) throws Exception {
        return super.sqlSessionFactory(dataSource);
    }

    @Bean("secondSqlSessionTemplate")
    @Override
    public SqlSessionTemplate sqlSessionTemplate(@Qualifier("secondSqlSessionFactory") SqlSessionFactory sqlSessionFactory) {
        return super.sqlSessionTemplate(sqlSessionFactory);
    }
}
```

:::

## 租户支持

smart-crud租户基于mybatis plus多租户插件开发，完美兼容MP，同时增强了部分功能

增强功能如下：

- MP租户字段全局固定，不支持每个表动态设置，smart-crud增加`com.smart.framework.crud.annotation.TableTenantField`基于注解配置租户字段，同时支持多租户字段
- MP只支持表名级别是否忽略租户，TableTenantField支持根据操作类型判断是否忽略规则
- 同时TableTenantField支持平台租户单独设置忽略规则，例如平台管理租户可以查询到所有租户的数据

### 1、启动类添加租户支持

```java
@SpringBootApplication
// 启用租户支持
@EnableMybatisPlusTenant
public class SmartServiceSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartServiceSystemApplication.class, args);
    }
}
```

### 2、租户注解`com.smart.framework.crud.annotation.TableTenantField`

::: warning 注意

一个实体类如果存在多个租户注解，那么默认的租户注解只能有一个，其他需要将 isDefault 设为false

对于需要进行手动切换的租户字段，必须添加TableTenantField租户注解

:::

::: details 示例

```java
/**
 * 平台管理租户忽略查询，也就是平台管理租户可以查询到所有数据
 */
@TableTenantField(platformTenantIgnoreCommands = SqlCommandType.SELECT)
private Long tenantId;

/**
 * 平台管理租户忽略insrt，平台管理租户执行插入操作不会插入租户ID
 * 租户忽略select，所有租户可以查询到所有数据
 */
@TableTenantField(ignoreCommands = SqlCommandType.SELECT, platformTenantIgnoreCommands = SqlCommandType.INSERT)
private Long tenantId;
```

:::

### 3、租户套餐管理

在页面`系统管理-租户管理-租户套餐`管理租户套餐信息

![image-20250122112623192](images\image-20250122112623192.png)

### 4、租户管理

在页面`系统管理-租户管理-租户列表`管理租户信息

::: tip

什么是平台管理租户？

平台管理租户是系统内置的一个租户，作为平台管理的租户，可以单独设置改租户的数据过滤规则

:::

![image-20250123144408213](images\image-20250123144408213.png)

- 绑定租户对应的用户，一个用户可以绑定多个租户，用户在每个租户有独立的账户（只有创建了账户的用户才能登录系统）
- 订阅套餐：租户可以订阅多个套餐，并设置每个套餐的有效时间、

### 5、手动调整租户查询策略

系统提供静态工具类`com.smart.framework.crud.plus.tenant.SmartTenantControl`用于对租户查询策略进行更细粒度的调整

::: tip

手动调整影响范围只在当前线程内

:::

- com.smart.framework.crud.plus.tenant.SmartTenantControl#setIgnore：手动设置忽略租户查询策略，优先级要高于实体类注解策略
- com.smart.framework.crud.plus.tenant.SmartTenantControl#setTableTenantField：手动指定租户字段，对于多租户字段可以手动切换

## 脱敏

在查询结果实体字段添加注解`com.smart.framework.crud.desensitization.annotation.Desensitize`即可实现脱敏

属性说明：

- type：脱敏类型，系统内置了5中脱敏类型：ENCODE（转码），ID_CARD（身份证），PHONE（手机号），EMAIL（邮箱），BANK_CARD（银行卡）
- handler：自定义脱敏逻辑，继承`com.smart.framework.crud.desensitization.handler.DesensitizeHandler`，建议注入到spring中，否则每次都会创建实体

## 逻辑删除

款加在MP的基础上，增强逻辑删除

增加注解`@TableLogicField`实现逻辑删除字段的自动填充

可以继承`com.smart.crud.model.BaseModelDeleteUserTime`也可以自行添加注解

`@TableLogicField(isDeleteKey = true)`主要是解决逻辑删除导致唯一索引冲突，将唯一字段+delete_key作为联合唯一索引

## 自动启用/停用

### 1、在实体字段添加注解`com.smart.crud.annotation.TableUseYnField`

```JAVA
/**
 * USE_YN - 启用状态
 */
@TableUseYnField
private Boolean useYn;
```

### 2、`com.smart.crud.service.BaseService`提供启用停用函数

com.smart.crud.service.BaseService#setUseYn

### 3、`com.smart.crud.controller.BaseController`也提供相应的接口

com.smart.crud.controller.BaseController#setUseYn

```java
@Override
@Operation(summary = "启用停用对账单明细")
@PostMapping("setUseYn")
@Log(value = "启用停用对账单明细", type = LogOperationTypeEnum.DELETE)
public Result<Boolean> setUseYn(@RequestBody @Valid SetUseYnParameter parameter) {
    return super.setUseYn(parameter);
}
```

## 数据权限（待重构）

## 添加修改信息自动填充

实体类继承`com.smart.crud.model.BaseModelUserTime`

或自行添加注解`@TableField(fill = FieldFill.UPDATE)`

```java
@TableField(fill = FieldFill.UPDATE)
private Long updateUserId;

@TableField(fill = FieldFill.UPDATE)
private LocalDateTime updateTime;

@TableField(fill = FieldFill.UPDATE)
private String updateBy;
```
