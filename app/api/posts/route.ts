import { auth, checkCategoryPermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(1000),
  code: z.string().min(1),
  category: z.enum(["BDFD", "AOIJS", "JS", "PYTHON", "ALTYAPI", "BDFD_PLUS", "AOIJS_PLUS", "JS_PLUS", "PYTHON_PLUS"]),
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    // Kullanıcı kontrolü
    if (!session?.user) {
      return NextResponse.json(
        { message: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    // Sunucu üyeliği kontrolü
    if (!session.user.isInServer) {
      return NextResponse.json(
        { message: "Discord sunucusuna katılmanız gerekiyor" },
        { status: 403 }
      );
    }

    // Paylaşım yetkisi kontrolü
    if (!session.user.hasPostPermission) {
      return NextResponse.json(
        { message: "Kod paylaşım yetkiniz yok" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = postSchema.parse(body);

    // Kullanıcının Discord ID'sini al
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { discordId: true },
    });

    if (!dbUser?.discordId) {
      return NextResponse.json(
        { message: "Discord hesabı bulunamadı" },
        { status: 400 }
      );
    }

    // Kategori yetki kontrolü (paylaşım yetkisi)
    const hasPermission = await checkCategoryPermission(
      dbUser.discordId,
      validatedData.category,
      "post"
    );

    if (!hasPermission) {
      return NextResponse.json(
        { message: "Bu kategoriye paylaşım yapma yetkiniz yok" },
        { status: 403 }
      );
    }

    // Post oluştur
    const post = await prisma.post.create({
      data: {
        ...validatedData,
        authorId: session.user.id,
      } as any,
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Geçersiz veri", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const posts = await prisma.post.findMany({
      where: category ? { category: category as any } : undefined,
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
      take: 50,
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { message: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
