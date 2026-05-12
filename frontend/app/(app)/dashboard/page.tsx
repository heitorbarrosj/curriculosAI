"use client";

import { motion } from "framer-motion";
import { FileText, Target, TrendingUp, Wand2 } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/use-dashboard";

export default function DashboardPage() {
  const { data, loading } = useDashboard();
  if (loading) return <div className="grid gap-4 md:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>;
  const cards = [
    { label: "Score ATS", value: data.scoreAts, icon: TrendingUp },
    { label: "Curriculos", value: data.resumes, icon: FileText },
    { label: "Vagas", value: data.jobs, icon: Target },
    { label: "Melhorias", value: data.latestImprovements?.length ?? 0, icon: Wand2 }
  ];
  const chartData = (data.history ?? []).map((item: any) => ({ name: item.resume?.title?.slice(0, 12) ?? "Analise", score: item.score })).reverse();
  return (
    <div className="grid gap-5">
      <section className="grid gap-4 md:grid-cols-4">
        {cards.map((item, index) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
            <Card className="p-5">
              <item.icon className="text-primary" size={22} />
              <p className="mt-4 text-sm text-foreground/60">{item.label}</p>
              <strong className="text-3xl">{item.value}</strong>
            </Card>
          </motion.div>
        ))}
      </section>
      <Card className="p-5">
        <h2 className="font-semibold">Historico de score</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
