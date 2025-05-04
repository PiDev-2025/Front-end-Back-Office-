
FROM node:20 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps 


# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 5173

# Set environment variable for Vite to bind to all interfaces
ENV HOST=0.0.0.0

# Start the application
CMD ["npm", "run", "dev", "--", "--host"]
