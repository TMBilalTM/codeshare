import { auth, getUserAllowedCategories } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CreatePostForm } from "@/components/create-post-form";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function CreatePostPage({ searchParams }: PageProps) {
  const session = await auth();
  const params = await searchParams;

  // Kullanıcı kontrolü
  if (!session) {
    redirect("/auth/signin");
  }

  if (!session.user?.isInServer) {
    redirect("/auth/join-server");
  }

  if (!session.user?.hasPostPermission) {
    redirect("/?error=no-permission");
  }

  // Kullanıcının yetkili olduğu kategorileri getir
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { discordId: true },
  });

  if (!dbUser?.discordId) {
    redirect("/?error=no-discord-id");
  }

  const allowedCategories = await getUserAllowedCategories(dbUser.discordId);

  if (allowedCategories.length === 0) {
    redirect("/?error=no-categories");
  }

  // URL'den gelen kategoriyi map'le
  const categoryMap: Record<string, string> = {
    bdfd: "BDFD",
    aoijs: "AOIJS",
    js: "JS",
    python: "PYTHON",
    altyapi: "ALTYAPI",
    "bdfd-plus": "BDFD_PLUS",
    "aoijs-plus": "AOIJS_PLUS",
    "js-plus": "JS_PLUS",
    "python-plus": "PYTHON_PLUS",
  };

  const initialCategory = params.category
    ? categoryMap[params.category]
    : undefined;

  return (
    <CreatePostForm
      allowedCategories={allowedCategories}
      initialCategory={initialCategory}
    />
  );
}
