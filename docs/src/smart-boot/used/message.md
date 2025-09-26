# 消息模块

框架集成统一消息接口，支持常用的消息通道

## 一、消息通道

| 序号 | 一级通道  | 二级通道     | 描述                |
| ---- | --------- | ------------ | ------------------- |
| 1    | 系统消息  |              | 系统内置的系统消息  |
| 2    | websocket |              | 系统内置的websocket |
| 3    | 短信      | 阿里云       | 阿里云短信通道      |
| 4    | 短信      | 腾讯云       | 腾讯云短信通道      |
| 5    | 邮件      |              | 邮件消息            |
| 6    | 钉钉      | 钉钉工作通知 | 发送钉钉工作通知    |

## 二、如何使用（开发）

### 1、引入API

#### 1）单体架构引入

```xml
<dependency>
  <groupId>com.smart</groupId>
  <artifactId>smart-message-api</artifactId>
</dependency>
```

#### 2）微服务架构引入

```xml
<dependency>
  <groupId>com.smart</groupId>
  <artifactId>smart-cloud-message-api</artifactId>
</dependency>
```

### 2、发送消息

使用消息发送接口`com.smart.module.api.message.SmartMessageApi`发送消息

参数说明

| 序号 | 参数 | 类型 | 描述 | 默认值 | 是否必须 |
| --- | --- | --- | --- | --- | --- |
| 1 | messageId | Long | 标记发送消息的ID，用于系统消息发送 |  |  |
| 2 | messageChannelCodeList | `List<String>` | 消息通道列表 |  | 是 |
| 3 | toUserIds | `Set<Long>` | 接收人ID集合 |  |  |
| 4 | title | String | 消息标题 |  | 是 |
| 5 | content | String | 消息内容，和模板编码二选一 |  |  |
| 6 | templateCode | String | 模板编码，如果发送模板消息需要指定 |  |  |
| 7 | templateData | Object | 模板数据 |  |  |
| 8 | isMarkdown | boolean | 是否是markdown消息，钉钉消息通知支持markdown | false |  |
| 9 | priority | `enum<L/M/H>` | 系统消息的优先级 |  |  |
| 10 | business | Object | 业务参数，发送系统消息会存储业务信息，用户反向查询消息对应的业务数据 |  |  |
| 10.1 | &nbsp;&nbsp;&nbsp;businessIdent | String | 业务标识 |  |  |
| 10.2 | &nbsp;&nbsp;&nbsp;businessId | Long | 业务ID |  |  |
| 10.3 | &nbsp;&nbsp;&nbsp;businessData | String | 业务数据 |  |  |
| 11 | smsSendParameter | Object | 短息发送参数 |  |  |
| 11.1 | &nbsp;&nbsp;&nbsp;signName | String | 短信签名 |  |  |
| 11.2 | &nbsp;&nbsp;&nbsp;template | String | 短信模板 |  |  |
| 12 | emailSendParameter | Object | 邮件发送参数 |  |  |
| 12.1 | &nbsp;&nbsp;&nbsp;from | String | 发件人 |  | 是 |
| 12.2 | &nbsp;&nbsp;&nbsp;toList | `List<String>` | 收件人列表，如果为null，则根据toUserIds获取收件人 |  |  |
| 12.3 | &nbsp;&nbsp;&nbsp;ccList | `List<String>` | 抄送人 |  |  |

### 3、示例

#### 1）发送系统消息

```java
this.smartMessageApi.send(
        RemoteMessageSendParameter.builder()
                .messageId(data.getId())
                .toUserIds(new HashSet<>(userIds))
                .content(data.getContent())
                .priority(data.getPriority())
                .messageChannelCodeList(List.of(SYSTEM_MESSAGE_CHANNEL, WEB_SOCKET_MESSAGE_CHANNEL))
                .build()
);
```

#### 2）发送钉钉工作通知

::: warning 注意

接收用户必须在用户管理页面维护手机号，且手机号与钉钉手机号一直

:::

```java
// 发送钉钉消息
List<MessageSendDTO> sendResult = this.smartMessageApi.send(
        RemoteMessageSendParameter.builder()
                .messageChannelCodeList(List.of(MESSAGE_WORK_NOTICE_CHANNEL))
                .toUserIds(Set.of(userId))
                .content(message)
                .build()
);
```

#### 3）发送邮件

```java
this.smartMessageApi.send(
        RemoteMessageSendParameter.builder()
                .messageChannelCodeList(List.of(MESSAGE_MAIL_CODE))
                .title(subject)
                .templateCode(ARRIVAL_NOTICE_TEMPLATE_CODE)
                .templateData(notice)
                .emailSendParameter(RemoteMessageSendParameter.EmailSendParameter.builder()
                        .from(sender)
                        .toList(List.of(targetEmail))
                        .build())
                .build()
);
```

## 三、页面维护

### 1、消息通道

通过消息通道页面维护消息通道

![image-20250926160450493](/Users/shizhongming/Documents/01-workspace/01-my-github/smart-boot-ui-vben/docs/src/smart-boot/used/images/image-20250926160450493.png)

### 二、维护消息模板

通过模板维护页面维护消息模板，用来发送模板消息

模板使用富文本组件编辑

模板数据填充基于freemarker

![image-20250926160700334](/Users/shizhongming/Documents/01-workspace/01-my-github/smart-boot-ui-vben/docs/src/smart-boot/used/images/image-20250926160700334.png)

### 3、系统消息

发送系统消息通道发送系统消息、通知公告等

![image-20250926160812343](/Users/shizhongming/Documents/01-workspace/01-my-github/smart-boot-ui-vben/docs/src/smart-boot/used/images/image-20250926160812343.png)

### 4、我的消息

我收到的系统消息列表

![image-20250926160917647](/Users/shizhongming/Documents/01-workspace/01-my-github/smart-boot-ui-vben/docs/src/smart-boot/used/images/image-20250926160917647.png)

## 四、启动服务

单体架构在启动服务直接引入对应通道依赖

微服务架构需要在消息服务模块`smart-cloud-services/smart-cloud-service-message`引入通道依赖

`通道依赖列表`

```xml
<!--      钉钉消息通道      -->
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-boot-starter-message-dingtalk</artifactId>
</dependency>
<!--      邮件消息通道      -->
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-boot-starter-message-email</artifactId>
</dependency>
<!--      阿里云短信通道      -->
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-boot-starter-message-sms-aliyun</artifactId>
</dependency>
<!--      腾讯云短信通道      -->
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-boot-starter-message-sms-tencent</artifactId>
</dependency>
<!--      websocket通道      -->
<dependency>
    <groupId>com.smart</groupId>
    <artifactId>smart-boot-starter-message-websocket</artifactId>
</dependency>
```
