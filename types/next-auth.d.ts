import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      discordId?: string | null
      username?: string | null
      discriminator?: string | null
      isInServer?: boolean
      hasPostPermission?: boolean
    } & DefaultSession["user"]
  }

  interface User {
    discordId?: string | null
    username?: string | null
    discriminator?: string | null
  }
}
