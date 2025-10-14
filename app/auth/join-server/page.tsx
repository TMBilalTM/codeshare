import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function JoinServer() {
  const serverInvite = process.env.DISCORD_SERVER_INVITE || "https://discord.gg/gqCSn6Y7rU";

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">Sunucuya Katılın</CardTitle>
          <CardDescription>
            İçerikleri görüntülemek için Discord sunucumuza katılmanız gerekiyor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm">
              Marvel platformunu kullanabilmek için Discord sunucumuzun bir üyesi olmanız gerekmektedir.
            </p>
            <p className="text-sm">
              Sunucumuza katıldıktan sonra bu sayfayı yenileyin.
            </p>
          </div>
          
          <Button asChild className="w-full" size="lg">
            <a href={serverInvite} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              Discord Sunucusuna Katıl
            </a>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link href="/">
              Ana Sayfaya Dön
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
