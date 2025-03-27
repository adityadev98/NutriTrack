# # Use Node.js base image
# FROM node:18

# # Set working directory
# WORKDIR /app

# # Accept build-time args
# ARG VITE_GOOGLE_CLIENT_ID
# ARG VITE_NUTRITIONIX_APP_ID
# ARG VITE_NUTRITIONIX_API_KEY
# ARG VITE_PORT

# # Pass them as ENV so Vite picks them up
# ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
# ENV VITE_NUTRITIONIX_APP_ID=$VITE_NUTRITIONIX_APP_ID
# ENV VITE_NUTRITIONIX_API_KEY=$VITE_NUTRITIONIX_API_KEY
# ENV VITE_PORT=$VITE_PORT

# # Copy entire project including frontend
# COPY . .

# # Install backend dependencies
# RUN npm install

# # Copy frontend package.json and install frontend dependencies
# WORKDIR /app/NutriTrack-Frontend
# RUN npm install --include=dev && npm run build

# WORKDIR /app


# # Expose the backend port
# EXPOSE 5000

# # Start the application
# CMD ["npm", "start"]

# Dockerfile at root

# Try 2
# FROM node:18

# WORKDIR /app

# # Copy only necessary backend files and root-level package.json
# COPY package*.json ./
# COPY NutriTrack-Backend ./NutriTrack-Backend

# # Install dependencies
# RUN npm install

# # Set the working directory to backend
# WORKDIR /app/NutriTrack-Backend

# EXPOSE 5000
# CMD ["node", "index.js"]

# -------- Build Frontend --------
    # FROM node:18 as frontend-builder

    # WORKDIR /frontend
    
    # # Accept frontend build arguments
    # ARG VITE_GOOGLE_CLIENT_ID
    # ARG VITE_NUTRITIONIX_APP_ID
    # ARG VITE_NUTRITIONIX_API_KEY
    # ARG VITE_PORT
    # ARG VITE_BACKEND_URL
    
    # ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
    # ENV VITE_NUTRITIONIX_APP_ID=$VITE_NUTRITIONIX_APP_ID
    # ENV VITE_NUTRITIONIX_API_KEY=$VITE_NUTRITIONIX_API_KEY
    # ENV VITE_PORT=$VITE_PORT
    # ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
    
    # COPY NutriTrack-Frontend ./NutriTrack-Frontend
    # WORKDIR /frontend/NutriTrack-Frontend
    
    # RUN npm install --include=dev && npm run build
    
    # # -------- Setup Backend --------
    # FROM node:18 as backend
    
    # WORKDIR /app
    
    # COPY package*.json ./
    # RUN npm install
    
    # COPY . .
    
    # # -------- Final Image --------
    # FROM nginx:alpine
    
    # # Copy frontend build to Nginx
    # COPY --from=frontend-builder /frontend/NutriTrack-Frontend/dist /usr/share/nginx/html
    # COPY NutriTrack-Frontend/nginx.conf /etc/nginx/conf.d/default.conf
    
    # # Copy backend files
    # COPY --from=backend /app /app
    
    # # Expose ports
    # EXPOSE 80   
    # EXPOSE 5000  
    
    # # Start backend in background, then nginx
    # CMD sh -c "node /app/NutriTrack-Backend/index.js & nginx -g 'daemon off;'"
    
# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Accept frontend build-time args
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_NUTRITIONIX_APP_ID
ARG VITE_NUTRITIONIX_API_KEY
ARG VITE_PORT
ARG VITE_BACKEND_URL

# Expose frontend env vars so Vite can use them
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_NUTRITIONIX_APP_ID=$VITE_NUTRITIONIX_APP_ID
ENV VITE_NUTRITIONIX_API_KEY=$VITE_NUTRITIONIX_API_KEY
ENV VITE_PORT=$VITE_PORT
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Copy everything
COPY . .

# Install backend dependencies
RUN npm install

# Build frontend
WORKDIR /app/NutriTrack-Frontend
RUN npm install --include=dev && npm run build

# Move back to backend
WORKDIR /app

# Expose backend port
EXPOSE 5000

# Start the backend (which will serve frontend in prod)
CMD ["node", "NutriTrack-Backend/index.js"]
