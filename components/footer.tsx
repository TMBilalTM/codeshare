import Link from "next/link";
import { Code2, Github, MessageCircle, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t mt-auto hidden md:block">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Code2 className="h-6 w-6 text-primary" />
              <span>Marvel</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Discord tabanlı modern kod ve altyapı paylaşım platformu.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Kategoriler</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/category/bdfd" className="hover:text-primary transition-colors">
                  BDFD Kodları
                </Link>
              </li>
              <li>
                <Link href="/category/aoijs" className="hover:text-primary transition-colors">
                  AOI.JS Kodları
                </Link>
              </li>
              <li>
                <Link href="/category/js" className="hover:text-primary transition-colors">
                  JavaScript Kodları
                </Link>
              </li>
              <li>
                <Link href="/category/altyapi" className="hover:text-primary transition-colors">
                  Altyapılar
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="font-semibold">Topluluk</h3>
            <div className="flex gap-4">
              <a
                href="https://discord.gg/gqCSn6Y7rU"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/channel/UCyW-FjtuKpIpi1vA18DmrxA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Discord sunucumuza katılarak topluluğa dahil olun!
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Marvel. Tüm hakları saklıdır | Developed by BilalTM.</p>
        </div>
      </div>
    </footer>
  );
}
