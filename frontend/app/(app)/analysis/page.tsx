"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, SearchCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/services/api";

const scoreCards = [
  { key: "clarityScore", label: "Clareza" },
  { key: "impactScore", label: "Impacto" },
  { key: "formattingScore", label: "Formatação" },
  { key: "keywordScore", label: "Palavras-chave" }
];

export default function AnalysisPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [resumeId, setResumeId] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/resumes").then(({ data }) => {
      setResumes(data.items);
      setResumeId(data.items?.[0]?.id ?? "");
    });
  }, []);

  async function analyze() {
    setLoading(true);
    try {
      const { data } = await api.post(`/ats/${resumeId}/analyze`);
      setAnalysis(data);
      toast.success("Análise ATS concluída");
    } catch {
      toast.error("Não foi possível analisar o currículo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <Card className="p-6">
        <SearchCheck className="text-primary" size={28} />
        <h1 className="mt-4 text-2xl font-bold">Análise ATS</h1>
        <p className="mt-2 text-sm leading-6 text-foreground/60">Avalie clareza, impacto, formatação textual e palavras-chave faltantes.</p>
        <div className="mt-6 grid gap-4">
          <select className="h-11 rounded-lg border bg-card px-3" value={resumeId} onChange={(event) => setResumeId(event.target.value)}>
            {resumes.map((resume) => <option key={resume.id} value={resume.id}>{resume.title}</option>)}
          </select>
          <Button disabled={!resumeId || loading} onClick={analyze}>{loading ? "Analisando..." : "Analisar currículo"}</Button>
        </div>
      </Card>
      <Card className="p-6">
        <h2 className="font-semibold">Relatório</h2>
        {analysis ? (
          <div className="mt-5 grid gap-5">
            <div className="flex items-end gap-3"><strong className="text-6xl text-primary">{analysis.score}</strong><span className="pb-2 text-foreground/60">/100</span></div>
            <div className="grid gap-3 sm:grid-cols-4">
              {scoreCards.map((item) => <div key={item.key} className="rounded-lg bg-muted p-3"><p className="text-xs text-foreground/50">{item.label}</p><strong>{analysis[item.key]}</strong></div>)}
            </div>
            <section>
              <h3 className="flex items-center gap-2 font-medium"><AlertCircle size={18} className="text-accent" /> Palavras-chave faltantes</h3>
              <p className="mt-2 text-sm text-foreground/70">{analysis.missingKeywords?.join(", ") || "Nenhuma lacuna crítica."}</p>
            </section>
            <section>
              <h3 className="flex items-center gap-2 font-medium"><CheckCircle2 size={18} className="text-primary" /> Sugestões</h3>
              <ul className="mt-2 grid gap-2 text-sm text-foreground/70">{analysis.suggestions?.map((item: string) => <li key={item}>- {item}</li>)}</ul>
            </section>
          </div>
        ) : <p className="mt-4 text-sm text-foreground/60">Execute uma análise para visualizar o score e as prioridades de melhoria.</p>}
      </Card>
    </div>
  );
}
