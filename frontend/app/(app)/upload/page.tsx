"use client";

import { useCallback, useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/services/api";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const upload = useCallback(async () => {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    setLoading(true);
    try {
      const { data } = await api.post("/resumes/upload", form);
      setResult(data);
      toast.success("Curriculo processado");
    } catch {
      toast.error("Falha no upload");
    } finally {
      setLoading(false);
    }
  }, [file]);
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
      <Card className="p-6">
        <h1 className="text-2xl font-bold">Upload de curriculo</h1>
        <label className="mt-6 flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 p-8 text-center hover:bg-muted/50">
          <FileUp className="text-primary" size={42} />
          <span className="mt-4 font-semibold">{file?.name ?? "Arraste ou selecione um PDF"}</span>
          <span className="mt-2 text-sm text-foreground/60">PDF ate 8MB</span>
          <input className="hidden" type="file" accept="application/pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
        </label>
        <Button className="mt-5" disabled={!file || loading} onClick={upload}>{loading && <Loader2 className="animate-spin" size={18} />} Processar curriculo</Button>
      </Card>
      <Card className="p-6">
        <h2 className="font-semibold">Dados extraidos</h2>
        {result ? (
          <div className="mt-4 grid gap-4 text-sm">
            <p><strong>Nome:</strong> {result.candidateName || "Nao identificado"}</p>
            <p><strong>Skills:</strong> {result.skills?.join(", ") || "Sem skills detectadas"}</p>
            <p><strong>Idiomas:</strong> {result.languages?.join(", ") || "Nao informado"}</p>
          </div>
        ) : <p className="mt-4 text-sm text-foreground/60">O resumo tecnico aparecera aqui apos o processamento.</p>}
      </Card>
    </div>
  );
}
