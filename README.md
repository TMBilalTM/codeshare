# 🚀 **Marvel**  
### _Discord Tabanlı Kod & Altyapı Paylaşım Platformu_

Modern, güvenli ve kullanıcı dostu bir **kod paylaşım platformu**.  
Next.js 15, TypeScript ve MongoDB Atlas altyapısıyla geliştirilmiştir.

---

## 🧩 **Teknoloji Rozetleri**

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

---

## ✨ **Öne Çıkan Özellikler**

- 🔐 **Discord OAuth 2.0** — Güvenli & hızlı kimlik doğrulama  
- 👥 **Sunucu Doğrulama** — Sadece Discord sunucu üyeleri erişebilir  
- 🧩 **Rol Tabanlı Yetkilendirme** — Belirli roller paylaşım yapabilir  
- 🗂️ **4 Kategori:** BDFD, AOI.JS, JavaScript, Altyapı  
- 🌙 **Dark Mode** — Modern, göz yormayan tema  
- 📱 **Tam Responsive** — Mobil, tablet, masaüstü uyumlu  
- ⚡ **Yüksek Performans** — App Router ile optimize edilmiş Next.js 15 yapısı  

---

## 🛠️ **Kullanılan Teknolojiler**

| Kategori | Teknoloji |
|-----------|------------|
| Framework | **Next.js 15 (App Router)** |
| Dil | **TypeScript** |
| Veritabanı | **MongoDB Atlas** |
| ORM | **Prisma** |
| Kimlik Doğrulama | **NextAuth.js v5** |
| Stil | **Tailwind CSS + Shadcn UI** |
| İkonlar | **Lucide React** |

---

## ⚙️ **Gereksinimler**

- Node.js 18+
- npm veya yarn
- MongoDB Atlas hesabı
- Discord Developer Application
- Discord Bot Token

---

## 🚀 **Kurulum Adımları**

### 1️⃣ Projeyi Klonlayın
```bash
git clone <repository-url>
cd marvel
```

### 2️⃣ Bağımlılıkları Yükleyin
```bash
npm install
```

### 3️⃣ MongoDB Atlas Bağlantısı
1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)’ta hesap oluşturun  
2. Yeni bir cluster oluşturun (Free Tier yeterli)  
3. Database kullanıcı ve IP erişimi tanımlayın  
4. Connection string’i kopyalayın  

### 4️⃣ Discord Uygulaması Oluşturun
1. [Discord Developer Portal](https://discord.com/developers/applications)’a gidin  
2. **New Application → OAuth2** sekmesine girin  
3. Redirect URL olarak ekleyin:  
   ```
   http://localhost:3000/api/auth/callback/discord
   ```
4. Bot oluşturun ve **SERVER MEMBERS INTENT** & **PRESENCE INTENT** aktif edin  
5. URL Generator’dan botu sunucunuza ekleyin  

### 5️⃣ `.env` Dosyası
Aşağıdaki değişkenleri `.env` dosyanıza ekleyin:

```env
# MongoDB Atlas
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/marvel"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="openssl rand -base64 32 ile oluşturun"

# Discord OAuth
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
DISCORD_BOT_TOKEN="your-discord-bot-token"

# Discord Server Settings
DISCORD_SERVER_ID="1310956663773270066"
DISCORD_REQUIRED_ROLE_ID="963381380371345508"
DISCORD_SERVER_INVITE="https://discord.gg/gqCSn6Y7rU"
```

💡 **NEXTAUTH_SECRET oluşturmak için:**
```bash
openssl rand -base64 32
```

### 6️⃣ Prisma Ayarları
```bash
npx prisma generate
npx prisma db push
```

### 7️⃣ Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
🖥️ Tarayıcıdan [http://localhost:3000](http://localhost:3000) adresini açın.

---

## 🧱 **Proje Klasör Yapısı**
```
marvel/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   └── posts/
│   ├── auth/
│   │   ├── signin/
│   │   ├── error/
│   │   └── join-server/
│   ├── category/[category]/
│   ├── post/
│   │   ├── [id]/
│   │   └── create/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── navbar.tsx
│   ├── footer.tsx
│   └── session-provider.tsx
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
└── types/
    └── next-auth.d.ts
```

---

## 🔑 **Yetkilendirme Sistemi**

| Kullanıcı Türü | Yetki |
|----------------|--------|
| Tüm Discord kullanıcıları | Giriş yapabilir |
| Sunucu üyeleri | İçerikleri görüntüleyebilir |
| Belirli rol sahipleri | Kod & altyapı paylaşabilir |

📘 **Rol ID & Sunucu ID öğrenmek için:**
- Developer Mode → Sağ tıklayın → “ID’yi Kopyala”

---

## 🌐 **Production (Vercel) Dağıtımı**

1. [Vercel](https://vercel.com)’de oturum açın  
2. Repo’yu import edin  
3. Environment Variables ekleyin  
4. Deploy butonuna tıklayın  

⚠️ **Önemli:**  
Production ortamında `NEXTAUTH_URL` ve Discord redirect URL’ini güncelleyin:
```env
NEXTAUTH_URL="https://your-domain.vercel.app"
```
Discord Redirect:
```
https://your-domain.vercel.app/api/auth/callback/discord
```

---

## 🤝 **Katkıda Bulunmak**

1. Repo’yu fork edin  
2. Branch açın (`git checkout -b feature/amazing-feature`)  
3. Değişiklikleri commit’leyin  
4. Push edin ve Pull Request açın  

---

## 📄 **Lisans**

Bu proje **MIT Lisansı** ile lisanslanmıştır.  
Dilediğiniz gibi kullanabilir, geliştirebilir ve paylaşabilirsiniz.

---

## 💬 **Destek & İletişim**

🐛 Hata veya öneri → GitHub **Issues** sekmesini kullanın  

---

## 🧠 **Yakında Gelecek Özellikler**

- [ ] Kod söz dizimi vurgulama  
- [ ] Favorilere ekleme  
- [ ] Yorum sistemi  
- [ ] Arama & filtreleme  
- [ ] Kullanıcı profilleri  
- [ ] Beğeni / rating sistemi  
- [ ] Admin paneli  

---

### 🖤 Made with passion by **BilalTM**
