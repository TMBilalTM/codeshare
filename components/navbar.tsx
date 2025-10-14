"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Code2, Menu, X, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const navLinks = [
    { href: "/category/bdfd", label: "BDFD" },
    { href: "/category/aoijs", label: "AOI.JS" },
    { href: "/category/js", label: "JavaScript" },
    { href: "/category/python", label: "Python" },
    { href: "/category/altyapi", label: "Altyapı" },
    { href: "/team", label: "Yetkili Kadrosu" },
  ];

  const advancedLinks = [
    { href: "/category/bdfd-plus", label: "BDFD+" },
    { href: "/category/aoijs-plus", label: "AOI.JS+" },
    { href: "/category/js-plus", label: "JavaScript+" },
    { href: "/category/python-plus", label: "Python+" },
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Code2 className="h-6 w-6 text-primary" />
            <span>Marvel</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || 
                (link.href !== "/" && pathname?.startsWith(link.href));
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-3 py-2 text-sm font-medium transition-all duration-300
                    ${isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  {link.label}
                  {isActive && (
                    <span className="navbar-active-indicator absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
            
            {/* Advanced Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
                  Gelişmiş Kodlar
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Gelişmiş Kategoriler</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {advancedLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href} className="cursor-pointer">
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <>
                {session.user?.hasPostPermission && (
                  <Button asChild variant="default">
                    <Link href="/post/create">Kod Paylaş</Link>
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                      {session.user?.image && (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      )}
                      <span className="text-sm font-medium">{session.user?.name}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/profile/${session.user?.id}`} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profilim
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Ayarlar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Çıkış Yap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild>
                <Link href="/auth/signin">Discord ile Giriş</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 border-t max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Ana Kategoriler */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase px-2">Ana Kategoriler</p>
              {navLinks.map((link) => {
                const isActive = pathname === link.href || 
                  (link.href !== "/" && pathname?.startsWith(link.href));
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      block text-sm font-medium transition-colors px-2 py-1.5 rounded
                      ${isActive 
                        ? 'text-primary bg-primary/10 font-semibold' 
                        : 'hover:text-primary hover:bg-muted'
                      }
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            
            {/* Gelişmiş Kategoriler */}
            <div className="space-y-2 pt-2 border-t">
              <p className="text-xs font-semibold text-muted-foreground uppercase px-2">Gelişmiş Kategoriler</p>
              {advancedLinks.map((link) => {
                const isActive = pathname === link.href;
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      block text-sm font-medium transition-colors px-2 py-1.5 rounded
                      ${isActive 
                        ? 'text-primary bg-primary/10 font-semibold' 
                        : 'hover:text-primary hover:bg-muted'
                      }
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            
            <div className="pt-4 border-t space-y-2">
              {session ? (
                <>
                  <div className="flex items-center gap-3 pb-2 px-2">
                    {session.user?.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium">{session.user?.name}</span>
                  </div>
                  <Link href={`/profile/${session.user?.id}`} onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      <User className="mr-2 h-4 w-4" />
                      Profilim
                    </Button>
                  </Link>
                  {session.user?.hasPostPermission && (
                    <Link href="/post/create" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Kod Paylaş</Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    className="w-full text-red-600"
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Çıkış Yap
                  </Button>
                </>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/auth/signin">Discord ile Giriş</Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
