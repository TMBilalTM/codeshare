"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";

interface CreatePostFormProps {
  allowedCategories: string[];
  initialCategory?: string;
}

const categoryLabels: Record<string, string> = {
  BDFD: "BDFD",
  AOIJS: "AOI.JS",
  JS: "JavaScript",
  PYTHON: "Python",
  ALTYAPI: "Altyapı",
  BDFD_PLUS: "BDFD+ (Gelişmiş)",
  AOIJS_PLUS: "AOI.JS+ (Gelişmiş)",
  JS_PLUS: "JavaScript+ (Gelişmiş)",
  PYTHON_PLUS: "Python+ (Gelişmiş)",
};

export function CreatePostForm({ allowedCategories, initialCategory }: CreatePostFormProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    code: "",
    category: initialCategory || allowedCategories[0] || "BDFD",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Bir hata oluştu");
      }

      const post = await response.json();
      router.push(`/post/${post.id}`);
    } catch (error) {
      console.error("Error creating post:", error);
      alert(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Button asChild variant="ghost">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Geri Dön
        </Link>
      </Button>

      {/* Create Form */}
      <Card>
        <CardHeader>
          <CardTitle>Yeni Kod Paylaş</CardTitle>
          <CardDescription>
            Kodunuzu veya altyapınızı topluluğumuzla paylaşın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                {allowedCategories.map((cat) => (
                  <option key={cat} value={cat} className="bg-background text-foreground">
                    {categoryLabels[cat] || cat}
                  </option>
                ))}
              </select>
              <p className="text-sm text-muted-foreground">
                Sadece yetkiniz olan kategoriler gösterilmektedir
              </p>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                placeholder="Kodunuza açıklayıcı bir başlık verin"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                placeholder="Kodunuz hakkında detaylı açıklama yapın"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                required
              />
            </div>

            {/* Code */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="code">Kod</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Önizlemeyi Gizle
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Önizleme
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                id="code"
                placeholder="Kodunuzu buraya yapıştırın"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                rows={15}
                className="font-mono text-sm"
                required
              />
            </div>

            {/* Live Preview */}
            {showPreview && formData.code && (
              <div className="space-y-2">
                <Label>Önizleme</Label>
                <CodeBlock code={formData.code} category={formData.category} />
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Paylaşılıyor..." : "Paylaş"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
