/**
 * Best-effort flood guard for the form routes: `max` requests per address
 * per `windowMs`, counted per server instance. The free Brevo plan sends 300
 * emails a day, so a bot mustn't be able to burn through it.
 */
const hits = new Map<string, number[]>();

export function rateLimited(req: Request, key: string, max = 5, windowMs = 10 * 60 * 1000) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const id = `${key}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(id) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(id, recent);
  return recent.length > max;
}
