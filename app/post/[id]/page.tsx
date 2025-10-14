import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { ArrowLeft, Calendar, User, Eye } from "lucide-react";
import Image from "next/image";
import { CodeBlock } from "@/components/code-block";
import { LikeButton } from "@/components/like-button";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  // Kullanıcı kontrolü
  if (!session) {
    redirect("/auth/signin");
  }

  if (!session.user?.isInServer) {
    redirect("/auth/join-server");
  }

  // Post getir
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          name: true,
          image: true,
          username: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  // Görüntülenme sayısını artır (async olarak, sayfa yüklenmesini engellemesin)
  // @ts-ignore - Prisma types will be correct at runtime
  const currentViews = post.views || 0;
  prisma.post.update({
    where: { id },
    data: {
      // @ts-ignore
      views: currentViews + 1,
    },
  }).catch(err => console.error("Error updating views:", err));

  // Kullanıcının bu postu beğenip beğenmediğini kontrol et
  // @ts-ignore - Prisma types will be correct at runtime
  const userLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: session.user.id!,
        postId: id,
      },
    },
  });

  const categoryMap: Record<string, string> = {
    BDFD: "bdfd",
    AOIJS: "aoijs",
    JS: "js",
    PYTHON: "python",
    ALTYAPI: "altyapi",
    BDFD_PLUS: "bdfd-plus",
    AOIJS_PLUS: "aoijs-plus",
    JS_PLUS: "js-plus",
    PYTHON_PLUS: "python-plus",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Button asChild variant="ghost">
        <Link href={`/category/${categoryMap[post.category]}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Geri Dön
        </Link>
      </Button>

      {/* Post Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl">{post.title}</CardTitle>
              <CardDescription className="text-base">
                {post.description}
              </CardDescription>
            </div>
            <span className="inline-flex items-center rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {post.category}
            </span>
          </div>

          {/* Author & Date Info */}
          <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              {(post as any).author?.image && (
                <Image
                  src={(post as any).author.image}
                  alt={(post as any).author.name || "Author"}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              <User className="h-4 w-4" />
              <span>{(post as any).author?.name || (post as any).author?.username}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                  locale: tr,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{((post as any).views || 0) + 1} görüntülenme</span>
            </div>
          </div>

          {/* Like Button */}
          <div className="pt-4 border-t">
            <LikeButton
              postId={post.id}
              initialLikeCount={(post as any)._count?.likes || 0}
              initialIsLiked={!!userLike}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Code Block */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Kod</h3>
            <CodeBlock code={post.code} category={post.category} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
