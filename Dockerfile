# Use an official Node.js 16 runtime as the base image
FROM node:16-alpine as builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY package.json yarn.lock ./

# Install project dependencies including devDependencies for the build process
RUN yarn install --frozen-lockfile

# Copy the entire project directory to the container
COPY . .

# # Set default ENV Mode
# ENV MODE=development

# Build the React app for production
RUN yarn build-mode

# Use a separate stage to create a lean final image
FROM node:16-alpine

WORKDIR /app

# Bring installed packages and built files from previous stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json

# Remove development dependencies
RUN yarn install --frozen-lockfile --production

# Expose the desired port (e.g., 3000) for the application
# EXPOSE 3000

# Set the command to start the application
# CMD ["yarn", "preview"]



# # Use an official Node.js 16 runtime as the base image
# FROM node:16-alpine as builder

# # Set the working directory inside the container
# WORKDIR /app

# # Copy the package.json and yarn.lock files to the container
# COPY package.json yarn.lock ./

# # Install project dependencies including devDependencies for the build process
# RUN yarn install --frozen-lockfile

# # Copy the entire project directory to the container
# COPY . .

# # Build the React app for production
# RUN yarn build-dev

# # Start the second stage, with Nginx as the base image
# FROM nginx:stable-alpine

# # Copy the custom Nginx configuration file to the appropriate directory
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Copy the React build from the builder stage to the Nginx public directory
# COPY --from=builder /app/build /usr/share/nginx/html

# # Nginx listens on port 80 by default, so we'll expose that port
# EXPOSE 80

# # Start Nginx when the container launches, using the daemon off option to run in the foreground
# CMD ["nginx", "-g", "daemon off;"]
