# 第一阶段：构建阶段 - 使用Node.js构建React应用
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package文件（利用Docker缓存层，如果package.json不变，则跳过npm install）
COPY package.json package-lock.json* ./

# 安装依赖（生产依赖 + 开发依赖，因为构建需要typescript等工具）
RUN npm ci --silent

# 复制所有源代码
COPY . .

# 构建React应用（生成优化的静态文件到dist目录）
RUN npm run build

# 第二阶段：开发阶段 - 用于热重载开发
FROM node:18-alpine AS development

WORKDIR /app

# 复制package文件
COPY package.json package-lock.json* ./

# 安装所有依赖（包括开发依赖）
RUN npm ci --silent

# 复制源代码
COPY . .

# 暴露开发服务器端口
EXPOSE 3000

# 启动开发服务器（带热重载）
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# 第三阶段：生产阶段 - 使用轻量级Nginx服务静态文件
FROM nginx:stable-alpine AS production

# 安装curl用于健康检查
RUN apk add --no-cache curl

# 复制自定义Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 从构建阶段复制构建好的静态文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露Nginx端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# 启动Nginx（前台运行）
CMD ["nginx", "-g", "daemon off;"]