# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps --no-audit
COPY . .
# Production stage
FROM nginx:alpine

# Build the application
RUN npm run build

# Define build arguments and set them as environment variables
ARG VITE_MAPBOX_TOKEN
ARG REACT_APP_MAPBOX_TOKEN
ARG MAPBOX_TOKEN
# Production stage
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/public/runtime-config.js /usr/share/nginx/html/runtime-config.js

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf




EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
