import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { BarChart3, Code2, Eye, Heart, Calendar, Shield } from "lucide-react";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function ProfilePage({ params }: PageProps) {
  const { userId } = await params;
  const session = await auth();

  // Kullanıcı bilgilerini getir
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        include: {
          likes: true,
        },
        orderBy: { createdAt: "desc" },
      },
      likes: {
        include: {
          post: {
            include: {
              author: true,
              likes: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!user) {
    notFound();
  }

  // İstatistikleri hesapla
  const totalPosts = user.posts.length;
  const totalViews = user.posts.reduce((sum, post) => sum + post.views, 0);
  const totalLikes = user.posts.reduce((sum, post) => sum + post.likes.length, 0);
  const mostPopularPost = user.posts.sort((a, b) => b.likes.length - a.likes.length)[0];

  // Kullanıcının Discord sunucusunda olup olmadığını kontrol et
  const isInServer = (session?.user as any)?.isInServer;
  const hasPostPermission = (session?.user as any)?.hasPostPermission;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Profil Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {user.image && (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={120}
                height={120}
                className="rounded-full"
              />
            )}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                {hasPostPermission && userId === session?.user?.id && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Kod Paylaşımcı
                  </Badge>
                )}
              </div>
              {user.username && (
                <p className="text-muted-foreground">@{user.username}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Katılım: {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true, locale: tr })}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* İstatistikler veya Aktiviteler */}
      <Tabs defaultValue={hasPostPermission && userId === session?.user?.id ? "stats" : "activity"} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">
            {hasPostPermission && userId === session?.user?.id ? "İstatistikler" : "Paylaşımlar"}
          </TabsTrigger>
          <TabsTrigger value="activity">
            {hasPostPermission && userId === session?.user?.id ? "Paylaşımlar" : "Beğeniler"}
          </TabsTrigger>
        </TabsList>

        {/* İstatistikler Tab */}
        <TabsContent value="stats" className="space-y-6">
          {hasPostPermission && userId === session?.user?.id ? (
            <>
              {/* Kod Paylaşımcı İstatistikleri */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Code2 className="h-4 w-4" />
                      Toplam Paylaşım
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalPosts}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Toplam Görüntülenme
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalViews}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Toplam Beğeni
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalLikes}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Ortalama Beğeni
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {totalPosts > 0 ? (totalLikes / totalPosts).toFixed(1) : "0"}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* En Popüler Kod */}
              {mostPopularPost && (
                <Card>
                  <CardHeader>
                    <CardTitle>🏆 En Popüler Kodunuz</CardTitle>
                    <CardDescription>
                      {mostPopularPost.likes.length} beğeni • {mostPopularPost.views} görüntülenme
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Link href={`/post/${mostPopularPost.id}`}>
                      <h3 className="text-xl font-semibold hover:text-primary transition-colors">
                        {mostPopularPost.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground">{mostPopularPost.description}</p>
                    <Badge variant="secondary">{mostPopularPost.category}</Badge>
                    <div className="max-h-48 overflow-hidden">
                      <CodeBlock code={mostPopularPost.code} category={mostPopularPost.category} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            // Normal kullanıcı paylaşımları
            <div className="space-y-4">
              {user.posts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Henüz paylaşım yapılmamış.
                  </CardContent>
                </Card>
              ) : (
                user.posts.map((post) => (
                  <Card key={post.id} className="hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <Link href={`/post/${post.id}`}>
                            <CardTitle className="hover:text-primary transition-colors">
                              {post.title}
                            </CardTitle>
                          </Link>
                          <CardDescription>{post.description}</CardDescription>
                        </div>
                        <Badge variant="secondary">{post.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="max-h-48 overflow-hidden">
                        <CodeBlock code={post.code} category={post.category} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.likes.length}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views}
                        </span>
                        <span>
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: tr })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>

        {/* Aktivite/Paylaşımlar Tab */}
        <TabsContent value="activity" className="space-y-4">
          {hasPostPermission && userId === session?.user?.id ? (
            // Kod paylaşımcının tüm paylaşımları
            <div className="space-y-4">
              {user.posts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Henüz paylaşım yapılmamış.
                  </CardContent>
                </Card>
              ) : (
                user.posts.map((post) => (
                  <Card key={post.id} className="hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <Link href={`/post/${post.id}`}>
                            <CardTitle className="hover:text-primary transition-colors">
                              {post.title}
                            </CardTitle>
                          </Link>
                          <CardDescription>{post.description}</CardDescription>
                        </div>
                        <Badge variant="secondary">{post.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="max-h-48 overflow-hidden">
                        <CodeBlock code={post.code} category={post.category} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.likes.length}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views}
                        </span>
                        <span>
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: tr })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            // Normal kullanıcının beğendiği kodlar
            <div className="space-y-4">
              {user.likes.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Henüz beğenilen kod yok.
                  </CardContent>
                </Card>
              ) : (
                user.likes.map((like) => (
                  <Card key={like.id} className="hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <Link href={`/post/${like.post.id}`}>
                            <CardTitle className="hover:text-primary transition-colors">
                              {like.post.title}
                            </CardTitle>
                          </Link>
                          <CardDescription>{like.post.description}</CardDescription>
                          <div className="flex items-center gap-2 pt-2">
                            {like.post.author.image && (
                              <Image
                                src={like.post.author.image}
                                alt={like.post.author.name || "User"}
                                width={20}
                                height={20}
                                className="rounded-full"
                              />
                            )}
                            <span className="text-sm text-muted-foreground">
                              {like.post.author.name}
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary">{like.post.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="max-h-48 overflow-hidden">
                        <CodeBlock code={like.post.code} category={like.post.category} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          {like.post.likes.length}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {like.post.views}
                        </span>
                        <span>
                          Beğenildi: {formatDistanceToNow(new Date(like.createdAt), { addSuffix: true, locale: tr })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
