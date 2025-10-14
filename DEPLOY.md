# 🚀 Vercel Deployment Hızlı Başlangıç

## Adım Adım Deploy

### 1️⃣ GitHub'a Yükle

```powershell
# Git repository'si yoksa oluştur
git init
git add .
git commit -m "Initial commit - Marvel Code Sharing Platform"
git branch -M main

# GitHub'da yeni repo oluştur, sonra:
git remote add origin https://github.com/yourusername/marvel.git
git push -u origin main
```

### 2️⃣ Vercel'e Deploy

1. [vercel.com/new](https://vercel.com/new) adresine git
2. GitHub repository'ni import et
3. Framework: **Next.js** (otomatik seçilir)
4. Root Directory: `./` (default)
5. **Deploy'a tıklama - önce environment variables ekle!**

### 3️⃣ Environment Variables Ekle

**Vercel Dashboard → Settings → Environment Variables**

Tüm bu değişkenleri ekle (değerleri `.env` dosyandan kopyala):

```bash
# Database
DATABASE_URL=mongodb+srv://...

# NextAuth (ÖNEMLİ: URL'i değiştir!)
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your-new-secret-here

# Discord OAuth
DISCORD_CLIENT_ID=1012431910057816124
DISCORD_CLIENT_SECRET=Adu834w0FmabsMMfAfB2sg-eoyNp_vO8
DISCORD_BOT_TOKEN=MTAxMjQzMTkxMDA1NzgxNjEyNA...

# Discord Server
DISCORD_SERVER_ID=1144627662749454346
DISCORD_REQUIRED_ROLE_ID=1144627662778802230
DISCORD_SERVER_INVITE=https://discord.gg/YMftCmb3w6

# Category Roles
ALTYAPI_ROLE_ID=1144627662778802226
PYTHON_ROLE_ID=
ADVANCED_BDFD_ROLE_ID=
ADVANCED_AOIJS_ROLE_ID=
ADVANCED_JS_ROLE_ID=
ADVANCED_PYTHON_ROLE_ID=
```

**Her değişken için:**
- Name: Değişken adı (örn: `DATABASE_URL`)
- Value: Değişken değeri
- Environments: **Hepsini seç** (Production, Preview, Development)

### 4️⃣ Discord OAuth Ayarları

1. [Discord Developer Portal](https://discord.com/developers/applications) → Uygulamanı seç
2. OAuth2 → Redirects
3. **Yeni URL ekle:**
   ```
   https://your-project.vercel.app/api/auth/callback/discord
   ```
4. Save Changes

### 5️⃣ Deploy Et!

1. Vercel'e dön
2. **Deploy** butonuna tıkla
3. Build loglarını izle (~2-3 dakika)
4. ✅ Deploy tamamlandı!

## ⚠️ Yaygın Hatalar ve Çözümler

### Hata: "Cron job limit exceeded"
**Çözüm:** `vercel.json` düzeltildi, cron job kaldırıldı. Yeniden deploy et.

### Hata: "Prisma Client not generated"
**Çözüm:** 
- `package.json`'da `postinstall` script'i var mı kontrol et
- Var, sorun yok. Vercel otomatik çalıştırır.

### Hata: "NEXTAUTH_URL is not defined"
**Çözüm:** Environment variables'ı kontrol et, `NEXTAUTH_URL` eklenmiş mi?

### Hata: "redirect_uri_mismatch" (Discord)
**Çözüm:** Discord Developer Portal'da redirect URL'i ekle:
```
https://your-actual-domain.vercel.app/api/auth/callback/discord
```

### Hata: "Database connection failed"
**Çözüm:** 
- `DATABASE_URL` doğru mu kontrol et
- MongoDB Atlas'ta IP whitelist'e `0.0.0.0/0` ekle (tüm IP'ler)

## 📋 Deploy Sonrası Kontrol Listesi

- [ ] Site açılıyor
- [ ] Discord ile giriş çalışıyor
- [ ] Kategoriler görünüyor
- [ ] Post oluşturma çalışıyor
- [ ] Profil sayfası açılıyor
- [ ] Bottom navigation çalışıyor
- [ ] Yetkili kadrosu sayfası açılıyor
- [ ] Rol kontrolü çalışıyor

## 🔄 Güncelleme (Sonraki Deploylar)

Her `git push` otomatik deploy yapar:

```powershell
git add .
git commit -m "Update: yeni özellik"
git push
```

Vercel otomatik olarak:
1. Yeni commit'i algılar
2. Build eder
3. Deploy eder
4. Production'a yayınlar

## 🎯 Production URL

Deploy sonrası URL'in:
```
https://your-project-name.vercel.app
```

Bu URL'i:
1. `NEXTAUTH_URL` environment variable'ına ekle
2. Discord OAuth redirect URL'ine ekle
3. Discord sunucunda paylaş! 🚀

## 📊 Monitoring

- **Logs:** Vercel Dashboard → Deployments → View Function Logs
- **Analytics:** Vercel Dashboard → Analytics
- **Performance:** Vercel Dashboard → Speed Insights

## 🆘 Sorun mu var?

1. Vercel Dashboard → Deployments → Latest → View Build Logs
2. Hatayı oku
3. Environment variables kontrol et
4. Yeniden deploy et

---

**🎉 Başarılar! Site artık canlıda!**
