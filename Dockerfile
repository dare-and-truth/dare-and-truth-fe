# Bước 1: Sử dụng node:alpine để giảm kích thước image
FROM node:18-alpine AS builder

# Đặt thư mục làm việc
WORKDIR /app

# Copy package.json và lockfile để cài đặt dependencies
COPY package.json package-lock.json ./

# Cài đặt dependencies mà không giữ lại cache để tối ưu dung lượng
RUN npm ci

# Copy toàn bộ mã nguồn
COPY . .

# Build ứng dụng Next.js
RUN npm run build

# Chỉ giữ lại các file cần thiết
RUN rm -rf node_modules && npm ci --omit=dev

# Bước 2: Tạo image nhẹ chỉ với production files
FROM node:18-alpine AS runner

WORKDIR /app

# Copy các file cần thiết từ builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Thiết lập biến môi trường
ENV NODE_ENV=production
ENV PORT=3000

# Expose cổng 3000
EXPOSE 3000

# Chạy ứng dụng
CMD ["npm", "start"]
