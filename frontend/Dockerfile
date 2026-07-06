FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .

# Vite 构建时需要的环境变量，从 docker-compose build args 传入
ARG VITE_API_BASE_URL
ARG VITE_APP_OSS_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_APP_OSS_BASE_URL=$VITE_APP_OSS_BASE_URL

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/gapclub.fmtcloud.cn.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
