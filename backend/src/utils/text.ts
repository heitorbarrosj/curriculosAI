import sanitizeHtml from "sanitize-html";

export function cleanText(input: string) {
  return sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} })
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function extractSkillsFromText(text: string) {
  const known = [
    "javascript", "typescript", "react", "next.js", "node.js", "express", "postgresql",
    "prisma", "docker", "aws", "azure", "gcp", "python", "sql", "excel", "power bi",
    "scrum", "kanban", "lideranca", "comunicacao", "ingles", "git", "ci/cd", "kubernetes"
  ];
  const normalized = text.toLowerCase();
  return known.filter((skill) => normalized.includes(skill));
}

export function cosineSimilarity(a: number[], b: number[]) {
  if (!a.length || !b.length || a.length !== b.length) return 0;
  const dot = a.reduce((sum, value, index) => sum + value * b[index], 0);
  const magA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
  const magB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}

export function toNumberArray(value: unknown) {
  return Array.isArray(value) ? value.map(Number).filter((item) => Number.isFinite(item)) : [];
}
