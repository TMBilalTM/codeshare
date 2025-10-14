import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export default function SignIn() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Hoş Geldiniz</CardTitle>
          <CardDescription>
            Marvel&apos;a Discord hesabınızla giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            action={async () => {
              "use server";
              await signIn("discord", { redirectTo: "/" });
            }}
          >
            <Button type="submit" className="w-full" size="lg">
              <MessageCircle className="mr-2 h-5 w-5" />
              Discord ile Giriş Yap
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center">
            Giriş yaparak{" "}
            <a href="https://discord.gg/gqCSn6Y7rU" className="text-primary hover:underline">
              Discord sunucumuz
            </a>
            &apos;a katılmanız gerekmektedir.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
