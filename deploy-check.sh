#!/bin/bash

# Marvel Code Sharing Platform - Vercel Deploy Script

echo "🚀 Marvel Code Sharing Platform - Vercel Deployment"
echo "=================================================="
echo ""

# Step 1: Git kontrol
echo "📦 Step 1: Checking Git repository..."
if [ ! -d .git ]; then
    echo "Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Marvel Code Sharing Platform"
    git branch -M main
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""

# Step 2: Prisma Client Generate
echo "🔨 Step 2: Generating Prisma Client..."
npx prisma generate
echo "✅ Prisma Client generated"

echo ""

# Step 3: Build Test
echo "🏗️  Step 3: Testing production build..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo ""
echo "=================================================="
echo "✅ Pre-deployment checks complete!"
echo ""
echo "📝 Next steps:"
echo "1. Push to GitHub:"
echo "   git remote add origin <your-github-repo-url>"
echo "   git push -u origin main"
echo ""
echo "2. Go to https://vercel.com/new"
echo "3. Import your GitHub repository"
echo "4. Add environment variables (see VERCEL_DEPLOYMENT.md)"
echo "5. Deploy! 🚀"
echo ""
echo "📖 Full guide: See VERCEL_DEPLOYMENT.md"
echo "=================================================="
