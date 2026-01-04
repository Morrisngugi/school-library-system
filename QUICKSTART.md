# 🚀 Quick Start Guide

## Choose Your Setup Method

### Option 1: Automated Setup (Easiest) ⭐

```powershell
cd "E:\Source Code\school-library-system"
.\start.ps1
```

Then select option `1` for development mode. That's it!

---

### Option 2: Manual Docker Commands

**Development Mode:**
```powershell
cd "E:\Source Code\school-library-system"
docker-compose -f docker-compose.dev.yml up -d
```

**Production Mode:**
```powershell
cd "E:\Source Code\school-library-system"
docker-compose up -d
```

---

## Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017 (user: admin, pass: admin123)

---

## Common Commands

```powershell
# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down

# Restart backend only
docker-compose -f docker-compose.dev.yml restart backend

# Check running containers
docker-compose ps

# Remove everything and start fresh
docker-compose down -v
docker-compose -f docker-compose.dev.yml up -d --build
```

---

## Environment Files

| File | Purpose |
|------|---------|
| `.env.development` | Used by Docker development mode |
| `.env.production` | Used by Docker production mode |
| `.env.example` | Template for manual setup |

**All pre-configured!** Just run `.\start.ps1` and go!

---

## Need More Help?

- **Environment Setup**: See `ENVIRONMENT_SETUP.md`
- **Docker Details**: See `DOCKER_GUIDE.md`
- **API Documentation**: See `backend/API_DOCUMENTATION.md`
- **General Info**: See `README.md`

---

## Project Structure Summary

```
school-library-system/
├── .env.development        ← Docker dev config (your email is here)
├── .env.production         ← Docker prod config (update before deploy)
├── .env.example            ← Template
├── start.ps1              ← Run this to start!
├── docker-compose.dev.yml ← Dev orchestration
├── docker-compose.yml     ← Prod orchestration
├── backend/               ← Node.js API
└── frontend/              ← Vue.js app
```

---

## First Time Setup

1. **Open PowerShell** in the project directory
2. **Run**: `.\start.ps1`
3. **Choose**: Option 1 (Development)
4. **Wait**: ~2-3 minutes for first build
5. **Open browser**: http://localhost:3000
6. **Done!** 🎉

Your email is already configured in `.env.development`

---

## Troubleshooting

**Port already in use?**
```powershell
# Find what's using the port
netstat -ano | findstr :3000
# Kill it
taskkill /PID <process_id> /F
```

**Services won't start?**
```powershell
# Check Docker is running
docker ps

# View error logs
docker-compose -f docker-compose.dev.yml logs
```

**Start fresh:**
```powershell
docker-compose down -v
docker-compose -f docker-compose.dev.yml up -d --build
```

---

**That's it! Happy coding! 🚀**
