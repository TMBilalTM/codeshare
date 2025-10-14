# Marvel - PM2 Kullanım Rehberi

## 🚀 PM2 ile Development Modunda Çalıştırma

### 1. PM2'yi Global Olarak Yükle
```bash
npm install -g pm2
```

### 2. Development Modunda Başlat
```bash
pm2 start ecosystem.config.js --only marvel-dev
```

### 3. Production Modunda Başlat (VDS'de)
```bash
# Önce build alın
npm run build

# Sonra başlatın
pm2 start ecosystem.config.js --only marvel-prod
```

## 📊 PM2 Komutları

### Başlatma & Durdurma
```bash
# Development başlat
pm2 start marvel-dev

# Production başlat
pm2 start marvel-prod

# Her ikisini birden başlat
pm2 start ecosystem.config.js

# Durdur
pm2 stop marvel-dev
pm2 stop marvel-prod
pm2 stop all

# Yeniden başlat
pm2 restart marvel-dev
pm2 restart marvel-prod
pm2 restart all

# Sil
pm2 delete marvel-dev
pm2 delete marvel-prod
pm2 delete all
```

### Monitoring & Logs
```bash
# Tüm uygulamaları listele
pm2 list

# Detaylı bilgi
pm2 show marvel-dev

# Real-time monitoring
pm2 monit

# Logları görüntüle
pm2 logs marvel-dev
pm2 logs marvel-dev --lines 100

# Logları temizle
pm2 flush
```

### Sistem Başlangıcına Ekleme (VDS için)
```bash
# Startup script oluştur
pm2 startup

# Mevcut durumu kaydet
pm2 save
```

## 🎯 Kullanım Senaryoları

### Senaryo 1: Local Development (Sürekli Aktif)
```bash
# PM2 ile başlat
pm2 start ecosystem.config.js --only marvel-dev

# Çalıştığını kontrol et
pm2 list

# Logları izle
pm2 logs marvel-dev
```

### Senaryo 2: VDS Production
```bash
# Build al
npm run build

# PM2 ile başlat
pm2 start ecosystem.config.js --only marvel-prod

# Sistem başlangıcına ekle
pm2 startup
pm2 save

# Monitoring
pm2 monit
```

### Senaryo 3: Kod Güncellemesi
```bash
# Uygulamayı durdur
pm2 stop marvel-dev

# Kodu güncelle
git pull

# Bağımlılıkları güncelle (gerekirse)
npm install

# Yeniden başlat
pm2 restart marvel-dev
```

## 🔄 Normal vs PM2

### Normal Çalıştırma (Kapanır)
```bash
npm run dev
# Terminal kapatınca veya Ctrl+C ile durur
```

### PM2 ile Çalıştırma (Sürekli Aktif)
```bash
pm2 start ecosystem.config.js --only marvel-dev
# Terminal kapanınca da çalışmaya devam eder
# Bilgisayar yeniden başlasa bile otomatik başlar (pm2 save ile)
```

## ⚡ Hızlı Başlangıç

```bash
# 1. PM2 yükle (bir kere)
npm install -g pm2

# 2. Development başlat
pm2 start ecosystem.config.js --only marvel-dev

# 3. Logları izle
pm2 logs marvel-dev

# 4. Durdurmak için
pm2 stop marvel-dev
```

## 🎨 PM2 Dashboard (Opsiyonel)
```bash
# PM2 Plus'a kaydol (ücretsiz)
pm2 link [public-key] [secret-key]

# Web üzerinden monitoring
# https://app.pm2.io
```

## 📝 Notlar

- **Development**: `npm run dev` yerine PM2 kullanın
- **Production**: Build aldıktan sonra `marvel-prod` kullanın
- **Logs**: `logs/` klasöründe saklanır
- **Auto Restart**: Crash olursa otomatik yeniden başlar
- **Memory Limit**: 1GB'a ulaşınca otomatik restart

---

**İyi Çalışmalar! 🚀**
