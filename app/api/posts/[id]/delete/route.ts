import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    // Kullanıcı kontrolü
    if (!session?.user) {
      return NextResponse.json(
        { message: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    // Post'u bul
    const post = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Post bulunamadı" },
        { status: 404 }
      );
    }

    // Sadece post sahibi silebilir
    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { message: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      );
    }

    // Post'u sil (cascade ile like'lar da silinecek)
    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ 
      success: true,
      message: "Post başarıyla silindi" 
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { message: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
