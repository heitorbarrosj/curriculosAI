"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Brain, FileText, LineChart, MessageSquare } from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { Button } from "@/components/ui/button";

const features = [
  { icon: FileText, title: "Upload inteligente", text: "Extraia experiencias, skills, formacao e idiomas direto do PDF." },
  { icon: LineChart, title: "Score ATS", text: "Receba pontuacao objetiva, problemas e prioridades de melhoria." },
  { icon: Brain, title: "Matching com vaga", text: "Compare curriculo e descricao de vaga com embeddings e IA." },
  { icon: MessageSquare, title: "Chat de carreira", text: "Converse com um assistente contextual sobre entrevistas e skills." }
];

export default function HomePage() {
  return (
    <div className="mesh min-h-screen">
      <PublicNav />
      <main className="mx-auto max-w-7xl px-5 pt-28">
        <section className="grid min-h-[78vh] items-center gap-10 pb-16 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="mb-4 inline-flex rounded-full border px-3 py-1 text-sm text-foreground/70">SaaS de carreira com IA generativa</p>
            <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-normal md:text-7xl">Curriculo IA</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/70">
              Analise, reescreva e otimize curriculos para vagas reais com pontuacao ATS, comparacao semantica e exportacao profissional.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register"><Button className="h-12 px-6">Criar conta <ArrowRight size={18} /></Button></Link>
              <Link href="/pricing"><Button variant="secondary" className="h-12 px-6">Ver planos</Button></Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-lg border bg-card p-5 shadow-glow">
            <div className="grid gap-4">
              <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                <span className="text-sm text-foreground/70">Score ATS</span>
                <strong className="text-3xl text-primary">92</strong>
              </div>
              <div className="h-3 rounded-full bg-muted"><div className="h-3 w-[92%] rounded-full bg-primary" /></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {features.map((item) => (
                  <div key={item.title} className="rounded-lg border bg-background p-4">
                    <item.icon className="mb-3 text-primary" size={22} />
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-foreground/60">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
