# Vercel Deployment Rehberi

## 🚀 Vercel'e Deploy Adımları

### 1. Projeyi GitHub'a Yükle

```bash
git init
git add .
git commit -m "Initial commit - Marvel Code Sharing Platform"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Vercel'de Proje Oluştur

1. [Vercel](https://vercel.com) hesabınızla giriş yapın
2. "Add New" → "Project" tıklayın
3. GitHub reponuzu seçin
4. Framework Preset: **Next.js** otomatik seçilecek

### 3. Environment Variables (Çevre Değişkenleri)

Vercel dashboard'da aşağıdaki değişkenleri ekleyin:

#### Database
```
DATABASE_URL=mongodb+srv://aabilal476_db_user:lOpwnnSSIZQnEJaj@bilaltm.lr50pgv.mongodb.net/marvel?retryWrites=true&w=majority&appName=BilalTM
```

#### NextAuth
```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=very-secure-and-long-secret-key
```

> ⚠️ **ÖNEMLİ**: Production için yeni bir güçlü secret oluşturun:
> ```bash
> openssl rand -base64 32
> ```

#### Discord OAuth
```
DISCORD_CLIENT_ID=1012431910057816124
DISCORD_CLIENT_SECRET=Adu834w0FmabsMMfAfB2sg-eoyNp_vO8
DISCORD_BOT_TOKEN=MTAxMjQzMTkxMDA1NzgxNjEyNA.GW6phV.LAeMHd59RxZ5PzOblr45ZTjFEnMWGNZO3zddA8
```

#### Discord Server
```
DISCORD_SERVER_ID=1144627662749454346
DISCORD_REQUIRED_ROLE_ID=1144627662778802230
DISCORD_SERVER_INVITE=https://discord.gg/YMftCmb3w6
```

#### Category Roles
```
ALTYAPI_ROLE_ID=1144627662778802226
PYTHON_ROLE_ID=
ADVANCED_BDFD_ROLE_ID=
ADVANCED_AOIJS_ROLE_ID=
ADVANCED_JS_ROLE_ID=
ADVANCED_PYTHON_ROLE_ID=
```

### 4. Discord OAuth Redirect URL Güncelle

Discord Developer Portal'da OAuth2 ayarlarına gidin ve redirect URL'i ekleyin:

```
https://your-domain.vercel.app/api/auth/callback/discord
```

### 5. Build & Deploy

- Vercel otomatik olarak build edip deploy edecek
- Build süresi: ~2-3 dakika
- Deploy tamamlandığında domain URL'i gösterilecek

## 🔧 Build Ayarları

### package.json Scripts

Vercel otomatik olarak şu komutu çalıştırır:

```json
{
  "scripts": {
    "build": "next build",
    "postinstall": "prisma generate"
  }
}
```

### Prisma Ayarları

`prisma/schema.prisma` dosyasında:

```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-1.0.x"]
}
```

## 📊 Deploy Sonrası Kontroller

### ✅ Kontrol Listesi

- [ ] Ana sayfa açılıyor mu?
- [ ] Discord ile giriş çalışıyor mu?
- [ ] Sunucu üyelik kontrolü çalışıyor mu?
- [ ] Kategoriler açılıyor mu?
- [ ] Post oluşturma çalışıyor mu?
- [ ] Profil sayfaları çalışıyor mu?
- [ ] Beğeni sistemi çalışıyor mu?
- [ ] Yetkili kadrosu sayfası açılıyor mu?
- [ ] Rol bazlı izinler çalışıyor mu?
- [ ] Bottom navigation mobilde çalışıyor mu?

## 🐛 Hata Ayıklama

### Vercel Logs

```bash
# Vercel CLI kurulumu
npm i -g vercel

# Production logs
vercel logs your-deployment-url --follow
```

### Yaygın Hatalar

#### 1. Prisma Client Hatası
```
Error: @prisma/client did not initialize yet
```

**Çözüm**: 
- `postinstall` script'i `package.json`'da var mı kontrol edin
- Vercel dashboard'da yeniden deploy edin

#### 2. Environment Variables Hatası
```
Error: Missing required environment variables
```

**Çözüm**: 
- Vercel dashboard → Settings → Environment Variables
- Tüm değişkenlerin doğru girildiğinden emin olun
- Redeploy yapın

#### 3. Discord OAuth Hatası
```
redirect_uri_mismatch
```

**Çözüm**:
- Discord Developer Portal'da redirect URL'i kontrol edin
- Tam URL: `https://your-domain.vercel.app/api/auth/callback/discord`

## 🔄 Otomatik Deployment

Her `git push` sonrası Vercel otomatik deploy yapar:

- **main** branch → Production
- **develop** branch → Preview
- **Pull Request** → Preview

## 📈 Performans Optimizasyonu

### 1. Image Optimization

Next.js Image component otomatik optimize eder:
```tsx
<Image src="..." alt="..." width={100} height={100} />
```

### 2. ISR (Incremental Static Regeneration)

Kategori sayfaları için:
```tsx
export const revalidate = 60; // 60 saniyede bir revalidate
```

### 3. Edge Runtime

API routes için:
```tsx
export const runtime = 'edge'; // Edge'de çalıştır
```

## 🔐 Güvenlik

### Production Checklist

- [ ] `NEXTAUTH_SECRET` güçlü ve unique
- [ ] Discord bot token güvenli
- [ ] MongoDB şifresi güçlü
- [ ] `.env` dosyası `.gitignore`'da
- [ ] Environment variables Vercel'de
- [ ] HTTPS kullanılıyor (Vercel otomatik)
- [ ] CORS ayarları doğru

## 📱 Custom Domain (Opsiyonel)

1. Vercel Dashboard → Settings → Domains
2. Domain'inizi ekleyin
3. DNS ayarlarını yapın:
   ```
   A Record: 76.76.21.21
   CNAME: cname.vercel-dns.com
   ```

## 🎉 Deploy Tamamlandı!

Site URL'iniz: `https://your-project-name.vercel.app`

### Sonraki Adımlar

1. Discord OAuth redirect URL'ini güncelleyin
2. `NEXTAUTH_URL` environment variable'ını doğru URL ile güncelleyin
3. Tüm fonksiyonları test edin
4. Discord sunucunuzda duyurun! 🚀

## 🆘 Destek

Sorun yaşarsanız:
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
