FROM smc-acr-registry.cn-qingdao.cr.aliyuncs.com/smc-common/node:24.19-slim AS builder

ARG APP_NAME

RUN test -n "${APP_NAME}" || \
    (echo "ERROR: 必须通过 --build-arg APP_NAME=<项目名> 指定项目，例如--build-arg APP_NAME=web-smart-boot" >&2; exit 1)

# --max-old-space-size
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_OPTIONS=--max-old-space-size=8192
ENV TZ=Asia/Shanghai

RUN npm config set registry https://registry.npmmirror.com && \
    corepack enable

WORKDIR /app

# copy package.json and pnpm-lock.yaml to workspace
COPY . /app

ENV CI=true

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    --mount=type=cache,id=corepack,target=/usr/local/share/corepack \
    pnpm install --frozen-lockfile
RUN pnpm run build --filter=./apps/${APP_NAME} && \
  cp -r "/app/apps/${APP_NAME}/dist" /app/dist

RUN echo "Builder Success 🎉"

FROM smc-acr-registry.cn-qingdao.cr.aliyuncs.com/smc-common/nginx:stable-alpine AS production

RUN echo "types { application/javascript js mjs; }" > /etc/nginx/conf.d/mjs.conf
COPY --from=builder /app/dist /usr/share/nginx/html

COPY --from=builder /app/scripts/deploy/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

# start nginx
CMD ["nginx", "-g", "daemon off;"]
