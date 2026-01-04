# School Library Management System - Quick Start Script
# This script helps you get started with the project

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "School Library Management System - Setup" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker not found!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Check if docker-compose is available
try {
    $composeVersion = docker-compose --version
    Write-Host "✓ Docker Compose found: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker Compose not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Choose Setup Mode:" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "1. Development Mode (with hot reload)" -ForegroundColor White
Write-Host "2. Production Mode" -ForegroundColor White
Write-Host "3. Stop All Services" -ForegroundColor White
Write-Host "4. View Logs" -ForegroundColor White
Write-Host "5. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Starting Development Environment..." -ForegroundColor Yellow
        Write-Host ""
        
        # Check if .env.development exists
        if (Test-Path ".env.development") {
            Write-Host "✓ .env.development found" -ForegroundColor Green
        } else {
            Write-Host "✗ .env.development not found!" -ForegroundColor Red
            exit 1
        }
        
        Write-Host ""
        Write-Host "Building and starting containers..." -ForegroundColor Yellow
        docker-compose -f docker-compose.dev.yml up -d --build
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✓ Services started successfully!" -ForegroundColor Green
            Write-Host ""
            Write-Host "=============================================" -ForegroundColor Cyan
            Write-Host "Access Your Application:" -ForegroundColor Cyan
            Write-Host "=============================================" -ForegroundColor Cyan
            Write-Host "Frontend:  http://localhost:3000" -ForegroundColor White
            Write-Host "Backend:   http://localhost:5000" -ForegroundColor White
            Write-Host "API Docs:  http://localhost:5000/api/health" -ForegroundColor White
            Write-Host ""
            Write-Host "View logs with: docker-compose -f docker-compose.dev.yml logs -f" -ForegroundColor Yellow
            Write-Host "Stop services with: docker-compose -f docker-compose.dev.yml down" -ForegroundColor Yellow
        } else {
            Write-Host ""
            Write-Host "✗ Failed to start services. Check the logs above." -ForegroundColor Red
        }
    }
    
    "2" {
        Write-Host ""
        Write-Host "Starting Production Environment..." -ForegroundColor Yellow
        Write-Host ""
        
        # Check if .env.production exists
        if (Test-Path ".env.production") {
            Write-Host "✓ .env.production found" -ForegroundColor Green
            
            # Warn about production settings
            Write-Host ""
            Write-Host "⚠️  IMPORTANT PRODUCTION CHECKLIST:" -ForegroundColor Red
            Write-Host "   - Updated JWT_SECRET with strong random string?" -ForegroundColor Yellow
            Write-Host "   - Updated MongoDB password?" -ForegroundColor Yellow
            Write-Host "   - Updated CLIENT_URL with production domain?" -ForegroundColor Yellow
            Write-Host "   - Updated SMS API credentials?" -ForegroundColor Yellow
            Write-Host ""
            
            $confirm = Read-Host "Have you reviewed .env.production? (yes/no)"
            
            if ($confirm -eq "yes") {
                Write-Host ""
                Write-Host "Building and starting containers..." -ForegroundColor Yellow
                docker-compose up -d --build
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Host ""
                    Write-Host "✓ Services started successfully!" -ForegroundColor Green
                    Write-Host ""
                    Write-Host "View logs with: docker-compose logs -f" -ForegroundColor Yellow
                    Write-Host "Stop services with: docker-compose down" -ForegroundColor Yellow
                } else {
                    Write-Host ""
                    Write-Host "✗ Failed to start services. Check the logs above." -ForegroundColor Red
                }
            } else {
                Write-Host ""
                Write-Host "Please review .env.production first!" -ForegroundColor Yellow
                Write-Host "Edit with: notepad .env.production" -ForegroundColor White
            }
        } else {
            Write-Host "✗ .env.production not found!" -ForegroundColor Red
            exit 1
        }
    }
    
    "3" {
        Write-Host ""
        Write-Host "Stopping all services..." -ForegroundColor Yellow
        Write-Host ""
        
        docker-compose -f docker-compose.dev.yml down 2>$null
        docker-compose down 2>$null
        
        Write-Host "✓ All services stopped" -ForegroundColor Green
    }
    
    "4" {
        Write-Host ""
        Write-Host "Choose logs to view:" -ForegroundColor Cyan
        Write-Host "1. Development logs" -ForegroundColor White
        Write-Host "2. Production logs" -ForegroundColor White
        Write-Host ""
        
        $logChoice = Read-Host "Enter your choice (1-2)"
        
        Write-Host ""
        Write-Host "Press Ctrl+C to stop viewing logs" -ForegroundColor Yellow
        Write-Host ""
        
        if ($logChoice -eq "1") {
            docker-compose -f docker-compose.dev.yml logs -f
        } elseif ($logChoice -eq "2") {
            docker-compose logs -f
        }
    }
    
    "5" {
        Write-Host ""
        Write-Host "Goodbye!" -ForegroundColor Cyan
        exit 0
    }
    
    default {
        Write-Host ""
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Useful Commands:" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "View running containers:  docker-compose ps" -ForegroundColor White
Write-Host "Restart backend:          docker-compose restart backend" -ForegroundColor White
Write-Host "View backend logs:        docker-compose logs -f backend" -ForegroundColor White
Write-Host "Access MongoDB:           docker-compose exec mongodb mongosh -u admin -p admin123" -ForegroundColor White
Write-Host "Stop everything:          docker-compose down" -ForegroundColor White
Write-Host ""
Write-Host "For more help, see ENVIRONMENT_SETUP.md or DOCKER_GUIDE.md" -ForegroundColor Yellow
Write-Host ""
