import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import type { Adapter } from "next-auth/adapters"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify email guilds guilds.members.read",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "discord") {
        try {
          // Discord kullanıcı bilgilerini kaydet
          const existingUser = await prisma.user.findUnique({
            where: { id: user.id },
          })
          
          if (existingUser) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                discordId: profile?.id as string,
                username: profile?.username as string,
                discriminator: (profile as any)?.discriminator as string,
              },
            })
          }
        } catch (error) {
          console.error("Error updating user:", error)
        }
      }
      return true
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        
        // Kullanıcının Discord bilgilerini al
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            discordId: true,
            username: true,
            discriminator: true,
          },
        })
        
        if (dbUser) {
          session.user.discordId = dbUser.discordId
          session.user.username = dbUser.username
          session.user.discriminator = dbUser.discriminator
          
          // Discord sunucusunda olup olmadığını kontrol et
          if (dbUser.discordId) {
            session.user.isInServer = await checkServerMembership(dbUser.discordId)
            
            // Rol kontrolü
            if (session.user.isInServer) {
              session.user.hasPostPermission = await checkUserRole(dbUser.discordId)
            }
          }
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
})

async function checkServerMembership(discordId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${process.env.DISCORD_SERVER_ID}/members/${discordId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    )
    
    return response.ok
  } catch (error) {
    console.error("Error checking server membership:", error)
    return false
  }
}

async function checkUserRole(discordId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${process.env.DISCORD_SERVER_ID}/members/${discordId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    )
    
    if (!response.ok) return false
    
    const member = await response.json()
    return member.roles.includes(process.env.DISCORD_REQUIRED_ROLE_ID)
  } catch (error) {
    console.error("Error checking user role:", error)
    return false
  }
}

// Kategori bazlı rol kontrolü (görüntüleme ve post atma)
export async function checkCategoryPermission(
  discordId: string,
  category: string,
  action: "view" | "post" = "view"
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${process.env.DISCORD_SERVER_ID}/members/${discordId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    )
    
    if (!response.ok) return false
    
    const member = await response.json()
    const userRoles = member.roles as string[]
    
    // Temel kategoriler (BDFD, AOIJS, JS) - Sunucuya katılmış herkes görüntüleyebilir
    const publicViewCategories = ["BDFD", "AOIJS", "JS"]
    
    if (action === "view" && publicViewCategories.includes(category)) {
      // Sadece sunucu üyeliği yeterli
      return true
    }
    
    // Post atmak için genel post yetkisi gerekli
    if (action === "post") {
      if (!userRoles.includes(process.env.DISCORD_REQUIRED_ROLE_ID!)) {
        return false
      }
    }
    
    // Kategori özel rol kontrolü (post atma veya özel kategorilere görüntüleme)
    const categoryRoleMap: Record<string, string | undefined> = {
      ALTYAPI: process.env.ALTYAPI_ROLE_ID,
      PYTHON: process.env.PYTHON_ROLE_ID,
      BDFD_PLUS: process.env.ADVANCED_BDFD_ROLE_ID,
      AOIJS_PLUS: process.env.ADVANCED_AOIJS_ROLE_ID,
      JS_PLUS: process.env.ADVANCED_JS_ROLE_ID,
      PYTHON_PLUS: process.env.ADVANCED_PYTHON_ROLE_ID,
    }
    
    const requiredRoleId = categoryRoleMap[category]
    
    // Eğer kategori için özel rol yoksa veya boşsa, erişim kapalıdır
    if (!requiredRoleId || requiredRoleId === "") {
      return false
    }
    
    // Özel rol varsa, kullanıcının o role sahip olması gerekir
    return userRoles.includes(requiredRoleId)
  } catch (error) {
    console.error("Error checking category permission:", error)
    return false
  }
}

// Kullanıcının erişebileceği kategorileri getir
export async function getUserAllowedCategories(discordId: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${process.env.DISCORD_SERVER_ID}/members/${discordId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    )
    
    if (!response.ok) return []
    
    const member = await response.json()
    const userRoles = member.roles as string[]
    
    // Genel post yetkisi yoksa boş dizi döndür
    if (!userRoles.includes(process.env.DISCORD_REQUIRED_ROLE_ID!)) {
      return []
    }
    
    const allowedCategories: string[] = ["BDFD", "AOIJS", "JS"] // Temel kategoriler
    
    // Özel rol gerektiren kategorileri kontrol et
    if (!process.env.ALTYAPI_ROLE_ID || process.env.ALTYAPI_ROLE_ID === "" || userRoles.includes(process.env.ALTYAPI_ROLE_ID)) {
      allowedCategories.push("ALTYAPI")
    }
    
    if (!process.env.PYTHON_ROLE_ID || process.env.PYTHON_ROLE_ID === "" || userRoles.includes(process.env.PYTHON_ROLE_ID)) {
      allowedCategories.push("PYTHON")
    }
    
    if (!process.env.ADVANCED_BDFD_ROLE_ID || process.env.ADVANCED_BDFD_ROLE_ID === "" || userRoles.includes(process.env.ADVANCED_BDFD_ROLE_ID)) {
      allowedCategories.push("BDFD_PLUS")
    }
    
    if (!process.env.ADVANCED_AOIJS_ROLE_ID || process.env.ADVANCED_AOIJS_ROLE_ID === "" || userRoles.includes(process.env.ADVANCED_AOIJS_ROLE_ID)) {
      allowedCategories.push("AOIJS_PLUS")
    }
    
    if (!process.env.ADVANCED_JS_ROLE_ID || process.env.ADVANCED_JS_ROLE_ID === "" || userRoles.includes(process.env.ADVANCED_JS_ROLE_ID)) {
      allowedCategories.push("JS_PLUS")
    }
    
    if (!process.env.ADVANCED_PYTHON_ROLE_ID || process.env.ADVANCED_PYTHON_ROLE_ID === "" || userRoles.includes(process.env.ADVANCED_PYTHON_ROLE_ID)) {
      allowedCategories.push("PYTHON_PLUS")
    }
    
    return allowedCategories
  } catch (error) {
    console.error("Error getting user allowed categories:", error)
    return []
  }
}

// Discord'dan rol bilgilerini çek (isim ve renk)
export async function getDiscordRoleInfo(roleId: string): Promise<{ name: string; color: string } | null> {
  try {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${process.env.DISCORD_SERVER_ID}/roles`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    )
    
    if (!response.ok) return null
    
    const roles = await response.json()
    const role = roles.find((r: any) => r.id === roleId)
    
    if (!role) return null
    
    // Discord renk formatı decimal, hex'e çevirelim
    const colorHex = role.color ? `#${role.color.toString(16).padStart(6, '0')}` : '#99aab5'
    
    return {
      name: role.name,
      color: colorHex
    }
  } catch (error) {
    console.error("Error fetching role info:", error)
    return null
  }
}
