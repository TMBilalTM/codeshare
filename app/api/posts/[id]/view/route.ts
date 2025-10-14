import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// POST - Görüntülenme sayısını artır
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id: postId } = await context.params;

    // Post var mı kontrol et
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post bulunamadı" }, { status: 404 });
    }

    // Görüntülenme sayısını artır
    await prisma.post.update({
      where: { id: postId },
      data: {
        views: post.views + 1,
      },
    });

    return NextResponse.json({ success: true, views: post.views + 1 });
  } catch (error) {
    console.error("View increment error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
