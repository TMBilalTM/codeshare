# 🚀 Marvel - Kod & Altyapı Paylaşım Platformu

Modern, güvenli ve kullanıcı dostu Discord tabanlı kod paylaşım platformu. Next.js 15, TypeScript ve MongoDB Atlas ile geliştirilmiştir.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

## ✨ Özellikler

- 🔐 **Discord OAuth 2.0** - Güvenli ve hızlı giriş
- 👥 **Sunucu Doğrulama** - Sadece Discord sunucusu üyeleri içerikleri görebilir
- 🎭 **Rol Tabanlı Yetkilendirme** - Belirli rol sahipleri kod paylaşabilir
- 📝 **4 Kategori** - BDFD, AOI.JS, JavaScript ve Altyapı
- 🌙 **Dark Mode** - Modern ve göz yormayan tasarım
- 📱 **Responsive Design** - Her cihazda mükemmel görünüm
- ⚡ **Yüksek Performans** - Next.js 15 App Router

## 🛠️ Teknolojiler

- **Framework:** Next.js 15 (App Router)
- **Dil:** TypeScript
- **Veritabanı:** MongoDB Atlas
- **ORM:** Prisma
- **Kimlik Doğrulama:** NextAuth.js v5
- **Stil:** Tailwind CSS
- **UI Bileşenleri:** Shadcn UI
- **İkonlar:** Lucide React

## 📋 Gereksinimler

- Node.js 18+ 
- npm veya yarn
- MongoDB Atlas hesabı
- Discord Developer Application
- Discord Bot Token

## 🚀 Kurulum

### 1. Projeyi Klonlayın

\`\`\`bash
git clone <repository-url>
cd marvel
\`\`\`

### 2. Bağımlılıkları Yükleyin

\`\`\`bash
npm install
\`\`\`

### 3. MongoDB Atlas Kurulumu

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) hesabı oluşturun
2. Yeni bir cluster oluşturun (ücretsiz tier yeterli)
3. Database Access bölümünden bir kullanıcı oluşturun
4. Network Access bölümünden IP adresinizi ekleyin (0.0.0.0/0 - tüm IP'ler)
5. Connect butonuna tıklayıp connection string'i kopyalayın

### 4. Discord Uygulaması Oluşturma

1. [Discord Developer Portal](https://discord.com/developers/applications) adresine gidin
2. "New Application" butonuna tıklayın
3. **OAuth2** sekmesinden:
   - Client ID ve Client Secret'i kopyalayın
   - Redirect URLs: \`http://localhost:3000/api/auth/callback/discord\` ekleyin
4. **Bot** sekmesinden:
   - Bot oluşturun ve token'ı kopyalayın
   - "SERVER MEMBERS INTENT" ve "PRESENCE INTENT" açın
5. **OAuth2 > URL Generator**:
   - Scopes: \`bot\` ve \`applications.commands\`
   - Bot Permissions: \`Read Messages/View Channels\`
   - URL'i kopyalayıp botunuzu sunucunuza ekleyin

### 5. Environment Variables

\`.env\` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

\`\`\`env
# MongoDB Atlas Connection String
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/marvel?retryWrites=true&w=majority"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="openssl rand -base64 32 ile oluşturun"

# Discord OAuth
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
DISCORD_BOT_TOKEN="your-discord-bot-token"

# Discord Server Configuration
DISCORD_SERVER_ID="1310956663773270066"
DISCORD_REQUIRED_ROLE_ID="963381380371345508"
DISCORD_SERVER_INVITE="https://discord.gg/gqCSn6Y7rU"
\`\`\`

**NEXTAUTH_SECRET oluşturmak için:**
\`\`\`bash
openssl rand -base64 32
\`\`\`

### 6. Prisma ve Veritabanı

\`\`\`bash
# Prisma Client oluştur
npx prisma generate

# Veritabanını senkronize et (MongoDB için migration gerekmez)
npx prisma db push
\`\`\`

### 7. Geliştirme Sunucusunu Başlatın

\`\`\`bash
npm run dev
\`\`\`

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📁 Proje Yapısı

\`\`\`
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
├── types/
│   └── next-auth.d.ts
└── .env
\`\`\`

## 🔑 Önemli Notlar

### Discord Sunucu ID Bulma
1. Discord'da Developer Mode'u açın (Ayarlar > Gelişmiş > Geliştirici Modu)
2. Sunucuya sağ tıklayın ve "ID'yi Kopyala"

### Discord Rol ID Bulma
1. Sunucu Ayarları > Roller
2. Role sağ tıklayın ve "ID'yi Kopyala"

### Yetkilendirme Sistemi
- **Tüm Kullanıcılar:** Discord ile giriş yapabilir
- **Sunucu Üyeleri:** İçerikleri görüntüleyebilir
- **Belirli Rol Sahipleri:** Kod/altyapı paylaşabilir (DISCORD_REQUIRED_ROLE_ID)

## 🌐 Production Deployment

### Vercel Deployment

1. [Vercel](https://vercel.com) hesabınıza giriş yapın
2. Projenizi import edin
3. Environment Variables ekleyin
4. Deploy butonuna tıklayın

⚠️ **Önemli:** Production'da NEXTAUTH_URL'i gerçek domain'inize güncelleyin!

\`\`\`env
NEXTAUTH_URL="https://your-domain.vercel.app"
\`\`\`

Discord Developer Portal'dan redirect URL'inizi de güncelleyin:
\`\`\`
https://your-domain.vercel.app/api/auth/callback/discord
\`\`\`

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (\`git checkout -b feature/amazing-feature\`)
3. Değişikliklerinizi commit edin (\`git commit -m 'feat: Add amazing feature'\`)
4. Branch'inizi push edin (\`git push origin feature/amazing-feature\`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🆘 Destek

Herhangi bir sorunuz veya sorununuz mu var?

- Discord Sunucusu: [https://discord.gg/gqCSn6Y7rU](https://discord.gg/gqCSn6Y7rU)
- Issues: GitHub Issues bölümünü kullanın

## 🎯 Gelecek Özellikler

- [ ] Kod söz dizimi vurgulama
- [ ] Favorilere ekleme
- [ ] Yorum sistemi
- [ ] Arama ve filtreleme
- [ ] Kullanıcı profilleri
- [ ] Kod beğenme/rating sistemi
- [ ] Admin paneli

---

**Made with ❤️ by BilalTM**
