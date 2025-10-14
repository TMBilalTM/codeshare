"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Code2, Users, User, PlusCircle, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";

export function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showCategories, setShowCategories] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    // Sadece aşağı sürüklemesine izin ver
    if (diff > 0) {
      setDragOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // 100px'den fazla sürüklendiyse kapat
    if (dragOffset > 100) {
      setShowCategories(false);
    }
    
    // Reset
    setDragOffset(0);
  };

  // Sheet kapatıldığında drag offset'i sıfırla
  useEffect(() => {
    if (!showCategories) {
      setDragOffset(0);
      setIsDragging(false);
    }
  }, [showCategories]);

  // Auth sayfalarında bottom nav gösterme
  if (pathname?.startsWith('/auth')) {
    return null;
  }

  const categories = [
    { name: "BDFD", href: "/category/bdfd", color: "text-blue-500" },
    { name: "AOI.JS", href: "/category/aoijs", color: "text-green-500" },
    { name: "JavaScript", href: "/category/js", color: "text-yellow-500" },
    { name: "Python", href: "/category/python", color: "text-purple-500" },
    { name: "Altyapı", href: "/category/altyapi", color: "text-pink-500" },
  ];

  const advancedCategories = [
    { name: "BDFD+", href: "/category/bdfd-plus", color: "text-blue-400" },
    { name: "AOI.JS+", href: "/category/aoijs-plus", color: "text-green-400" },
    { name: "JavaScript+", href: "/category/js-plus", color: "text-yellow-400" },
    { name: "Python+", href: "/category/python-plus", color: "text-purple-400" },
  ];

  const navItems = [
    {
      label: "Ana Sayfa",
      href: "/",
      icon: Home,
    },
    {
      label: "Kategoriler",
      onClick: () => setShowCategories(true),
      icon: Code2,
      isButton: true,
    },
    ...(session?.user?.hasPostPermission
      ? [
          {
            label: "Paylaş",
            href: "/post/create",
            icon: PlusCircle,
            highlight: true,
          },
        ]
      : []),
    {
      label: "Kadro",
      href: "/team",
      icon: Users,
    },
    {
      label: session ? "Profil" : "Giriş",
      href: session ? `/profile/${session.user?.id}` : "/auth/signin",
      icon: User,
    },
  ];

  return (
    <>
      {/* Category Bottom Sheet */}
      {showCategories && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-[60] animate-in fade-in duration-200"
            onClick={() => setShowCategories(false)}
          />
          
          {/* Bottom Sheet */}
          <div 
            ref={sheetRef}
            className="md:hidden fixed bottom-0 left-0 right-0 z-[70] bg-background rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden pb-20 transition-transform"
            style={{
              transform: `translateY(${dragOffset}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Kategoriler</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCategories(false)}
                  className="rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Drag Indicator - Interactive */}
              <div 
                className="flex justify-center -mt-2 cursor-grab active:cursor-grabbing py-2"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="w-12 h-1 bg-muted-foreground/50 rounded-full" />
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[calc(80vh-120px)] -mx-6 px-6 space-y-6 pb-4">
                {/* Ana Kategoriler */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase">Ana Kategoriler</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((category) => (
                      <Link
                        key={category.href}
                        href={category.href}
                        onClick={() => setShowCategories(false)}
                        className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <Code2 className={cn("h-5 w-5", category.color)} />
                        <span className="font-medium">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Gelişmiş Kategoriler */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase">Gelişmiş Kategoriler</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {advancedCategories.map((category) => (
                      <Link
                        key={category.href}
                        href={category.href}
                        onClick={() => setShowCategories(false)}
                        className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 transition-all border border-primary/20"
                      >
                        <Code2 className={cn("h-5 w-5", category.color)} />
                        <span className="font-medium">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t shadow-lg pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = item.href && (pathname === item.href || 
            (item.href !== "/" && pathname?.startsWith(item.href)));
          const Icon = item.icon;

          if (item.isButton) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 flex-1 max-w-[80px]",
                  "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium truncate w-full text-center">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 flex-1 max-w-[80px]",
                isActive && !item.highlight && "text-primary bg-primary/10",
                !isActive && "text-muted-foreground hover:text-foreground",
                item.highlight && "text-primary scale-110"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  item.highlight && "h-6 w-6"
                )}
              />
              <span className="text-[10px] font-medium truncate w-full text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
    </>
  );
}
