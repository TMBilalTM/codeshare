# Marvel - VDS Deployment Rehberi

## 🖥️ VDS Gereksinimleri

- **OS**: Ubuntu 20.04 veya üzeri
- **RAM**: Minimum 1GB (2GB önerilir)
- **CPU**: 1 Core minimum
- **Node.js**: 18.x veya üzeri
- **PM2**: Process manager

---

## 📦 VDS Kurulum Adımları

### 1. VDS'ye Bağlan
```bash
ssh root@your-vds-ip
```

### 2. Sistem Güncellemesi
```bash
apt update && apt upgrade -y
```

### 3. Node.js Kurulumu
```bash
# NodeSource repository ekle
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# Node.js ve npm kur
apt install -y nodejs

# Versiyonu kontrol et
node -v
npm -v
```

### 4. PM2 Kurulumu (Process Manager)
```bash
npm install -g pm2
```

### 5. Git Kurulumu (Yoksa)
```bash
apt install -y git
```

---

## 🚀 Proje Deployment

### 1. Projeyi Klonla
```bash
# Home dizinine git
cd ~

# Projeyi klonla (GitHub'a push ettiyseniz)
git clone https://github.com/kullanici-adi/marvel.git

# Proje dizinine git
cd marvel
```

### 2. Bağımlılıkları Yükle
```bash
npm install
```

### 3. Environment Variables Ayarla
```bash
# .env dosyası oluştur
nano .env
```

Aşağıdaki içeriği yapıştır:
```env
# Database (MongoDB Atlas)
DATABASE_URL="mongodb+srv://aabilal476_db_user:lOpwnnSSIZQnEJaj@bilaltm.lr50pgv.mongodb.net/marvel?retryWrites=true&w=majority&appName=BilalTM"

# NextAuth
NEXTAUTH_URL="http://your-vds-ip:3000"
NEXTAUTH_SECRET="very-secure-and-long-secret-key"

# Discord OAuth
DISCORD_CLIENT_ID="1012431910057816124"
DISCORD_CLIENT_SECRET="Adu834w0FmabsMMfAfB2sg-eoyNp_vO8"
DISCORD_BOT_TOKEN="MTAxMjQzMTkxMDA1NzgxNjEyNA.GW6phV.LAeMHd59RxZ5PzOblr45ZTjFEnMWGNZO3zddA8"

# Discord Server Configuration
DISCORD_SERVER_ID="1144627662749454346"
DISCORD_REQUIRED_ROLE_ID="1144627662778802230"
DISCORD_SERVER_INVITE="https://discord.gg/YMftCmb3w6"
```

**Ctrl+X** → **Y** → **Enter** ile kaydet

### 4. Prisma Veritabanı Push
```bash
npx prisma generate
npx prisma db push
```

### 5. Projeyi Build Et
```bash
npm run build
```

---

## 🔄 PM2 ile Uygulamayı Çalıştır

### 1. PM2 Ecosystem Dosyası Oluştur
```bash
nano ecosystem.config.js
```

Aşağıdaki içeriği yapıştır:
```javascript
module.exports = {
  apps: [{
    name: 'marvel',
    script: 'npm',
    args: 'start',
    cwd: '/root/marvel',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

### 2. PM2 ile Başlat
```bash
# Uygulamayı başlat
pm2 start ecosystem.config.js

# Uygulamayı listele
pm2 list

# Logları görüntüle
pm2 logs marvel

# Detaylı bilgi
pm2 show marvel
```

### 3. PM2'yi Sistem Başlangıcında Çalıştır
```bash
# Startup script oluştur
pm2 startup

# Mevcut işlemleri kaydet
pm2 save
```

---

## 🛡️ Firewall Ayarları

### UFW ile Port Açma
```bash
# UFW kur (yoksa)
apt install -y ufw

# SSH portunu aç (KESİNLİKLE ÖNCE BUNU YAP!)
ufw allow 22/tcp

# HTTP/HTTPS portlarını aç
ufw allow 80/tcp
ufw allow 443/tcp

# Next.js portunu aç (geçici, Nginx kurulana kadar)
ufw allow 3000/tcp

# Firewall'u aktifleştir
ufw enable

# Durumu kontrol et
ufw status
```

---

## 🌐 Nginx ile Reverse Proxy (Önerilen)

### 1. Nginx Kurulumu
```bash
apt install -y nginx
```

### 2. Nginx Konfigürasyonu
```bash
nano /etc/nginx/sites-available/marvel
```

Aşağıdaki içeriği yapıştır:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Nginx'i Aktifleştir
```bash
# Sembolik link oluştur
ln -s /etc/nginx/sites-available/marvel /etc/nginx/sites-enabled/

# Nginx konfigürasyonunu test et
nginx -t

# Nginx'i yeniden başlat
systemctl restart nginx

# Nginx'i otomatik başlat
systemctl enable nginx
```

### 4. SSL Sertifikası (Let's Encrypt)
```bash
# Certbot kur
apt install -y certbot python3-certbot-nginx

# SSL sertifikası al
certbot --nginx -d your-domain.com -d www.your-domain.com

# Otomatik yenileme test et
certbot renew --dry-run
```

---

## 📊 PM2 Komutları

```bash
# Uygulamayı başlat
pm2 start marvel

# Uygulamayı durdur
pm2 stop marvel

# Uygulamayı yeniden başlat
pm2 restart marvel

# Uygulamayı sil
pm2 delete marvel

# Logları görüntüle
pm2 logs marvel

# Logları temizle
pm2 flush

# Monitoring
pm2 monit

# Liste
pm2 list

# Durumu kaydet
pm2 save
```

---

## 🔄 Güncelleme Süreci

```bash
# Proje dizinine git
cd ~/marvel

# Git'ten çek
git pull origin main

# Bağımlılıkları güncelle
npm install

# Yeniden build et
npm run build

# Prisma güncellemesi (gerekirse)
npx prisma generate
npx prisma db push

# PM2'yi yeniden başlat
pm2 restart marvel
```

---

## 🔧 Discord OAuth Redirect URL Güncelleme

Discord Developer Portal'da redirect URL'i güncelleyin:
```
http://your-domain.com/api/auth/callback/discord
```

veya IP kullanıyorsanız:
```
http://your-vds-ip:3000/api/auth/callback/discord
```

---

## 📝 Sistem Monitöring

### 1. PM2 Web Dashboard
```bash
# PM2 Plus'a kayıt ol (ücretsiz)
pm2 link [secret_key] [public_key]
```

### 2. Sistem Kaynakları
```bash
# RAM kullanımı
free -h

# Disk kullanımı
df -h

# CPU kullanımı
htop
```

---

## ⚠️ Sorun Giderme

### Uygulama Çalışmıyor
```bash
# Logları kontrol et
pm2 logs marvel --lines 100

# Hata ayıklama
pm2 restart marvel --update-env
```

### Port Zaten Kullanımda
```bash
# 3000 portunu kullanan işlemi bul
lsof -i :3000

# İşlemi öldür
kill -9 [PID]
```

### MongoDB Bağlantı Hatası
- `.env` dosyasındaki `DATABASE_URL` kontrol edin
- MongoDB Atlas IP whitelist kontrol edin (0.0.0.0/0)

---

## 🎯 Performans Optimizasyonu

### 1. Gzip Compression (Nginx)
```bash
nano /etc/nginx/nginx.conf
```

Ekleyin:
```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
```

### 2. PM2 Cluster Mode (Çoklu Core)
```bash
pm2 start ecosystem.config.js -i max
```

---

## 🔒 Güvenlik

### 1. SSH Port Değiştir
```bash
nano /etc/ssh/sshd_config
# Port 22 → Port 2222
systemctl restart sshd
```

### 2. Fail2Ban Kur
```bash
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

---

## ✅ Checklist

- [ ] VDS'ye bağlan
- [ ] Node.js, PM2, Git kur
- [ ] Projeyi klonla
- [ ] .env dosyası oluştur
- [ ] Bağımlılıkları yükle
- [ ] Build al
- [ ] PM2 ile çalıştır
- [ ] Firewall ayarla
- [ ] Nginx kur ve yapılandır
- [ ] SSL sertifikası al
- [ ] Discord OAuth URL güncelle
- [ ] Test et

---

**Başarılar! 🚀**
