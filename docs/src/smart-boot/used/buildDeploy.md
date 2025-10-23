---
outline: deep
---

# 构建部署

## 一、构建

### 1、源码打包

```bash
mvn -B clean package -pl ${ROOT_MODULE}/${MODULE} -am -P${PROFILE} -Dmaven.test.skip=true -Dautoconfig.skip
```

参数说明：
PARENT_MODULE：根模块名

MODULE：要打包的模块名

PROFILE：启用的maven配置

示例：

```bash
# 打包单体应用 UAT环境
mvn -B clean package -pl smart-services/smart-service-system -am -Puat -Dmaven.test.skip=true -Dautoconfig.skip
# 打包cloud应用 pro环境
mvn -B clean package -pl smart-cloud-services/smart-cloud-service-system -am -Ppro -Dmaven.test.skip=true -Dautoconfig.skip
```

### 2、独立构建docker镜像

> 这种方式是maven构建和docker构建分开
>
> 先构建maven在构建docker

```bash
# copy jar
mkdir -p build \
&& cp ${PARENT_MODULE}/${MODULE}/target/${MODULE}.jar build/app.jar

# 构建镜像
docker build -f deployment/docker/Dockerfile \
  -t ${MODULE}:${PROFILE} \
  .
```

### 3、使用docker一体构建maven和docker镜像

> 该方式在dockerfile内部进行maven构建

```bash
# 构建微服务模块smart-cloud-service-system
docker build -f deployment/docker/Dockerfile-all-in \
  --build-arg $ROOT_MODULE=smart-cloud-services \
  --build-arg MODULE=smart-cloud-service-system \
  --build-arg PROFILE=uat \
  -t smart-cloud-service-system:uat \
  .
```

## 二、部署

### 1、使用阿里云flow发布到阿里云ACR和ACK（YAML方式）

::: info

流水线第一次执行会在ACR生成镜像，然后在ACK创建对应的POD

::: 

::: details 阿里云FLOW YAML

```yaml
sources:
  repo_0:
    type: codeup
    name: ftsc_backend_rX2s
    endpoint: ${git地址}
    branch: development
    certificate:
      type: serviceConnection
      serviceConnection: ${git连接服务}
defaultWorkspace: repo_0
stages:
  stage_0:
    name: 阶段1
    jobs:
      job_0:
        name: Java 构建Docker镜像并推送镜像仓库
        runsOn:
          group: public/cn-beijing
          labels: linux,amd64
          container: build-steps-public-registry.cn-beijing.cr.aliyuncs.com/build-steps/alinux3:latest
        steps:
          step_0:
            name: 安装 Java
            step: SetupJava
            with:
              jdkVersion: '21'
              mavenVersion: 3.9.3
          step_1:
            name: 执行命令
            step: Command
            with:
              variables: []
              ifGivenShell: false
              run: |-
                mvn -B clean package -pl ${PARENT_MODULE}/${MODULE} -am -P${PROFILE} -Dmaven.test.skip=true -Dautoconfig.skip \
                    && mkdir -p build \
                    && cp ${PARENT_MODULE}/${MODULE}/target/${MODULE}.jar build/app.jar
          step_2:
            name: 镜像构建并推送至ACR（企业版）
            step: DockerBuildPushACREE
            with:
              artifact: artifact
              instance: smc-acr
              dockerfilePath: deployment/docker/Dockerfile
              namespace: smc-ftsc
              dockerRegistry: ${ACK_NAME}
              useVpcAddress: false
              contextPath: /
              dockerTag: ${DATETIME}
              region: cn-qingdao
              cacheType: remote
              serviceConnection: ${ACR连接服务}
        driven: auto
        plugins: []
  stage_1:
    name: 新阶段
    jobs:
      job_0:
        name: 镜像升级
        runsOn:
          group: public/cn-beijing
          labels: linux,amd64
          container: build-steps-public-registry.cn-beijing.cr.aliyuncs.com/build-steps/alinux3:latest
        steps:
          step_0:
            name: Kubectl镜像升级
            step: KubectlSetImage
            with:
              container: ${ACK_NAME}
              artifact: $[stages.stage_0.job_0.step_2.artifacts.artifact_vpc]
              workloadKind: deployment
              skipTlsVerify: false
              kubernetesCluster: ${K8S集群ID}
              namespace: smc-ftsc
              workload: ${ACK_NAME}
              kubectlVersion: 1.16.4
              rolloutTimeout: 10
        driven: auto
        plugins: []

```

::: 





