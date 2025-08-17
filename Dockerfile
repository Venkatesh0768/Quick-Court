# Multi-stage build for production
# Frontend will be served by default, backend runs separately

# Stage 1: Frontend build
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY Frontend/package*.json ./
RUN npm ci --omit=dev
COPY Frontend .
RUN npm run build

# Stage 2: Backend build (optional - remove if deploying separately)
FROM gradle:8.8-jdk21 AS backend-build
WORKDIR /app/backend
COPY QuickCourt-Backend/build.gradle QuickCourt-Backend/settings.gradle ./
COPY QuickCourt-Backend/gradle ./gradle
COPY QuickCourt-Backend/src ./src
RUN gradle clean build -x test

# Stage 3: Production image (serves frontend by default)
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy frontend assets
COPY --from=frontend-build /app/frontend/dist .

# (Optional) Copy backend jar if needed
# COPY --from=backend-build /app/backend/build/libs/*.jar /backend/app.jar

# Nginx config
COPY Frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]