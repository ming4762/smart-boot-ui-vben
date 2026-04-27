# CRUD 模块

CRUD 模块是在 MyBatis Plus 的基础上做的一系列功能增强，旨在减少重复编码、统一开发规范、提供开箱即用的企业级能力。

> [MyBatis Plus 文档](https://baomidou.com/introduce/)
>
> 本模块分页插件使用 PageHelper 2.1.0，MyBatis Plus 原分页插件与业务代码耦合度较高。
>
> MyBatis Plus 在 3.5.9 版本对 Service 进行重构，增加了 CrudRepository，将业务代码和 CRUD 功能解耦，但并不彻底。smart-crud 模块暂不跟进，等 MyBatis Plus 完全解耦后再跟进。

## 模块结构

| 模块 | 说明 |
| --- | --- |
| `smart-crud` | 核心框架层，定义基础实体、Controller、Service、Mapper 以及所有增强功能的实现 |
| `smart-boot-crud` | Spring Boot 自动配置层，负责自动注册各种增强组件 |
| `smart-boot-starter-crud` | Starter 启动器，业务项目只需引入此依赖即可 |

## 框架配置

### 1. 引入依赖

在业务模块引入 starter：

```xml
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-boot-starter-crud</artifactId>
</dependency>
```

在启动服务模块引入数据源（推荐 Druid）：

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-3-starter</artifactId>
</dependency>
<!-- 根据需要引入数据库驱动 -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
</dependency>
```

### 2. 创建配置类 MybatisConfig

```java
@Configuration
@MapperScan(basePackages = {
    // mapper 包扫描路径
    MapperPackageConstants.MODULE_SYSTEM,
    MapperPackageConstants.MODULE_FILE,
    // 其他模块  com.xx.xxx.mapper
})
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
     */
    @Bean("systemTransactionManager")
    @Primary
    public DataSourceTransactionManager systemDataSourceTransactionManager(
            @Qualifier("systemDatasource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}
```

### 3. 配置文件

```yaml
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

---

## 基础 CRUD 开发

### 使用方法

CRUD 模块提供了完整的基类体系，开发者只需继承相应的基类即可获得标准的 CRUD 能力。

#### 1. 实体类继承 BaseModel

```java
// 最基础的实体类，仅实现序列化
public class MyEntity extends BaseModel {
    // 字段定义
}
```

框架提供了多个基础实体类，按需继承：

| 基础实体类 | 自动填充字段 | 适用场景 |
| --- | --- | --- |
| `BaseModel` | 无 | 不需要自动填充的简单实体 |
| `BaseModelCreateUserTime` | createUserId、createTime、createBy | 只需记录创建信息 |
| `BaseModelUserTime` | createUserId、createTime、createBy + updateUserId、updateTime、updateBy | 需要记录创建和更新信息 |
| `BaseModelDeleteUserTime` | 继承 BaseModelUserTime + deleteKey、deleteTime、deleteUserId、deleteBy | 需要逻辑删除增强 |

#### 2. Mapper 继承 CrudBaseMapper

```java
public interface MyEntityMapper extends CrudBaseMapper<MyEntity> {
}
```

`CrudBaseMapper` 继承自 MyBatis Plus 的 `BaseMapper`，在泛型上约束实体类必须继承 `BaseModel`。

#### 3. Service 继承 BaseService / BaseServiceImpl

```java
public interface MyEntityService extends BaseService<MyEntity> {
}

@Service
public class MyEntityServiceImpl extends BaseServiceImpl<MyEntityMapper, MyEntity> implements MyEntityService {
}
```

#### 4. Controller 继承 BaseController / BaseQueryController

```java
// 只需要查询能力的 Controller
@RestController
@RequestMapping("myEntity")
public class MyEntityQueryController extends BaseQueryController<MyEntityService, MyEntity> {

    @Override
    @Operation(summary = "查询列表")
    @PostMapping("list")
    public Result<Object> list(@RequestBody PageSortQuery parameter) {
        return super.list(parameter);
    }
}

// 需要增删改查的 Controller
@RestController
@RequestMapping("myEntity")
public class MyEntityController extends BaseController<MyEntityService, MyEntity> {

    @Override
    @Operation(summary = "保存/更新")
    @PostMapping("saveUpdate")
    public Result<Boolean> saveUpdate(@RequestBody MyEntity model) {
        return super.saveUpdate(model);
    }
}
```

### 实现原理

#### BaseController 内置接口

`BaseController` 继承自 `BaseQueryController`，提供了以下内置方法：

- `saveUpdate(T model)` — 保存或更新
- `save(T model)` — 保存
- `update(T model)` — 更新
- `batchDeleteById(List<Serializable> idList)` — 批量删除
- `batchSave(List<T> modelList)` — 批量保存
- `batchSaveUpdate(List<T> modelList)` — 批量保存/更新
- `setUseYn(SetUseYnParameter parameter)` — 启用/停用

#### BaseQueryController 内置接口

- `list(PageSortQuery parameter)` — 列表查询（自动分页、排序、属性过滤）
- `getById(Serializable id)` — 根据ID获取
- `listById(List<Serializable> ids)` — 根据ID批量获取
- `listEnumLabelValue(ClassParameter parameter)` — 查询枚举类 LabelValue

#### BaseServiceImpl 增强方法

- 重写 `removeByIds` — 当 ID 只有一个时调用 `removeById`，避免生成 IN 单值 SQL
- 重写 `listByIds` — 防止空 ID 列表报错，单 ID 优化查询
- `list(QueryWrapper, PageSortQuery, boolean paging)` — 统一查询入口，支持分页和排序
- `setUseYn(SetUseYnParameter)` — 启停状态设置
- `isAdd(T entity)` — 判断实体是否为新增操作
- `getTableName()` — 获取当前实体对应的表名
- `getTableInfo()` — 获取 `SmartTableInfo` 增强表元数据

---

## 动态查询

### 使用方法

CRUD 模块通过 `PageSortQuery` / `CommonQuery` 体系提供了一套灵活的动态查询机制，前端可通过参数 Map 传递查询条件，无需为每个查询场景编写单独的接口。

#### 查询参数结构

```
CommonQuery（通用查询）
├── parameter: Map<Serializable, Serializable>  // 查询条件参数
├── orAndParameter: List<Map<String, Serializable>>  // 外层 OR 内层 AND
├── andOrParameter: List<Map<String, Serializable>>  // 外层 AND 内层 OR
├── propertyList: List<String>  // 指定查询的属性（只返回这些字段）
├── excludePropertyList: List<String>  // 排除的属性（不返回这些字段）
└── keyword: String  // 关键字（全字段模糊匹配）
    │
    ├── SortQuery（排序查询）extends CommonQuery
    │   ├── sortName: String  // 排序字段，逗号分隔
    │   └── sortOrder: String  // 排序方向，逗号分隔
    │       │
    │       └── PageSortQuery（分页排序查询）extends SortQuery
    │           ├── pageSize: Integer  // 每页条数
    │           └── currentPage: Integer  // 当前页数
```

#### 查询条件语法

parameter Map 的 key 格式为：`属性名@操作符`，value 为条件值。

支持的操作符：

| 操作符      | 含义       | 示例 key         | 示例 value   |
| ----------- | ---------- | ---------------- | ------------ |
| `=`         | 等于       | `name@=`         | `张三`       |
| `<>`        | 不等于     | `status@<>`      | `1`          |
| `like`      | 模糊匹配   | `name@like`      | `张`         |
| `notLike`   | 不模糊匹配 | `name@notLike`   | `张`         |
| `likeLeft`  | 左模糊     | `name@likeLeft`  | `三`         |
| `likeRight` | 右模糊     | `name@likeRight` | `张`         |
| `>`         | 大于       | `age@>`          | `18`         |
| `>=`        | 大于等于   | `age@>=`         | `18`         |
| `<`         | 小于       | `age@<`          | `60`         |
| `<=`        | 小于等于   | `age@<=`         | `60`         |
| `in`        | 包含       | `status@in`      | `[1,2,3]`    |
| `notIn`     | 不包含     | `status@notIn`   | `[4,5]`      |
| `groupBy`   | 分组       | `deptId@groupBy` | （值无意义） |

特殊处理：

- 当操作符为 `=` 且值为 null 时，自动转为 `IS NULL`
- 当操作符为 `<>` 且值为 null 时，自动转为 `IS NOT NULL`
- 支持枚举类型字段，传入枚举名称会自动转换为枚举值

#### 请求示例

```json
{
  "parameter": {
    "name@like": "张",
    "status@=": 1,
    "age@>=": 18,
    "deptId@in": [1, 2, 3]
  },
  "sortName": "createTime,name",
  "sortOrder": "desc,asc",
  "pageSize": 10,
  "currentPage": 1,
  "propertyList": ["id", "name", "status"],
  "keyword": "搜索关键字"
}
```

### 实现原理

动态查询的核心是 `CrudUtils.createQueryWrapperFromParameters` 方法：

1. **参数解析**：遍历 parameter Map，按 `@` 分隔符拆分 key，获取属性名和操作符
2. **字段映射**：通过 `SmartTableInfo` 将 Java 属性名映射到数据库字段名
3. **方法反射**：根据操作符找到 `QueryWrapper` 对应的方法（如 `eq`、`like`、`gt` 等），通过反射调用
4. **枚举处理**：如果字段类型是 `IEnum` 枚举，自动将枚举名称转换为枚举值
5. **字段过滤**：`propertyList` 通过 `queryWrapper.select()` 指定查询字段，`excludePropertyList` 排除不需要的字段

分页与排序通过 `CrudPageHelper` 实现：

- 使用 Java 21 的 `ScopedValue` 存储分页对象（替代 ThreadLocal，更安全且自动清理）
- `createPage` 方法根据参数创建 MyBatis Plus 的 `Page` 对象
- `withPage` 方法在 ScopedValue 作用域内执行查询，自动关联分页信息

---

## 多数据源

### 使用方法

MyBatis Plus 自动配置类 `MybatisPlusAutoConfiguration` 有限定条件 `@ConditionalOnSingleCandidate(DataSource.class)`，所以多数据源时 MyBatis Plus 自动配置会失效，需要手动创建。

#### 1. 配置文件增加多数据源

相同配置可复用，例如 `spring.datasource.type` 都是 `DruidDataSource`，那么直接放到 `datasource` 下，其他同理。

```yaml
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
        deny: ''
        allow: ''
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
      password: password
```

#### 2. 创建配置类

有几个数据源就创建几个配置类。关键在于 `@MapperScan` 指定扫描包和注入的 `sqlSessionTemplate`。

```java
// 数据源1 配置
@Configuration
@MapperScan(basePackages = {
    MapperPackageConstants.MODULE_SYSTEM,
    MapperPackageConstants.MODULE_FILE,
    // ...
}, sqlSessionTemplateRef = "firstSqlSessionTemplate")
public class FirstMybatisConfig extends MybatisPlusAutoConfiguration {

    private static final String DATA_SOURCE_NAME = "firstDatasource";

    public FirstMybatisConfig(MybatisPlusProperties properties,
                              ObjectProvider<Interceptor[]> interceptorsProvider,
                              ObjectProvider<TypeHandler[]> typeHandlersProvider,
                              ObjectProvider<LanguageDriver[]> languageDriversProvider,
                              ResourceLoader resourceLoader,
                              ObjectProvider<DatabaseIdProvider> databaseIdProvider,
                              ObjectProvider<List<ConfigurationCustomizer>> configurationCustomizersProvider,
                              ObjectProvider<List<SqlSessionFactoryBeanCustomizer>> sqlSessionFactoryBeanCustomizers,
                              ObjectProvider<List<MybatisPlusPropertiesCustomizer>> mybatisPlusPropertiesCustomizerProvider,
                              ApplicationContext applicationContext) {
        super(properties, interceptorsProvider, typeHandlersProvider, languageDriversProvider,
              resourceLoader, databaseIdProvider, configurationCustomizersProvider,
              sqlSessionFactoryBeanCustomizers, mybatisPlusPropertiesCustomizerProvider, applicationContext);
    }

    @Bean(DATA_SOURCE_NAME)
    @ConfigurationProperties("spring.datasource.first")
    @Primary
    public DataSource firstDatasource() {
        return DruidDataSourceBuilder.create().build();
    }

    @Bean("firstTransactionManager")
    @Primary
    public DataSourceTransactionManager firstDataSourceTransactionManager(
            @Qualifier(DATA_SOURCE_NAME) DataSource dataSource) {
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
    public SqlSessionTemplate sqlSessionTemplate(
            @Qualifier("firstSqlSessionFactory") SqlSessionFactory sqlSessionFactory) {
        return super.sqlSessionTemplate(sqlSessionFactory);
    }
}
```

### 实现原理

多数据源的核心是利用 Spring 的 `@ConfigurationProperties` 将不同前缀的配置绑定到不同的 `DataSource` Bean，然后通过继承 `MybatisPlusAutoConfiguration` 复用 MyBatis Plus 的 `SqlSessionFactory` 创建逻辑。

每个数据源配置类需要：

1. 独立的 `DataSource` Bean，通过 `@ConfigurationProperties` 绑定对应的配置前缀
2. 独立的事务管理器
3. 独立的 `SqlSessionFactory` 和 `SqlSessionTemplate`
4. 通过 `@MapperScan` 的 `sqlSessionTemplateRef` 指定该数据源对应的 Mapper 使用哪个 `SqlSessionTemplate`
5. 主数据源使用 `@Primary` 标注

---

## 租户支持

smart-crud 租户基于 MyBatis Plus 多租户插件开发，完美兼容 MP，同时增强了部分功能。

### 增强功能

- MP 租户字段全局固定，不支持每个表动态设置。smart-crud 增加 `@TableTenantField` 注解，基于注解配置租户字段，同时支持多租户字段
- MP 只支持表名级别是否忽略租户。`@TableTenantField` 支持根据操作类型（SELECT/INSERT/UPDATE/DELETE）判断是否忽略规则
- `@TableTenantField` 支持平台管理租户单独设置忽略规则，例如平台管理租户可以查询到所有租户的数据

### 使用方法

#### 1. 启动类添加租户支持

```java
@SpringBootApplication
@EnableMybatisPlusTenant  // 启用租户支持
public class SmartServiceSystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartServiceSystemApplication.class, args);
    }
}
```

`@EnableMybatisPlusTenant` 会通过 `@Import` 导入 `MybatisPlusTenantConfigurer`，自动注册：

- `SmartTenantLineHandler`（租户处理器，默认实现 `DefaultTenantLineHandlerImpl`）
- `SmartTenantLineInnerInterceptor`（增强租户拦截器）

#### 2. 在实体类字段添加 `@TableTenantField` 注解

```java
/**
 * 平台管理租户忽略查询，也就是平台管理租户可以查询到所有数据
 */
@TableTenantField(platformTenantIgnoreCommands = SqlCommandType.SELECT)
private Long tenantId;

/**
 * 平台管理租户忽略 INSERT，平台管理租户执行插入操作不会插入租户ID
 * 忽略 SELECT，所有租户可以查询到所有数据
 */
@TableTenantField(ignoreCommands = SqlCommandType.SELECT, platformTenantIgnoreCommands = SqlCommandType.INSERT)
private Long tenantId;

/**
 * 多租户字段场景，第二个租户字段需将 isDefault 设为 false
 */
@TableTenantField(isDefault = false)
private Long orgId;
```

> **注意**：一个实体类如果存在多个租户注解，那么默认的租户注解只能有一个，其他需要将 `isDefault` 设为 false。对于需要进行手动切换的租户字段，必须添加 `@TableTenantField` 租户注解。

#### 3. 手动调整租户查询策略

系统提供工具类 `SmartTenantControl` 用于对租户查询策略进行更细粒度的调整。

> **注意**：手动调整影响范围只在当前作用域内（基于 Java 21 ScopedValue 实现），无需手动清理。

```java
// 忽略指定表的租户查询
List<MyEntity> result = SmartTenantControl.executeWithIgnore(
    MyEntity.class,
    List.of(SqlCommandType.SELECT),  // 忽略的命令类型
    null,  // 平台管理租户忽略的命令类型
    () -> myEntityMapper.selectList(null)
);

// 忽略所有表的租户查询
SmartTenantControl.executeWithIgnoreAll(
    List.of(SqlCommandType.SELECT),
    null,
    () -> {
        // 在此作用域内所有查询忽略租户
    }
);

// 切换租户字段（多租户字段场景）
List<MyEntity> result = SmartTenantControl.executeWithTenantField(
    MyEntity.class,
    MyEntity::getOrgId,  // 切换到 orgId 租户字段
    () -> myEntityMapper.selectList(null)
);
```

### 实现原理

#### 整体架构

```
@EnableMybatisPlusTenant
    └── MybatisPlusTenantConfigurer（自动配置）
        ├── SmartTenantLineHandler（租户处理器接口）
        │   └── DefaultTenantLineHandlerImpl（默认实现）
        └── SmartTenantLineInnerInterceptor（增强租户拦截器）
```

#### 租户字段元数据解析

`SmartTableInfo` 在初始化时扫描实体类字段上的 `@TableTenantField` 注解，解析为 `TableTenantFieldInfo` 对象：

- `tableFieldInfo` — 对应的表字段信息
- `ignoreCommandList` — 忽略的 SQL 命令类型列表
- `platformTenantIgnoreCommandList` — 平台管理租户忽略的命令列表
- `defaultField` — 是否为默认租户字段

`SmartTableInfo` 约束：一个实体类只能有一个 `isDefault = true` 的租户字段。

#### 租户拦截器工作流程

`SmartTenantLineInnerInterceptor` 继承自 MP 的 `TenantLineInnerInterceptor`，重写了以下方法：

1. **processInsert** — INSERT 时自动在列和值中追加租户字段
2. **processUpdate** — UPDATE 时在 WHERE 条件中追加租户条件
3. **processDelete** — DELETE 时在 WHERE 条件中追加租户条件
4. **buildTableExpression** — SELECT 时构建 `tenant_id = ?` 条件表达式

每个操作前都会通过 `SmartTenantLineHandler.ignoreTable(tableName, sqlCommandType)` 判断是否忽略。

#### 忽略策略判断逻辑

`DefaultTenantLineHandlerImpl.ignoreTable` 的判断流程：

1. 通过 `CrudUtils.getTableInfo(tableName)` 获取表的元数据
2. 如果表不支持租户（没有 `@TableTenantField`），返回 true（忽略）
3. 从 `SmartTenantControl` 获取手动设置的忽略数据（优先级高于注解配置）
4. 如果手动设置了忽略，按手动设置的规则判断
5. 否则按 `@TableTenantField` 注解配置的规则判断
6. 判断逻辑：如果 `ignoreCommands` 包含当前命令类型，则忽略；如果当前是平台管理租户且 `platformTenantIgnoreCommands` 包含当前命令类型，也忽略

#### SmartTenantControl 的 ScopedValue 机制

`SmartTenantControl` 基于 Java 21 的 `ScopedValue` 实现，而非 ThreadLocal：

- **不可变** — 值一旦设置就无法修改，确保作用域内一致性
- **作用域绑定** — 值只在绑定的作用域内有效，无需手动清理（告别 ThreadLocal 忘记 remove 导致的泄漏）
- **不可变继承** — 子线程可以继承父线程的值

内部维护了一个不可变的 `TenantContext` 对象，包含 `ignoreDataMap`（忽略数据映射）和 `tenantFieldMap`（租户字段映射），所有修改操作都返回新的实例。

---

## 逻辑删除增强

### 使用方法

框架在 MyBatis Plus 逻辑删除的基础上做了增强，解决了逻辑删除导致唯一索引冲突的问题。

#### 方式一：继承 BaseModelDeleteUserTime

最简单的方式，直接继承框架提供的基础实体类：

```java
@TableName("my_entity")
public class MyEntity extends BaseModelDeleteUserTime {
    // 自动拥有 deleteKey、deleteTime、deleteUserId、deleteBy 字段
    // 以及继承的 createUserId、createTime、createBy、updateUserId、updateTime、updateBy
}
```

`BaseModelDeleteUserTime` 的字段定义：

```java
@TableLogicField(isDeleteKey = true)
private Long deleteKey;       // 逻辑删除 key，删除时自动填充为记录 ID

@TableLogicField(isFill = true)
private ZonedDateTime deleteTime;  // 删除时间，自动填充

@TableLogicField(isFill = true)
private Long deleteUserId;    // 删除人 ID，自动填充

@TableLogicField(isFill = true)
private String deleteBy;      // 删除人姓名，自动填充
```

#### 方式二：自定义字段添加 `@TableLogicField` 注解

```java
@TableLogicField(isDeleteKey = true)
private Long deleteKey;

@TableLogicField(isFill = true)
private ZonedDateTime deleteTime;
```

`@TableLogicField` 属性说明：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `isDeleteKey` | boolean | false | 是否为逻辑删除 key 字段。设为 true 后，删除时自动将该字段值设为记录主键 ID，配合唯一索引使用 |
| `isFill` | boolean | false | 删除时是否自动填充。设为 true 的字段会在逻辑删除时被自动注入 |
| `strategy` | LogicKeyStrategy | ID | 逻辑删除 key 的生成策略，目前仅支持 ID 策略（与主键相同） |

### 实现原理

#### 唯一索引冲突问题

逻辑删除的经典问题：如果表中有唯一索引（如 `name`），软删除记录的 `name` 值仍然存在，导致无法新建同名记录。

smart-crud 的解决方案：添加 `deleteKey` 字段，逻辑删除时将 `deleteKey` 设置为记录的主键 ID。然后将唯一字段 + `deleteKey` 作为联合唯一索引，由于每条删除记录的 `deleteKey` 值不同，不会冲突。

```
-- 数据库建表建议
UNIQUE KEY uk_name_delete_key (name, delete_key)
```

#### 增强的 SQL 注入器

`EnhanceSqlInjector` 替换了 MP 默认的 SQL 注入器，将 `deleteById`、`deleteBatchByIds`、`delete` 等删除方法替换为 `SmartDeleteById`、`SmartDeleteByIds`、`SmartDelete` 增强版本。

增强的删除 SQL 在原有逻辑删除的基础上，额外设置了 `deleteKey = id`（主键值）以及 `deleteTime`、`deleteUserId`、`deleteBy` 等字段的值。

#### 逻辑删除字段自动填充

逻辑删除字段的填充有两个路径：

1. **MP 原生 API 删除**（如 `removeById`）— 通过 `LogicDeleteMetaObjectFill` 在 `logicDeleteFill` 阶段注入 `deleteBy`、`deleteUserId`、`deleteTime`
2. **自定义 SQL 删除** — 通过 `LogicDeleteFieldInjectInnerInterceptor` 拦截器，在执行前将删除参数注入到 `MapperMethod.ParamMap` 中

两个路径最终都通过 `SmartCrudUserApi` 获取当前用户信息来填充删除人字段。

`CreateUpdateMetaObjectFill` 在更新填充时，会判断当前是否为逻辑删除操作，如果是则跳过 `updateTime`/`updateBy` 的填充，避免逻辑删除时错误更新这些字段。

---

## 自动填充

### 使用方法

框架提供了创建/更新/删除信息的自动填充能力，通过 `@TableField(fill = FieldFill.XXX)` 注解标记字段即可。

#### 方式一：继承基础实体类（推荐）

```java
// 自动填充 createUserId、createTime、createBy、updateUserId、updateTime、updateBy
public class MyEntity extends BaseModelUserTime {
}
```

#### 方式二：自定义字段添加注解

```java
@TableField(fill = FieldFill.INSERT)
private Long createUserId;

@TableField(fill = FieldFill.INSERT)
private ZonedDateTime createTime;

@TableField(fill = FieldFill.INSERT)
private String createBy;

@TableField(fill = FieldFill.UPDATE)
private Long updateUserId;

@TableField(fill = FieldFill.UPDATE)
private ZonedDateTime updateTime;

@TableField(fill = FieldFill.UPDATE)
private String updateBy;
```

框架还支持创建时自动注入部门信息：

```java
@TableField(fill = FieldFill.INSERT)
private Long deptId;

@TableField(fill = FieldFill.INSERT)
private String deptName;
```

### 实现原理

#### 填充器体系

```
SmartMetaObjectFill（接口，扩展 MetaObjectHandler）
├── CreateUpdateMetaObjectFill   — 创建/更新信息填充
├── LogicDeleteMetaObjectFill    — 逻辑删除信息填充
└── CreateDeptMetaObjectFill     — 创建部门信息填充

DelegateMetaObjectFill（代理填充器，组合所有 SmartMetaObjectFill 实现）
```

#### 填充时机

`SmartCrudAutoConfiguration` 将三个填充器注册为 Spring Bean，并创建 `DelegateMetaObjectFill` 作为代理，统一委托给所有填充器。

每个填充器在执行前都会判断：

- `CreateUpdateMetaObjectFill.insertFill` — 检查表是否有 `INSERT_FILL` 标记，以及实体类是否有对应字段
- `CreateUpdateMetaObjectFill.updateFill` — 检查表是否有 `UPDATE_FILL` 标记，额外判断是否为逻辑删除操作（逻辑删除不走更新填充）
- `LogicDeleteMetaObjectFill.logicDeleteFill` — 检查表是否启用逻辑删除，当前方法是否为删除方法
- `CreateDeptMetaObjectFill.insertFill` — 检查实体类是否有 `deptId`/`deptName` 字段，通过 `SmartCrudUserApi` 获取当前用户部门

用户信息通过 `SmartCrudUserApi` 接口获取，这是一个 SPI 接口，业务项目需要提供实现。

---

## 启用/停用

### 使用方法

#### 1. 在实体字段添加 `@TableUseYnField` 注解

```java
/**
 * USE_YN - 启用状态
 */
@TableUseYnField
private Boolean useYn;
```

> 一个实体类只能有一个 `@TableUseYnField` 注解字段。

#### 2. Service 层调用

```java
// 在 Service 中直接调用
this.setUseYn(parameter);
```

#### 3. Controller 层接口

```java
@Override
@Operation(summary = "启用停用")
@PostMapping("setUseYn")
@Log(value = "启用停用", type = LogOperationTypeEnum.DELETE)
public Result<Boolean> setUseYn(@RequestBody @Valid SetUseYnParameter parameter) {
    return super.setUseYn(parameter);
}
```

`SetUseYnParameter` 参数：

| 字段     | 类型         | 说明                 |
| -------- | ------------ | -------------------- |
| `idList` | `List<Long>` | ID 列表（不能为空）  |
| `useYn`  | `Boolean`    | 启用状态（不能为空） |

### 实现原理

`BaseServiceImpl.setUseYn` 方法的执行流程：

1. 校验参数：ID 列表和启用状态不能为空
2. 通过 `SmartTableInfo.getUseYnField()` 获取标记了 `@TableUseYnField` 的字段信息
3. 如果实体类没有 `@TableUseYnField` 字段，抛出异常
4. 使用 `Lists.partition(idList, 500)` 分批执行更新，每批最多 500 条
5. 通过 `UpdateWrapper` 构建 `SET use_yn = ? WHERE id IN (?)` 的 SQL 执行更新

---

## 脱敏

### 使用方法

在实体类的查询结果字段上添加 `@Desensitize` 注解即可实现脱敏。

```java
@Desensitize(type = DesensitizeType.PHONE)
private String phone;

@Desensitize(type = DesensitizeType.ID_CARD)
private String idCard;

@Desensitize(type = DesensitizeType.EMAIL)
private String email;

@Desensitize(type = DesensitizeType.BANK_CARD)
private String bankCard;

@Desensitize(type = DesensitizeType.ENCODE)
private String encode;
```

内置脱敏类型：

| 类型        | 效果       |
| ----------- | ---------- |
| `ENCODE`    | 转码脱敏   |
| `ID_CARD`   | 身份证脱敏 |
| `PHONE`     | 手机号脱敏 |
| `EMAIL`     | 邮箱脱敏   |
| `BANK_CARD` | 银行卡脱敏 |

#### 自定义脱敏处理器

```java
@Desensitize(handler = MyCustomDesensitizeHandler.class)
private String customField;
```

自定义处理器继承 `AbstractDesensitizeHandler`：

```java
@Component  // 建议注入到 Spring 中，否则每次都会创建新实例
public class MyCustomDesensitizeHandler extends AbstractDesensitizeHandler {
    @Override
    protected String doDesensitize(@NonNull Object value) {
        // 自定义脱敏逻辑
        return value.toString().substring(0, 2) + "***";
    }
}
```

### 实现原理

#### 脱敏架构

```
@Desensitize（注解，标记在字段上）
  ├── type: DesensitizeType  — 脱敏类型，关联内置处理器
  └── handler: Class<? extends DesensitizeHandler>  — 自定义处理器

@JacksonAnnotationsInside
@JsonSerialize(using = DesensitizeSerializer.class)  — Jackson 序列化时触发脱敏

DesensitizeSerializer（Jackson 自定义序列化器）
  └── serialize() — 执行脱敏逻辑
```

#### 脱敏执行流程

1. 字段标记 `@Desensitize` 注解，该注解通过 `@JsonSerialize(using = DesensitizeSerializer.class)` 关联 Jackson 序列化器
2. Jackson 序列化该字段时调用 `DesensitizeSerializer.serialize()`
3. 序列化器优先使用注解中指定的 `handler`；如果 handler 是 `NoneDesensitizeHandler`（默认），则使用 `type` 关联的内置处理器
4. 尝试从 Spring 容器获取处理器实例；获取不到则通过反射创建
5. 调用处理器的 `desensitize()` 方法，返回脱敏后的值

#### 处理器体系

```
DesensitizeHandler（接口）
└── AbstractDesensitizeHandler（抽象类，处理 null 值）
    ├── EncodeDesensitizeHandler   — 转码脱敏
    ├── IdCardDesensitizeHandler   — 身份证脱敏
    ├── PhoneDesensitizeHandler    — 手机号脱敏
    ├── EmailDesensitizeHandler    — 邮箱脱敏
    ├── BankCardDesensitizeHandler — 银行卡脱敏
    └── NoneDesensitizeHandler     — 空实现（占位用）
```

---

## 数据权限

### 使用方法

#### 1. 启用数据权限

在启动类添加 `@EnableDataPermission` 注解：

```java
@SpringBootApplication
@EnableDataPermission
public class Application {
    // ...
}
```

#### 2. 在 Controller 方法上添加 `@SmartDataPermission` 注解

```java
@SmartDataPermission(scope = DataPermissionScopeEnum.DATA_PERSONAL)
@PostMapping("list")
public Result<Object> list(@RequestBody PageSortQuery parameter) {
    return super.list(parameter);
}

@SmartDataPermission(
    scope = DataPermissionScopeEnum.DATA_DEPT,
    tableName = "sys_user"
)
@PostMapping("deptList")
public Result<Object> deptList(@RequestBody PageSortQuery parameter) {
    return super.list(parameter);
}

@SmartDataPermission(
    scope = DataPermissionScopeEnum.DATA_CUSTOM,
    permissionValue = "dept_id IN ${userDeptWithChildren}"
)
@PostMapping("customList")
public Result<Object> customList(@RequestBody PageSortQuery parameter) {
    return super.list(parameter);
}
```

`@SmartDataPermission` 属性说明：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `column` | String | "" | 数据权限过滤字段，默认根据 scope 自动设置 |
| `scope` | DataPermissionScopeEnum | DATA_ALL | 数据权限范围 |
| `configCode` | String | "" | 在页面配置的数据权限编码 |
| `tableName` | String | "" | 数据权限对应的表名，优先级高于 tableClass |
| `tableClass` | Class<?> | Void.class | 数据权限表对应的实体类，优先级低于 tableName |
| `permissionValue` | String | "" | 自定义数据权限规则值 |

数据权限范围枚举：

| 范围                  | 说明                       |
| --------------------- | -------------------------- |
| `DATA_ALL`            | 所有数据（默认，不做限制） |
| `DATA_PERSONAL`       | 仅本人数据                 |
| `DATA_DEPT`           | 本部门数据                 |
| `DATA_DEPT_AND_CHILD` | 本部门及子部门数据         |
| `DATA_CUSTOM`         | 自定义规则                 |

#### 3. 手动控制数据权限

```java
// 忽略所有数据权限
SmartDataPermissionController.ignoreAll();
try {
    // 此范围内查询不受数据权限限制
} finally {
    SmartDataPermissionController.clear();
}

// 忽略指定表的数据权限
SmartDataPermissionController.ignoreTable("sys_user");
SmartDataPermissionController.ignoreTable(MyEntity.class);

// 忽略指定 Mapper 的数据权限
SmartDataPermissionController.ignoreMapper("com.example.mapper.UserMapper.selectList");

// 手动指定数据权限
SmartDataPermissionController.addManualDataPermission(
    SmartDataPermissionModel.builder()
        .scope(DataPermissionScopeEnum.DATA_DEPT)
        .column("dept_id")
        .tableName("sys_user")
        .build()
);
```

> **注意**：手动控制基于 ThreadLocal，必须确保在 finally 中调用 `clear()` 清理。

### 实现原理

#### 整体架构

```
@EnableDataPermission
    └── SmartDataPermissionConfiguration（自动配置）
        ├── SmartDataPermissionHandler（数据权限处理器，实现 MultiDataPermissionHandler）
        ├── SmartDataPermissionInterceptor（数据权限拦截器）
        ├── DataPermissionContextAspect（切面，解析 @SmartDataPermission 注解）
        ├── SmartDataPermissionWebFilter / SmartDataPermissionReactiveFilter（Web 过滤器，清理上下文）
```

#### 数据权限注入流程

1. **注解方式**：`DataPermissionContextAspect` 切面拦截标注了 `@SmartDataPermission` 的方法，将注解信息存入 `DataPermissionContextHolder`（ThreadLocal），方法执行完毕后清理
2. **数据库配置方式**：`SmartDataPermissionMapperHolder` 根据 mapperId 从缓存或远程服务获取数据权限配置
3. **手动指定方式**：通过 `SmartDataPermissionController` 直接设置

#### SQL 条件构建

`SmartDataPermissionHandler.getSqlSegment` 的执行流程：

1. 检查是否配置了忽略（ALL / TABLE / MAPPER 级别）
2. 获取用户上下文信息
3. 获取数据权限列表，优先级：手动指定 > 数据库配置 > 注解配置
4. 过滤掉 `DATA_ALL` 类型和表名不匹配的权限配置
5. 根据不同的 scope 构建表达式：
   - `DATA_PERSONAL` — 构建 `column = userId`
   - `DATA_DEPT` — 构建 `column = deptId` 或 `column IN (deptIdList)`
   - `DATA_DEPT_AND_CHILD` — 构建 `column IN (deptIdWithChildrenList)`
   - `DATA_CUSTOM` — 解析自定义规则值，替换占位符（如 `${userDeptWithChildren}`）后解析为 SQL 表达式

#### 自定义规则占位符

自定义 `permissionValue` 支持的占位符：

| 占位符                    | 替换值                                   |
| ------------------------- | ---------------------------------------- |
| `${userDept}`             | 当前用户的部门 ID 列表，格式 `(1, 2, 3)` |
| `${userDeptWithChildren}` | 当前用户的部门及子部门 ID 列表           |
| `${userId}`               | 当前用户 ID                              |
| `${userName}`             | 当前用户名称                             |
| 其他用户上下文属性        | 对应的属性值                             |

---

## 其他增强

### TypeHandler

#### 分隔符拆分 TypeHandler

`AbstractSplitTypeHandler` 将数据库中以逗号分隔的字符串自动拆分为 Java 的 `List`：

```java
// Long 类型列表
public class LongSplitTypeHandler extends AbstractSplitTypeHandler<Long> {
    @Override
    protected Long convert(String value) {
        return Long.valueOf(value);
    }
}

// String 类型列表
public class StringSplitTypeHandler extends AbstractSplitTypeHandler<String> {
    @Override
    protected String convert(String value) {
        return value;
    }
}
```

使用方式：在实体类字段上指定 TypeHandler

```java
@TableField(typeHandler = LongSplitTypeHandler.class)
private List<Long> roleIds;
```

#### Locale TypeHandler

`LocaleTypeHandler` 处理 Java `Locale` 类型与数据库字符串的转换，使用 `Locale.forLanguageTag()` 和 `Locale.toLanguageTag()` 进行转换。

### Locale JSON 序列化

`LocaleJson` 提供了 `Locale` 类型的 Jackson 序列化/反序列化器：

- `LocaleSerializer` — 序列化为语言标签格式（如 `zh-CN`）
- `LocaleDeserializer` — 从语言标签解析为 `Locale` 对象

### 主键生成器

`ShortenIdGenerator` 是框架提供的 ID 生成器，在 `SmartCrudAutoConfiguration` 中自动注册（当容器中没有其他 `IdentifierGenerator` 时生效）。

### 增强 SmartTableInfo

`SmartTableInfo` 继承自 MyBatis Plus 的 `TableInfo`，在原始表元数据的基础上增加了：

- `useYnField` — 启用/停用字段信息
- `logicDeleteInfo` — 逻辑删除信息（包含 deleteKey 字段、生成策略、需填充的字段列表）
- `defaultTenantFieldInfo` — 默认租户字段信息
- `tenantFieldInfoMap` — 所有租户字段映射
- `columnFieldMap` — 数据库列名到字段信息的映射
- `smartTableFieldInfoList` — 包含主键在内的完整字段列表

通过 CGLIB 代理方式创建，将原始 `TableInfo` 的方法调用委托给原始对象，同时扩展新方法。
