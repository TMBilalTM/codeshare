import { auth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Crown, Star, Award } from "lucide-react";
import { redirect } from "next/navigation";
import NextImage from "next/image";

interface TeamMember {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  roles: Array<{
    id: string;
    name: string;
    color: string;
    position: number;
  }>;
  topRole: {
    name: string;
    color: string;
  };
}

async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    // Discord sunucusundaki tüm üyeleri çek
    const membersResponse = await fetch(
      `https://discord.com/api/v10/guilds/${process.env.DISCORD_SERVER_ID}/members?limit=1000`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
        next: { revalidate: 300 }, // 5 dakika cache
      }
    );

    if (!membersResponse.ok) return [];

    const members = await membersResponse.json();

    // Sunucudaki tüm rolleri çek
    const rolesResponse = await fetch(
      `https://discord.com/api/v10/guilds/${process.env.DISCORD_SERVER_ID}/roles`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
        next: { revalidate: 300 },
      }
    );

    if (!rolesResponse.ok) return [];

    const allRoles = await rolesResponse.json();

    // Kod paylaşım yetkisi olan üyeleri filtrele
    const requiredRoleId = process.env.DISCORD_REQUIRED_ROLE_ID!;
    const teamMembers: TeamMember[] = [];

    for (const member of members) {
      // Botları filtrele
      if (member.user.bot) continue;
      
      if (!member.roles.includes(requiredRoleId)) continue;

      // Üyenin rollerini detaylı bilgileriyle al
      const memberRoles = member.roles
        .map((roleId: string) => {
          const role = allRoles.find((r: any) => r.id === roleId);
          if (!role) return null;
          return {
            id: role.id,
            name: role.name,
            color: role.color ? `#${role.color.toString(16).padStart(6, '0')}` : '#99aab5',
            position: role.position,
          };
        })
        .filter((r: any) => r !== null)
        .sort((a: any, b: any) => b.position - a.position); // En yüksek rol önce

      // En yüksek rolü bul
      const topRole = memberRoles[0] || {
        name: 'Üye',
        color: '#99aab5',
      };

      teamMembers.push({
        id: member.user.id,
        username: member.user.username,
        displayName: member.nick || member.user.global_name || member.user.username,
        avatar: member.user.avatar
          ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png?size=128`
          : `https://cdn.discordapp.com/embed/avatars/${parseInt(member.user.discriminator || '0') % 5}.png`,
        roles: memberRoles,
        topRole,
      });
    }

    // En yüksek role göre sırala
    teamMembers.sort((a, b) => {
      const aPosition = a.roles[0]?.position || 0;
      const bPosition = b.roles[0]?.position || 0;
      return bPosition - aPosition;
    });

    return teamMembers;
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}

function getRoleIcon(roleName: string) {
  const name = roleName.toLowerCase();
  if (name.includes('owner') || name.includes('sahip') || name.includes('kurucu')) {
    return <Crown className="h-4 w-4" />;
  }
  if (name.includes('admin') || name.includes('yönetici')) {
    return <Shield className="h-4 w-4" />;
  }
  if (name.includes('mod') || name.includes('moderatör')) {
    return <Star className="h-4 w-4" />;
  }
  return <Award className="h-4 w-4" />;
}

export default async function TeamPage() {
  const session = await auth();

  // Kullanıcı giriş yapmamışsa yönlendir
  if (!session) {
    redirect("/auth/signin");
  }

  if (!session.user?.isInServer) {
    redirect("/auth/join-server");
  }

  const teamMembers = await getTeamMembers();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold">Yetkili Kadrosu</h1>
            <p className="text-muted-foreground mt-2">
              Kod paylaşım yetkisine sahip topluluk üyeleri
            </p>
          </div>
          <div className="flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-muted-foreground">{teamMembers.length} Yetkili</span>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div 
                        className="rounded-full p-0.5"
                        style={{ 
                          backgroundColor: member.topRole.color !== '#99aab5' ? member.topRole.color : 'hsl(var(--border))' 
                        }}
                      >
                        <NextImage
                          src={member.avatar}
                          alt={member.displayName}
                          width={56}
                          height={56}
                          className="rounded-full"
                        />
                      </div>
                      {index < 3 && (
                        <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                          #{index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {member.displayName}
                      </CardTitle>
                      <CardDescription className="text-sm truncate">
                        @{member.username}
                      </CardDescription>
                    </div>
                  </div>
                </div>

                {/* Top Role Badge */}
                <div className="flex items-center gap-2">
                  {getRoleIcon(member.topRole.name)}
                  <Badge
                    variant="outline"
                    className="font-semibold text-xs"
                    style={{
                      borderColor: member.topRole.color !== '#99aab5' ? member.topRole.color : undefined,
                      color: member.topRole.color !== '#99aab5' ? member.topRole.color : undefined,
                    }}
                  >
                    {member.topRole.name}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                {/* Other Roles */}
                {member.roles.length > 1 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Diğer Yetkiler</p>
                    <div className="flex flex-wrap gap-1.5">
                      {member.roles.slice(1, 4).map((role) => (
                        <Badge
                          key={role.id}
                          variant="secondary"
                          className="text-xs"
                          style={{
                            backgroundColor: role.color !== '#99aab5' ? `${role.color}20` : undefined,
                            borderColor: role.color !== '#99aab5' ? role.color : undefined,
                            color: role.color !== '#99aab5' ? role.color : undefined,
                          }}
                        >
                          {role.name}
                        </Badge>
                      ))}
                      {member.roles.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{member.roles.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {teamMembers.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                Henüz yetkili kadro bilgisi yüklenemedi.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
