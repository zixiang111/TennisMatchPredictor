# 第一阶段：构建阶段 - 使用Node.js构建React应用
FROM node:20-alpine AS builder

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

# 第二阶段：生产阶段 - 使用轻量级http-server服务静态文件
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 全局安装http-server
RUN npm install -g http-server

# 从构建阶段复制构建好的静态文件
COPY --from=builder /app/dist dist

# 暴露服务端口
EXPOSE 3000

# 启动http-server
CMD ["http-server", "dist", "-p", "3000", "-c-1"]