import { auth, checkCategoryPermission, getDiscordRoleInfo } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NoPermissionCard } from "@/components/no-permission-card";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import NextImage from "next/image";

const categoryMap = {
  bdfd: "BDFD",
  aoijs: "AOIJS",
  js: "JS",
  python: "PYTHON",
  altyapi: "ALTYAPI",
  "bdfd-plus": "BDFD_PLUS",
  "aoijs-plus": "AOIJS_PLUS",
  "js-plus": "JS_PLUS",
  "python-plus": "PYTHON_PLUS",
} as const;

const categoryNames = {
  BDFD: "BDFD",
  AOIJS: "AOI.JS",
  JS: "JavaScript",
  PYTHON: "Python",
  ALTYAPI: "Altyapı",
  BDFD_PLUS: "BDFD+",
  AOIJS_PLUS: "AOI.JS+",
  JS_PLUS: "JavaScript+",
  PYTHON_PLUS: "Python+",
} as const;

const categoryRoleNames = {
  ALTYAPI: "Altyapı Geliştiricisi",
  PYTHON: "Python Geliştiricisi",
  BDFD_PLUS: "İleri Seviye BDFD",
  AOIJS_PLUS: "İleri Seviye AOI.JS",
  JS_PLUS: "İleri Seviye JavaScript",
  PYTHON_PLUS: "İleri Seviye Python",
} as const;

const categoryRoleIds = {
  ALTYAPI: process.env.ALTYAPI_ROLE_ID,
  PYTHON: process.env.PYTHON_ROLE_ID,
  BDFD_PLUS: process.env.ADVANCED_BDFD_ROLE_ID,
  AOIJS_PLUS: process.env.ADVANCED_AOIJS_ROLE_ID,
  JS_PLUS: process.env.ADVANCED_JS_ROLE_ID,
  PYTHON_PLUS: process.env.ADVANCED_PYTHON_ROLE_ID,
} as const;

export async function generateStaticParams() {
  return [
    { category: "bdfd" },
    { category: "aoijs" },
    { category: "js" },
    { category: "python" },
    { category: "altyapi" },
    { category: "bdfd-plus" },
    { category: "aoijs-plus" },
    { category: "js-plus" },
    { category: "python-plus" },
  ];
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const session = await auth();

  // Kategori kontrolü
  if (!categoryMap[category as keyof typeof categoryMap]) {
    redirect("/");
  }

  // Kullanıcı giriş yapmamışsa veya sunucuda değilse yönlendir
  if (!session) {
    redirect("/auth/signin");
  }

  if (!session.user?.isInServer) {
    redirect("/auth/join-server");
  }

  const dbCategory = categoryMap[category as keyof typeof categoryMap];

  // Kategori yetki kontrolü (görüntüleme için)
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { discordId: true },
  });

  if (dbUser?.discordId) {
    const hasPermission = await checkCategoryPermission(dbUser.discordId, dbCategory, "view");
    
    if (!hasPermission) {
      const isAdvanced = dbCategory.includes("_PLUS");
      const roleId = categoryRoleIds[dbCategory as keyof typeof categoryRoleIds];
      
      // Discord'dan gerçek rol bilgilerini çek
      let roleName: string = categoryRoleNames[dbCategory as keyof typeof categoryRoleNames];
      let roleColor: string | undefined;
      
      if (roleId) {
        const roleInfo = await getDiscordRoleInfo(roleId);
        if (roleInfo) {
          roleName = roleInfo.name;
          roleColor = roleInfo.color;
        }
      }
      
      return (
        <NoPermissionCard
          categoryName={categoryNames[dbCategory as keyof typeof categoryNames]}
          requiredRole={roleName}
          requiredRoleId={roleId}
          roleColor={roleColor}
          isAdvanced={isAdvanced}
        />
      );
    }
  }

  // Postları getir
  const posts = await prisma.post.findMany({
    where: {
      category: dbCategory as any,
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">{categoryNames[dbCategory]} Kodları</h1>
          <p className="text-muted-foreground mt-2">
            Toplam {posts.length} kod paylaşılmış
          </p>
        </div>
        {session.user?.hasPostPermission && (
          <Button asChild>
            <Link href={`/post/create?category=${category}`}>Yeni Kod Paylaş</Link>
          </Button>
        )}
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Henüz kod paylaşılmamış</CardTitle>
            <CardDescription>
              Bu kategoride henüz hiç kod paylaşılmamış. İlk paylaşımı sen yap!
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`}>
              <Card className="h-full hover:shadow-xl transition-all hover:border-primary/50 hover:-translate-y-1 group">
                <CardHeader className="space-y-3">
                  {/* Author Info */}
                  <div className="flex items-center gap-3">
                    {(post as any).author?.image && (
                      <NextImage
                        src={(post as any).author.image}
                        alt={(post as any).author.name || "Author"}
                        width={40}
                        height={40}
                        className="rounded-full ring-2 ring-background"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {(post as any).author?.name || (post as any).author?.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                          locale: tr,
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {/* Title & Description */}
                  <div className="space-y-2">
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                {/* Code Preview */}
                <CardContent>
                  <div className="bg-muted/50 rounded-md p-3 border border-border">
                    <pre className="text-xs text-muted-foreground line-clamp-3 overflow-hidden">
                      <code>{post.code}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
