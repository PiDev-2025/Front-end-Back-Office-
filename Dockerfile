# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY . .
RUN npm install --legacy-peer-deps --no-audit
# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cleanup
RUN rm -rf /var/cache/apk/* && \
    rm -rf /tmp/*

EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
