---
outline: deep
---

# 快速开始 {#quick-start}

## 一、前置准备

::: info 环境要求

在项目启动前，你需要确保你的环境满足以下要求：

- [Java21](https://www.oracle.com/java/technologies/downloads/#java21)
- [Git](https://git-scm.com/) 任意版本
- [Maven](https://maven.apache.org/download.cgi) 3.9+

验证你的环境是否满足以上要求，你可以通过以下命令查看版本：

```bash
# 出现相应 java 版本即可
java -version
# 出现相应 git 版本即可
git -v
# 出现相应 maven 版本即可
mvn -v
```

:::

## 二、启动项目

::: warning maven

在安装依赖前需要注意，不能使用maven自定义配置

自定义配置会覆盖pom文件中的仓库信息导致依赖拉取失败

:::

### 1、获取源码

```shell
git clone {代码地址}
```

### 2、命令行安装依赖

```bash
# 进入项目目录
cd {项目目录}
# 安装依赖
mvn clean
mvn compile

```

### 3、使用idea界面安装依赖

![image-20250905102144058](/Users/shizhongming/Documents/01-workspace/01-my-github/smart-boot-ui-vben/docs/src/smart-boot/introduction/images/image-20250905102144058.png)

### 4、启动项目

![image-20250905102609559](/Users/shizhongming/Documents/01-workspace/01-my-github/smart-boot-ui-vben/docs/src/smart-boot/introduction/images/image-20250905102609559.png)
