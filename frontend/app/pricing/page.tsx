import Link from "next/link";
import { Check } from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const plans = [
  { name: "Starter", price: "R$ 29", items: ["5 analises ATS", "2 exportacoes", "Chat basico"] },
  { name: "Pro", price: "R$ 79", items: ["Analises ilimitadas", "Matching com vagas", "Exportacao PDF/DOCX", "Chat contextual"] },
  { name: "Teams", price: "Sob consulta", items: ["Usuarios em equipe", "Relatorios", "Suporte prioritario"] }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="mx-auto max-w-7xl px-5 pt-28">
        <h1 className="text-4xl font-bold">Planos para acelerar sua proxima vaga</h1>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className="p-6">
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="mt-4 text-3xl font-black">{plan.price}</p>
              <ul className="mt-6 grid gap-3">
                {plan.items.map((item) => <li key={item} className="flex gap-2 text-sm text-foreground/70"><Check className="text-primary" size={18} /> {item}</li>)}
              </ul>
              <Link href="/register"><Button className="mt-8 w-full">Comecar</Button></Link>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
