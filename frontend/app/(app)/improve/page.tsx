"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/services/api";

export default function ImprovePage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [resumeId, setResumeId] = useState("");
  const [optimized, setOptimized] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    api.get("/resumes").then(({ data }) => {
      setResumes(data.items);
      setResumeId(data.items?.[0]?.id ?? "");
    });
  }, []);
  async function improve(formData: FormData) {
    setLoading(true);
    try {
      const { data } = await api.post(`/improvements/${resumeId}`, { jobDescription: String(formData.get("jobDescription")) });
      setOptimized(data.optimizedText);
      toast.success("Curriculo otimizado");
    } catch {
      toast.error("Falha ao otimizar");
    } finally {
      setLoading(false);
    }
  }
  async function download(format: "pdf" | "docx") {
    const response = await api.get(`/export/resumes/${resumeId}.${format}`, { responseType: "blob" });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `curriculo-otimizado.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <Card className="p-6">
        <h1 className="text-2xl font-bold">Melhoria automatica</h1>
        <form action={improve} className="mt-6 grid gap-4">
          <select className="h-11 rounded-lg border bg-card px-3" value={resumeId} onChange={(event) => setResumeId(event.target.value)}>
            {resumes.map((resume) => <option key={resume.id} value={resume.id}>{resume.title}</option>)}
          </select>
          <Textarea name="jobDescription" placeholder="Opcional: cole a vaga para otimizar o texto para ela" />
          <Button disabled={!resumeId || loading}>{loading ? "Otimizando..." : "Reescrever com IA"}</Button>
        </form>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" disabled={!resumeId} onClick={() => download("pdf")}><Download size={16} /> PDF</Button>
          <Button variant="secondary" disabled={!resumeId} onClick={() => download("docx")}><Download size={16} /> DOCX</Button>
        </div>
      </Card>
      <Card className="p-6">
        <h2 className="font-semibold">Curriculo otimizado</h2>
        <pre className="mt-4 max-h-[620px] overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm leading-7">{optimized || "A versao reescrita aparecera aqui."}</pre>
      </Card>
    </div>
  );
}


