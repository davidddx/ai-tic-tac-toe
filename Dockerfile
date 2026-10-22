# build react app 
ARG NODE_VERSION=24.14.0-alpine
FROM node:${NODE_VERSION} AS builder 
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build

# nginx
FROM nginx:stable-alpine
# Copy the custom nginx configuration file from your local directory
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy the static production build files from the builder stage
# (Vite outputs to /app/dist by default; change to /app/build if using Create React App)
COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
