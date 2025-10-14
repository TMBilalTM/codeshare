# Marvel Code Sharing Platform - Vercel Deploy Script (PowerShell)

Write-Host "🚀 Marvel Code Sharing Platform - Vercel Deployment" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Git kontrol
Write-Host "📦 Step 1: Checking Git repository..." -ForegroundColor Yellow
if (-not (Test-Path .git)) {
    Write-Host "Initializing Git repository..." -ForegroundColor Gray
    git init
    git add .
    git commit -m "Initial commit - Marvel Code Sharing Platform"
    git branch -M main
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git repository already exists" -ForegroundColor Green
}

Write-Host ""

# Step 2: Prisma Client Generate
Write-Host "🔨 Step 2: Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
Write-Host "✅ Prisma Client generated" -ForegroundColor Green

Write-Host ""

# Step 3: Build Test
Write-Host "🏗️  Step 3: Testing production build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed. Please fix errors before deploying." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "✅ Pre-deployment checks complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Push to GitHub:"
Write-Host "   git remote add origin <your-github-repo-url>"
Write-Host "   git push -u origin main"
Write-Host ""
Write-Host "2. Go to https://vercel.com/new"
Write-Host "3. Import your GitHub repository"
Write-Host "4. Add environment variables (see VERCEL_DEPLOYMENT.md)"
Write-Host "5. Deploy! 🚀"
Write-Host ""
Write-Host "📖 Full guide: See VERCEL_DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
