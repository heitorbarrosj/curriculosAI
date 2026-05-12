"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/services/api";

export default function MatchingPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [resumeId, setResumeId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    api.get("/resumes").then(({ data }) => {
      setResumes(data.items);
      setResumeId(data.items?.[0]?.id ?? "");
    });
  }, []);
  async function submit(formData: FormData) {
    setLoading(true);
    try {
      const job = await api.post("/jobs", {
        title: String(formData.get("title")),
        company: String(formData.get("company")),
        description: String(formData.get("description"))
      });
      const match = await api.post(`/jobs/${job.data.id}/match/${resumeId}`);
      setResult(match.data);
      toast.success("Matching calculado");
    } catch {
      toast.error("Nao foi possivel comparar");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
      <Card className="p-6">
        <h1 className="text-2xl font-bold">Matching com vaga</h1>
        <form action={submit} className="mt-6 grid gap-4">
          <select className="h-11 rounded-lg border bg-card px-3" value={resumeId} onChange={(event) => setResumeId(event.target.value)}>
            {resumes.map((resume) => <option key={resume.id} value={resume.id}>{resume.title}</option>)}
          </select>
          <Input name="title" placeholder="Titulo da vaga" required />
          <Input name="company" placeholder="Empresa" />
          <Textarea name="description" placeholder="Cole a descricao completa da vaga" required />
          <Button disabled={!resumeId || loading}>{loading ? "Comparando..." : "Comparar agora"}</Button>
        </form>
      </Card>
      <Card className="p-6">
        <h2 className="font-semibold">Resultado</h2>
        {result ? (
          <div className="mt-5 grid gap-4">
            <strong className="text-5xl text-primary">{result.matchScore}%</strong>
            <p className="text-sm text-foreground/60">Score semantico: {result.semanticScore}%</p>
            <div>
              <p className="font-medium">Skills faltantes</p>
              <p className="mt-2 text-sm text-foreground/70">{result.missingSkills?.join(", ") || "Nenhuma skill critica detectada"}</p>
            </div>
          </div>
        ) : <p className="mt-4 text-sm text-foreground/60">A compatibilidade e as lacunas aparecerao aqui.</p>}
      </Card>
    </div>
  );
}
