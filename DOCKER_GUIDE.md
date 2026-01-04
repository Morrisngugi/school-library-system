# Docker Deployment Guide

## School Library Management System - Docker Setup

This guide covers deploying the School Library Management System using Docker and Docker Compose.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Development Setup](#development-setup)
4. [Production Deployment](#production-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Windows
- Docker Desktop for Windows
- WSL2 (Windows Subsystem for Linux)
- PowerShell or Command Prompt

### Installation on Windows:
1. Download Docker Desktop from https://www.docker.com/products/docker-desktop
2. Install and restart your computer
3. Enable WSL2 integration in Docker Desktop settings

### Verify Installation:
```powershell
docker --version
docker-compose --version
```

---

## Quick Start

### 1. Clone and Navigate
```powershell
cd "E:\Source Code\school-library-system"
```

### 2. Create Environment File
```powershell
# Copy the template
copy .env.docker .env

# Edit with your text editor
notepad .env
```

### 3. Start All Services (Development)
```powershell
docker-compose -f docker-compose.dev.yml up -d
```

### 4. Check Status
```powershell
docker-compose -f docker-compose.dev.yml ps
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health
- **MongoDB**: localhost:27017 (username: admin, password: admin123)

---

## Development Setup

Development mode includes:
- ✅ Hot reload for both frontend and backend
- ✅ Source code mounted as volumes
- ✅ Development dependencies included
- ✅ Detailed error messages

### Start Development Environment
```powershell
# Build and start
docker-compose -f docker-compose.dev.yml up --build -d

# View logs (all services)
docker-compose -f docker-compose.dev.yml logs -f

# View logs (specific service)
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml logs -f frontend
docker-compose -f docker-compose.dev.yml logs -f mongodb
```

### Development Commands
```powershell
# Restart a service
docker-compose -f docker-compose.dev.yml restart backend

# Stop all services
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes (clears database)
docker-compose -f docker-compose.dev.yml down -v

# Rebuild a specific service
docker-compose -f docker-compose.dev.yml up --build backend
```

### Execute Commands Inside Containers
```powershell
# Access backend container shell
docker-compose -f docker-compose.dev.yml exec backend sh

# Run npm commands in backend
docker-compose -f docker-compose.dev.yml exec backend npm install package-name

# Access MongoDB shell
docker-compose -f docker-compose.dev.yml exec mongodb mongosh -u admin -p admin123

# View backend files
docker-compose -f docker-compose.dev.yml exec backend ls -la
```

---

## Production Deployment

Production mode includes:
- ✅ Optimized builds
- ✅ Production dependencies only
- ✅ Nginx for frontend serving
- ✅ Security best practices
- ✅ Health checks and auto-restart

### 1. Configure Environment
```powershell
# Create production .env file
copy .env.docker .env

# Update with production values:
# - Strong JWT secret
# - Real email credentials
# - SMS API keys
# - Production MongoDB credentials
```

### 2. Build and Deploy
```powershell
# Build all images
docker-compose build

# Start services
docker-compose up -d

# Verify all services are healthy
docker-compose ps
```

### 3. Monitor Services
```powershell
# View logs
docker-compose logs -f

# Check resource usage
docker stats

# Check health status
docker-compose ps
```

### 4. Backup Database
```powershell
# Create backup
docker-compose exec mongodb mongodump --username admin --password admin123 --authenticationDatabase admin --out /backup

# Copy backup to host
docker cp library-mongodb:/backup ./backup-$(Get-Date -Format "yyyy-MM-dd")
```

### 5. Restore Database
```powershell
# Copy backup to container
docker cp ./backup library-mongodb:/restore

# Restore
docker-compose exec mongodb mongorestore --username admin --password admin123 --authenticationDatabase admin /restore
```

---

## Environment Configuration

### Required Environment Variables

#### JWT Configuration
```env
JWT_SECRET=your_super_secure_random_string_at_least_32_chars
```

#### Email Configuration (Gmail Example)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=noreply@schoollibrary.com
```

**Note for Gmail**: You need to:
1. Enable 2-factor authentication
2. Create an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `EMAIL_PASSWORD`

#### SMS Configuration (Africa's Talking - Kenya)
```env
SMS_API_KEY=your_api_key_from_africastalking
SMS_USERNAME=your_username_or_sandbox
SMS_SENDER_ID=LIBRARY
```

**Sign up**: https://africastalking.com/

---

## Docker Compose Files Explained

### docker-compose.dev.yml (Development)
- Hot reload enabled
- Source code mounted as volumes
- Development dependencies installed
- Detailed logging
- Port mappings: 3000 (frontend), 5000 (backend), 27017 (mongodb)

### docker-compose.yml (Production)
- Optimized builds
- Production-only dependencies
- Nginx serving static files
- Health checks configured
- Auto-restart policies
- Persistent volumes for data

---

## Troubleshooting

### Port Already in Use
```powershell
# Check what's using the port
netstat -ano | findstr :5000
netstat -ano | findstr :3000
netstat -ano | findstr :27017

# Kill the process (replace PID)
taskkill /PID <process_id> /F
```

### Container Won't Start
```powershell
# View detailed logs
docker-compose logs backend

# Check container status
docker ps -a

# Remove and rebuild
docker-compose down
docker-compose up --build
```

### MongoDB Connection Issues
```powershell
# Check MongoDB is running
docker-compose ps mongodb

# View MongoDB logs
docker-compose logs mongodb

# Test MongoDB connection
docker-compose exec mongodb mongosh -u admin -p admin123 --eval "db.adminCommand('ping')"
```

### Permission Issues (Windows)
```powershell
# Run PowerShell as Administrator
# Or adjust Docker Desktop settings to allow file sharing
```

### Clear Everything and Start Fresh
```powershell
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all -v

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d
```

### View Container Resource Usage
```powershell
# Real-time stats
docker stats

# Container details
docker inspect library-backend
```

### Access Container Logs
```powershell
# Follow logs in real-time
docker-compose logs -f --tail=100

# Save logs to file
docker-compose logs > logs.txt
```

---

## Advanced Docker Commands

### Scaling Services
```powershell
# Run multiple backend instances (requires load balancer)
docker-compose up -d --scale backend=3
```

### Update a Single Service
```powershell
# Rebuild and restart backend only
docker-compose up -d --build --no-deps backend
```

### Clean Up Docker System
```powershell
# Remove unused containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Clean everything
docker system prune -a --volumes
```

---

## Production Checklist

Before deploying to production:

- [ ] Update all environment variables in `.env`
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Configure real email credentials
- [ ] Set up SMS API (Africa's Talking)
- [ ] Change MongoDB credentials
- [ ] Enable HTTPS/SSL (use reverse proxy like Nginx or Traefik)
- [ ] Set up automated backups
- [ ] Configure monitoring and logging
- [ ] Test all features
- [ ] Review security settings
- [ ] Set up domain name
- [ ] Configure firewall rules

---

## Using with Cloud Providers

### Deploy to AWS ECS/Fargate
```bash
# Push images to ECR
aws ecr create-repository --repository-name library-backend
aws ecr create-repository --repository-name library-frontend

docker tag library-backend:latest <account>.dkr.ecr.<region>.amazonaws.com/library-backend
docker push <account>.dkr.ecr.<region>.amazonaws.com/library-backend
```

### Deploy to Azure Container Instances
```bash
# Push to Azure Container Registry
az acr create --resource-group mygroup --name libraryacr --sku Basic
docker tag library-backend:latest libraryacr.azurecr.io/library-backend
az acr login --name libraryacr
docker push libraryacr.azurecr.io/library-backend
```

### Deploy to Google Cloud Run
```bash
# Push to Google Container Registry
docker tag library-backend:latest gcr.io/<project-id>/library-backend
docker push gcr.io/<project-id>/library-backend
gcloud run deploy library-backend --image gcr.io/<project-id>/library-backend
```

---

## Support

For Docker-related issues:
- Docker Documentation: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/

For application issues, check the main README.md
