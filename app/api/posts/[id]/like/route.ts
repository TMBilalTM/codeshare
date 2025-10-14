import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// POST - Beğeni ekle/kaldır (toggle)
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Beğenmek için giriş yapmalısınız" },
        { status: 401 }
      );
    }

    const { id: postId } = await context.params;

    // Post var mı kontrol et
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post bulunamadı" }, { status: 404 });
    }

    // Kullanıcı daha önce beğenmiş mi kontrol et
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId,
        },
      },
    });

    if (existingLike) {
      // Beğeniyi kaldır
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      return NextResponse.json({ liked: false, message: "Beğeni kaldırıldı" });
    } else {
      // Beğeni ekle
      await prisma.like.create({
        data: {
          userId: session.user.id,
          postId: postId,
        },
      });

      return NextResponse.json({ liked: true, message: "Beğenildi" });
    }
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}

// GET - Beğeni sayısını ve kullanıcının beğenip beğenmediğini getir
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    const { id: postId } = await context.params;

    // Post var mı kontrol et
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        likes: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post bulunamadı" }, { status: 404 });
    }

    // Kullanıcının beğenip beğenmediğini kontrol et
    let isLikedByUser = false;
    if (session?.user?.id) {
      const userLike = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId: postId,
          },
        },
      });
      isLikedByUser = !!userLike;
    }

    return NextResponse.json({
      likeCount: post.likes.length,
      isLikedByUser,
    });
  } catch (error) {
    console.error("Get likes error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
