"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Briefcase, FileUp, LogOut, MessageSquare, SearchCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/upload", label: "Upload", icon: FileUp },
  { href: "/analysis", label: "Analise ATS", icon: SearchCheck },
  { href: "/matching", label: "Matching", icon: Briefcase },
  { href: "/improve", label: "Melhoria", icon: Sparkles },
  { href: "/chat", label: "Chat IA", icon: MessageSquare }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-card/70 p-4 backdrop-blur lg:block">
        <Link href="/dashboard" className="flex h-12 items-center text-xl font-bold">Curriculo IA</Link>
        <nav className="mt-8 grid gap-1">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground/70 transition hover:bg-muted hover:text-foreground", pathname === item.href && "bg-muted text-foreground")}>
              <item.icon size={18} /> {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-5 backdrop-blur">
          <div>
            <p className="text-sm text-foreground/60">Workspace</p>
            <h1 className="font-semibold">{user?.name ?? "Usuario"}</h1>
          </div>
          <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted" onClick={async () => { await logout(); router.push("/"); }}>
            <LogOut size={16} /> Sair
          </button>
        </header>
        <div className="mx-auto max-w-7xl p-5">{children}</div>
      </main>
    </div>
  );
}


