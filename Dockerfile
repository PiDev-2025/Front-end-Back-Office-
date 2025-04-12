# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps --no-audit

# Copy source files
COPY . .

# Define build arguments and set them as environment variables
ARG VITE_MAPBOX_TOKEN
ARG REACT_APP_MAPBOX_TOKEN
ARG MAPBOX_TOKEN

ENV VITE_MAPBOX_TOKEN=${VITE_MAPBOX_TOKEN}
ENV REACT_APP_MAPBOX_TOKEN=${REACT_APP_MAPBOX_TOKEN}
ENV MAPBOX_TOKEN=${MAPBOX_TOKEN}

# Create a runtime config file that will contain environment variables
RUN echo "window.RUNTIME_CONFIG = { \
    VITE_MAPBOX_TOKEN: \"${VITE_MAPBOX_TOKEN}\", \
    REACT_APP_MAPBOX_TOKEN: \"${REACT_APP_MAPBOX_TOKEN}\", \
    MAPBOX_TOKEN: \"${MAPBOX_TOKEN}\" \
};" > /app/public/runtime-config.js

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy build files from build stage
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/public/runtime-config.js /usr/share/nginx/html/runtime-config.js

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
