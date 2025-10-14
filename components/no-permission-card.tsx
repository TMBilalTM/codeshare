import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, Info } from "lucide-react";
import Link from "next/link";

interface NoPermissionProps {
  categoryName: string;
  requiredRole?: string;
  requiredRoleId?: string;
  roleColor?: string;
  isAdvanced?: boolean;
}

export function NoPermissionCard({ categoryName, requiredRole, requiredRoleId, roleColor, isAdvanced }: NoPermissionProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Button */}
        <Button asChild variant="ghost">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Ana Sayfaya Dön
          </Link>
        </Button>

        {/* Permission Denied Card */}
        <Card className="border-destructive/50">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-destructive/10 p-4">
                <Shield className="h-12 w-12 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl">Erişim Yetkisi Gerekli</CardTitle>
            <CardDescription className="text-base">
              {isAdvanced ? "Gelişmiş" : ""} <strong>{categoryName}</strong> kategorisine erişim yetkiniz bulunmamaktadır
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Bu kategoriye erişim için:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>Discord sunucumuzda aktif üye olmanız</li>
                    {requiredRole && requiredRoleId && (
                      <li>
                        <strong 
                          className="font-semibold"
                          style={{ color: roleColor || 'hsl(var(--primary))' }}
                        >
                          @{requiredRole}
                        </strong> rolüne sahip olmanız gerekiyor
                      </li>
                    )}
                    {isAdvanced && (
                      <li>İleri seviye kategoriler için özel yetkilendirme gerekmektedir</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Rol almak için Discord sunucumuza katılın ve yetkililere ulaşın
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1">
                  <a
                    href="https://discord.gg/gqCSn6Y7rU"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Discord Sunucusuna Katıl
                  </a>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/">
                    Ana Sayfaya Dön
                  </Link>
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-center text-muted-foreground">
                Rolünüz olduğunu düşünüyorsanız, çıkış yapıp tekrar giriş yaparak oturumunuzu yenileyin
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Other Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Erişebileceğiniz Kategoriler</CardTitle>
            <CardDescription>
              Aşağıdaki kategorilere göz atabilirsiniz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button asChild variant="outline" className="h-auto py-3">
                <Link href="/category/bdfd">BDFD</Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-3">
                <Link href="/category/aoijs">AOI.JS</Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-3">
                <Link href="/category/js">JavaScript</Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-3">
                <Link href="/category/python">Python</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
