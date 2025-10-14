import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Database, FileCode, Layers, MessageCircle, Youtube, Zap, Shield } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  const categories = [
    {
      name: "BDFD",
      description: "Bot Designer for Discord kodlarını paylaş ve keşfet",
      icon: Code2,
      href: "/category/bdfd",
      color: "text-blue-500",
    },
    {
      name: "AOI.JS",
      description: "AOI.JS bot kodlarını topluluğunla paylaş",
      icon: FileCode,
      href: "/category/aoijs",
      color: "text-green-500",
    },
    {
      name: "JavaScript",
      description: "JavaScript kod parçacıklarını ve çözümlerini paylaş",
      icon: Layers,
      href: "/category/js",
      color: "text-yellow-500",
    },
    {
      name: "Python",
      description: "Python kodlarını ve Discord bot projelerini paylaş",
      icon: Code2,
      href: "/category/python",
      color: "text-cyan-500",
    },
    {
      name: "Altyapı",
      description: "Bot altyapılarını ve projelerini paylaş",
      icon: Database,
      href: "/category/altyapi",
      color: "text-purple-500",
    },
  ];

  const advancedCategories = [
    {
      name: "BDFD+",
      description: "İleri seviye BDFD kodları ve optimizasyonlar",
      icon: Zap,
      href: "/category/bdfd-plus",
      color: "text-blue-600",
    },
    {
      name: "AOI.JS+",
      description: "Gelişmiş AOI.JS teknikleri ve custom functions",
      icon: Zap,
      href: "/category/aoijs-plus",
      color: "text-green-600",
    },
    {
      name: "JavaScript+",
      description: "Advanced JavaScript patterns ve best practices",
      icon: Zap,
      href: "/category/js-plus",
      color: "text-yellow-600",
    },
    {
      name: "Python+",
      description: "İleri seviye Python ve Discord.py örnekleri",
      icon: Zap,
      href: "/category/python-plus",
      color: "text-cyan-600",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Marvel Kod Paylaşım
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discord tabanlı modern kod ve altyapı paylaşım platformu. 
          Topluluğumuzla kodlarını paylaş, öğren ve geliş!
        </p>
        {!session && (
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signin">
                Discord ile Giriş Yap
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/category/bdfd">
                Kodları Keşfet
              </Link>
            </Button>
          </div>
        )}
      </section>

      {/* Categories Grid */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Kategoriler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="hover:shadow-lg transition-shadow h-full hover:border-primary/50">
                <CardHeader>
                  <category.icon className={`h-12 w-12 ${category.color} mb-2`} />
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Advanced Categories Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            Gelişmiş Kategoriler
          </h2>
          <p className="text-muted-foreground">
            İleri seviye kodlar ve teknikler için özel yetkili kategoriler
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advancedCategories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="hover:shadow-lg transition-shadow h-full hover:border-primary/50 bg-gradient-to-br from-background to-primary/5">
                <CardHeader>
                  <category.icon className={`h-12 w-12 ${category.color} mb-2`} />
                  <CardTitle className="flex items-center gap-2">
                    {category.name}
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Özel
                    </span>
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-6 py-12">
        <h2 className="text-3xl font-bold text-center">Özellikler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>🔒 Güvenli Giriş</CardTitle>
              <CardDescription>
                Discord OAuth ile güvenli ve hızlı giriş yapın
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>👥 Topluluk Odaklı</CardTitle>
              <CardDescription>
                Discord sunucumuz üyelerine özel içerikler
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>⚡ Modern Tasarım</CardTitle>
              <CardDescription>
                Hızlı, responsive ve kullanıcı dostu arayüz
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Community Section */}
      <section className="space-y-6 py-12">
        <h2 className="text-3xl font-bold text-center">Topluluğumuza Katıl</h2>
        <div className="flex flex-col items-center gap-6">
          <p className="text-center text-muted-foreground max-w-2xl">
            Discord sunucumuzda binlerce geliştirici ile tanış, 
            YouTube kanalımızdan eğitim videolarını takip et!
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://discord.gg/gqCSn6Y7rU"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Discord Sunucusu
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://www.youtube.com/channel/UCyW-FjtuKpIpi1vA18DmrxA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Youtube className="h-5 w-5" />
                YouTube Kanalı
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/team" className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Yetkili Kadrosu
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
