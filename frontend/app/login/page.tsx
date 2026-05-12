"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  async function onSubmit(formData: FormData) {
    setLoading(true);
    try {
      await login(String(formData.get("email")), String(formData.get("password")));
      router.push("/dashboard");
    } catch {
      toast.error("Nao foi possivel entrar");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="grid min-h-screen place-items-center bg-background p-5">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold">Entrar</h1>
        <form action={onSubmit} className="mt-6 grid gap-4">
          <Input name="email" type="email" placeholder="email@empresa.com" required />
          <Input name="password" type="password" placeholder="Senha" required />
          <Button disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
        </form>
        <p className="mt-4 text-sm text-foreground/60">Novo por aqui? <Link className="text-primary" href="/register">Criar conta</Link></p>
      </Card>
    </main>
  );
}
