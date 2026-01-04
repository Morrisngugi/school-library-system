# Environment Setup Guide

## Quick Reference

The project uses different environment files for different scenarios:

| File | Purpose | Used By |
|------|---------|---------|
| `.env.development` | Docker development mode | `docker-compose.dev.yml` |
| `.env.production` | Docker production mode | `docker-compose.yml` |
| `.env.example` | Template for manual setup | Copy to `backend/.env` |
| `backend/.env.example` | Backend-specific template | Manual Node.js setup |

---

## Setup for Different Scenarios

### Scenario 1: Docker Development (Recommended for Development)

✅ **Best for**: Daily development work with hot reload

```powershell
# 1. Navigate to project
cd "E:\Source Code\school-library-system"

# 2. The .env.development file is already configured!
# Just update your email/SMS if needed

# 3. Start containers
docker-compose -f docker-compose.dev.yml up -d

# 4. Access the app
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

**What's included:**
- ✅ MongoDB pre-configured
- ✅ Hot reload enabled
- ✅ Email already configured (your Gmail)
- ✅ Development JWT secret

---

### Scenario 2: Docker Production

✅ **Best for**: Deploying to a server or production environment

```powershell
# 1. Navigate to project
cd "E:\Source Code\school-library-system"

# 2. Review and update .env.production
# IMPORTANT: Update these values:
# - JWT_SECRET (use a strong random string)
# - MONGODB_URI password
# - CLIENT_URL (your domain)
# - SMS_API_KEY (production credentials)

notepad .env.production

# 3. Start containers
docker-compose up -d

# 4. Your app is running in production mode!
```

**Before Production Deployment:**
- [ ] Generate strong JWT secret: 
  ```powershell
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Update MongoDB password in both `docker-compose.yml` and `.env.production`
- [ ] Set your production domain in `CLIENT_URL`
- [ ] Add production SMS API credentials
- [ ] Consider using environment secrets management (AWS Secrets Manager, etc.)

---

### Scenario 3: Manual Setup (Without Docker)

✅ **Best for**: Development without Docker or custom configurations

```powershell
# 1. Copy template to backend
copy .env.example backend\.env

# 2. Edit the backend/.env file
notepad backend\.env

# 3. Update MONGODB_URI to:
MONGODB_URI=mongodb://localhost:27017/school_library

# 4. Install dependencies
cd backend
npm install
cd ..\frontend
npm install

# 5. Start MongoDB locally (must be installed)
# Windows: Start MongoDB service
# mongod --dbpath C:\data\db

# 6. Start backend (Terminal 1)
cd backend
npm run dev

# 7. Start frontend (Terminal 2)
cd frontend
npm run serve
```

---

## Environment Variables Explained

### Critical Variables (Must Update for Production)

#### JWT_SECRET
```env
# Development: Simple string is fine
JWT_SECRET=dev_jwt_secret_key

# Production: Use strong random string
JWT_SECRET=de344f3d21ecb71e0de6a3c0f11c2b0215547b5fcf981fa354de85b1d2e6d2a3
```

**Generate**: 
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### EMAIL Configuration (Gmail)

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # App Password
EMAIL_FROM=noreply@schoollibrary.com
```

**How to get Gmail App Password:**
1. Go to https://myaccount.google.com/
2. Enable 2-Factor Authentication
3. Go to https://myaccount.google.com/apppasswords
4. Generate an app password for "Mail"
5. Use the 16-character password in `EMAIL_PASSWORD`

#### SMS Configuration (Africa's Talking)

```env
# Sandbox (Development/Testing)
SMS_API_KEY=your_sandbox_api_key
SMS_USERNAME=sandbox
SMS_SENDER_ID=LIBRARY

# Production
SMS_API_KEY=your_production_api_key
SMS_USERNAME=your_username
SMS_SENDER_ID=LIBRARY
```

**Sign up**: https://africastalking.com/
- Development: Use sandbox (free testing)
- Production: Add credits for real SMS

#### MongoDB Connection

```env
# Docker Development
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/school_library?authSource=admin

# Docker Production (change password!)
MONGODB_URI=mongodb://admin:SECURE_PASSWORD@mongodb:27017/school_library?authSource=admin

# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/school_library
```

---

## Common Tasks

### Update Email Credentials
```powershell
# Edit the appropriate file
notepad .env.development     # For Docker dev
notepad .env.production      # For Docker prod
notepad backend\.env         # For manual setup

# Restart backend
docker-compose -f docker-compose.dev.yml restart backend
```

### Switch Between Environments

```powershell
# Stop current environment
docker-compose -f docker-compose.dev.yml down
# OR
docker-compose down

# Start different environment
docker-compose -f docker-compose.dev.yml up -d  # Development
docker-compose up -d                             # Production
```

### Check Current Configuration

```powershell
# View environment variables in running container
docker-compose exec backend printenv

# Or check specific variable
docker-compose exec backend printenv JWT_SECRET
```

---

## Troubleshooting

### Email Not Sending

1. **Check credentials**:
   ```powershell
   docker-compose logs backend | Select-String "email"
   ```

2. **Gmail issues**: Make sure you're using an App Password, not your regular password

3. **Test email manually** in backend container:
   ```powershell
   docker-compose exec backend node -e "require('./utils/email').sendEmail({to:'test@test.com',subject:'Test',text:'Test'})"
   ```

### SMS Not Sending

1. **Check Africa's Talking credentials**
2. **Verify sandbox vs production mode**
3. **Check phone number format**: Must be +254XXXXXXXXX for Kenya

### Database Connection Issues

1. **Check MongoDB is running**:
   ```powershell
   docker-compose ps mongodb
   ```

2. **Test connection**:
   ```powershell
   docker-compose exec mongodb mongosh -u admin -p admin123
   ```

3. **Check connection string** in environment file

### Wrong Environment Being Used

```powershell
# Make sure you're using the right docker-compose file
docker-compose -f docker-compose.dev.yml up   # Development
docker-compose up                              # Production (uses docker-compose.yml)
```

---

## Security Best Practices

### For Production:

1. **Never commit** `.env` files (they're in `.gitignore`)
2. **Use strong passwords** for MongoDB
3. **Generate unique JWT secret** for each environment
4. **Use environment secrets** management in cloud (AWS Secrets Manager, Azure Key Vault)
5. **Rotate credentials** regularly
6. **Use HTTPS** in production (set up reverse proxy with SSL)
7. **Restrict MongoDB access** (don't expose port 27017 in production)
8. **Enable firewall** rules

### Files to Never Commit:
- ❌ `.env`
- ❌ `backend/.env`
- ❌ Any file with real credentials
- ✅ `.env.example` (template only)
- ✅ `.env.development` (if using dummy/test credentials)
- ✅ `.env.production` (if using placeholders only)

---

## Summary

**For Quick Development Start:**
```powershell
cd "E:\Source Code\school-library-system"
docker-compose -f docker-compose.dev.yml up -d
```
Everything is pre-configured! Just visit http://localhost:3000

**For Production Deployment:**
1. Update `.env.production` with real credentials
2. Generate strong JWT secret
3. Update MongoDB password
4. Run: `docker-compose up -d`

**Need Help?** Check `DOCKER_GUIDE.md` for detailed Docker commands and troubleshooting.
