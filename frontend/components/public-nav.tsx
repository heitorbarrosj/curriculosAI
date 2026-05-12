"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function PublicNav() {
  const { theme, setTheme } = useTheme();
  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b bg-background/75 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link href="/" className="text-lg font-bold">Curriculo IA</Link>
        <nav className="flex items-center gap-2">
          <Link href="/pricing" className="hidden px-3 text-sm text-foreground/70 hover:text-foreground sm:block">Pricing</Link>
          <button aria-label="Alternar tema" className="rounded-lg p-2 hover:bg-muted" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link href="/login"><Button variant="secondary">Entrar</Button></Link>
          <Link href="/register"><Button>Comecar</Button></Link>
        </nav>
      </div>
    </header>
  );
}
