const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export interface GenerateRequest {
  image_url: string;
  style_id: string;
  narrative: string;
  aspect_ratio: string;
}

export interface GenerateResponse {
  job_id: string;
  status: string;
  estimated_time_sec: number;
  poll_url: string;
}

export interface JobResult {
  status: "processing" | "completed" | "failed";
  result?: {
    generated_image_url: string;
    generated_copy: string;
    hashtags: string[];
    headline: string;
    tagline: string;
  };
  error?: string;
}

let useMock = false;

export function setUseMock(mock: boolean) {
  useMock = mock;
}

const mockPollCounters = new Map<string, number>();

async function mockGenerate(): Promise<GenerateResponse> {
  await new Promise((r) => setTimeout(r, 500));
  const jobId = `job_${Date.now()}`;
  mockPollCounters.set(jobId, 0);
  return {
    job_id: jobId,
    status: "processing",
    estimated_time_sec: 12,
    poll_url: `/api/v1/jobs/${jobId}`,
  };
}

async function mockPollJob(jobId: string): Promise<JobResult> {
  await new Promise((r) => setTimeout(r, 1000));
  const count = (mockPollCounters.get(jobId) ?? 0) + 1;
  mockPollCounters.set(jobId, count);
  if (count < 3) {
    return { status: "processing" };
  }
  mockPollCounters.delete(jobId);
  return {
    status: "completed",
    result: {
      generated_image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
      generated_copy: "Saborea la noche... Nuestro chef acaba de terminar esta obra maestra. ¡Etiqueta a alguien con quien la compartirías!",
      hashtags: ["#AltaCocina", "#Foodie", "#CenaPerfecta", "#VidaDeChef", "#FotografíaGastronómica"],
      headline: "Sabor Artesanal",
      tagline: "Cada bocado cuenta una historia de tradición y pasión culinaria",
    },
  };
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }
  return headers;
}

export async function generateImage(req: GenerateRequest): Promise<GenerateResponse> {
  if (useMock) return mockGenerate();
  const res = await fetch(`${API_BASE}/api/v1/generate`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`Error en generación: ${res.status}`);
  return res.json();
}

export async function pollJob(jobId: string): Promise<JobResult> {
  if (useMock) return mockPollJob(jobId);
  const res = await fetch(`${API_BASE}/api/v1/jobs/${jobId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Error en consulta: ${res.status}`);
  return res.json();
}
