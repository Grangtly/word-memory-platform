# 阶段1：构建前端
FROM node:20-alpine AS client-build
WORKDIR /client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# 阶段2：构建后端 + 托管前端
FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/ .
# 把前端构建产物复制进来
COPY --from=client-build /client/dist ./public
EXPOSE 3000
CMD ["node", "index.js"]
