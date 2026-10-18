import { DEFAULT_CONTENT } from "./default-content.js";

const encoder = new TextEncoder();
const COOKIE = "portfolio_admin_session";
const SESSION_SECONDS = 60 * 60 * 8;

const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", ...headers },
});

function base64Url(bytes) {
  let value = "";
  for (const byte of bytes) value += String.fromCharCode(byte);
  return btoa(value).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function decodeBase64Url(value) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function hmacKey(secret) {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

async function createSession(username, secret) {
  const payload = base64Url(encoder.encode(JSON.stringify({ sub: username, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })));
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(payload));
  return `${payload}.${base64Url(new Uint8Array(signature))}`;
}

async function verifySession(token, secret) {
  if (!token || !secret) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  try {
    const valid = await crypto.subtle.verify("HMAC", await hmacKey(secret), decodeBase64Url(signature), encoder.encode(payload));
    const session = JSON.parse(new TextDecoder().decode(decodeBase64Url(payload)));
    return valid && session.exp > Math.floor(Date.now() / 1000) ? session : null;
  } catch { return null; }
}

async function verifyPassword(password, storedHash) {
  const [algorithm, iterationsText, salt, expected] = (storedHash || "").split("$");
  if (algorithm !== "pbkdf2_sha256") return false;
  const iterations = Number.parseInt(iterationsText, 10);
  if (!Number.isSafeInteger(iterations) || iterations < 100000) return false;
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const actual = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: decodeBase64Url(salt), iterations }, key, 256));
  const wanted = decodeBase64Url(expected);
  if (actual.length !== wanted.length) return false;
  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) difference |= actual[index] ^ wanted[index];
  return difference === 0;
}

function cookie(request, name) {
  const match = request.headers.get("cookie")?.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

async function requireAdmin(request, env) {
  return verifySession(cookie(request, COOKIE), env.SESSION_SECRET);
}

function cors(request, env) {
  const origin = request.headers.get("origin") || "";
  const allowed = new Set([env.SITE_ORIGIN, "http://localhost:3000", "http://127.0.0.1:3000"].filter(Boolean));
  return allowed.has(origin) ? { "access-control-allow-origin": origin, vary: "Origin" } : {};
}

function validContent(content) {
  if (!content || typeof content !== "object" || !content.profile?.name || !content.sections || !content.social) return false;
  if (!Array.isArray(content.skills) || content.skills.length < 1 || content.skills.length > 96) return false;
  if (!Array.isArray(content.experience) || !Array.isArray(content.projects)) return false;
  const skillIds = content.skills.map((skill) => String(skill?.id || ""));
  if (skillIds.some((id) => !/^[a-z0-9][a-z0-9-]{0,79}$/.test(id)) || new Set(skillIds).size !== skillIds.length) return false;
  if (content.skills.some((skill) => !skill.label || !skill.color || !skill.icon)) return false;
  if (content.experience.some((item) => !item.id || !item.title || !Array.isArray(item.description) || !Array.isArray(item.skills))) return false;
  if (content.projects.some((item) => !item.id || !item.title || !Array.isArray(item.description) || !Array.isArray(item.technologies))) return false;
  return JSON.stringify(content).length < 500000;
}

async function getContent(env) {
  const row = await env.DB.prepare("SELECT content, version, updated_at FROM portfolio_content WHERE id = 1").first();
  if (row) return { content: JSON.parse(row.content), version: row.version, updatedAt: row.updated_at };
  const serialized = JSON.stringify(DEFAULT_CONTENT);
  await env.DB.prepare("INSERT OR IGNORE INTO portfolio_content (id, content) VALUES (1, ?)").bind(serialized).run();
  return { content: DEFAULT_CONTENT, version: 1, updatedAt: new Date().toISOString() };
}

function securityHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set("x-content-type-options", "nosniff");
  headers.set("x-frame-options", "DENY");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");
  headers.set("content-security-policy", "default-src 'self'; img-src 'self' https: data:; connect-src 'self'; style-src 'self'; script-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function api(request, env) {
  const url = new URL(request.url);
  const corsHeaders = cors(request, env);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { ...corsHeaders, "access-control-allow-methods": "GET, POST, OPTIONS", "access-control-allow-headers": "content-type" } });

  if (["POST", "PUT", "DELETE"].includes(request.method)) {
    const origin = request.headers.get("origin");
    const ownOrigin = url.origin;
    const isContact = url.pathname === "/api/contact" && Object.keys(corsHeaders).length > 0;
    if (origin && origin !== ownOrigin && !isContact) return json({ error: "İstek kaynağına izin verilmiyor." }, 403, corsHeaders);
  }

  if (url.pathname === "/api/health" && request.method === "GET") return json({ status: "ok" });
  if (url.pathname === "/api/content" && request.method === "GET") return json(await getContent(env), 200, { ...corsHeaders, "cache-control": "public, max-age=60" });

  if (url.pathname === "/api/contact" && request.method === "POST") {
    const key = `contact:${request.headers.get("cf-connecting-ip") || "local"}`;
    if (env.LOGIN_RATE_LIMITER && !(await env.LOGIN_RATE_LIMITER.limit({ key })).success) return json({ error: "Çok fazla mesaj gönderildi. Biraz sonra tekrar deneyin." }, 429, corsHeaders);
    const body = await request.json().catch(() => null);
    const fullName = String(body?.fullName || "").trim();
    const email = String(body?.email || "").trim();
    const message = String(body?.message || "").trim();
    if (fullName.length < 2 || fullName.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10 || message.length > 5000) return json({ error: "Geçersiz form alanları." }, 400, corsHeaders);
    await env.DB.prepare("INSERT INTO contact_messages (full_name, email, message) VALUES (?, ?, ?)").bind(fullName, email, message).run();
    return json({ sent: true }, 201, corsHeaders);
  }

  if (url.pathname === "/api/auth/login" && request.method === "POST") {
    const key = request.headers.get("cf-connecting-ip") || "local";
    if (env.LOGIN_RATE_LIMITER && !(await env.LOGIN_RATE_LIMITER.limit({ key })).success) return json({ error: "Çok fazla deneme. Biraz sonra tekrar deneyin." }, 429);
    const body = await request.json().catch(() => null);
    const matches = body?.username === env.ADMIN_USERNAME && await verifyPassword(String(body?.password || ""), env.ADMIN_PASSWORD_HASH);
    if (!matches) return json({ error: "Kullanıcı adı veya parola yanlış." }, 401);
    const session = await createSession(body.username, env.SESSION_SECRET);
    return json({ authenticated: true }, 200, { "set-cookie": `${COOKIE}=${session}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_SECONDS}` });
  }

  if (url.pathname === "/api/auth/logout" && request.method === "POST") return json({ authenticated: false }, 200, { "set-cookie": `${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0` });
  if (url.pathname.startsWith("/api/admin/")) {
    if (!(await requireAdmin(request, env))) return json({ error: "Admin oturumu gerekli." }, 401);
    if (url.pathname === "/api/admin/session" && request.method === "GET") return json({ authenticated: true });
    if (url.pathname === "/api/admin/content" && request.method === "GET") return json(await getContent(env));
    if (url.pathname === "/api/admin/content" && request.method === "PUT") {
      const body = await request.json().catch(() => null);
      if (!validContent(body?.content)) return json({ error: "İçerik yapısı geçersiz." }, 400);
      const serialized = JSON.stringify(body.content);
      await env.DB.prepare("INSERT INTO portfolio_content (id, content, version, updated_at) VALUES (1, ?, 1, CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET content = excluded.content, version = portfolio_content.version + 1, updated_at = CURRENT_TIMESTAMP").bind(serialized).run();
      return json(await getContent(env));
    }
    if (url.pathname === "/api/admin/messages" && request.method === "GET") {
      const { results } = await env.DB.prepare("SELECT id, full_name, email, message, is_read, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 200").all();
      return json({ messages: results });
    }
    if (/^\/api\/admin\/messages\/\d+$/.test(url.pathname) && request.method === "DELETE") {
      const id = Number(url.pathname.split("/").pop());
      await env.DB.prepare("DELETE FROM contact_messages WHERE id = ?").bind(id).run();
      return json({ deleted: id });
    }
  }
  return json({ error: "Bulunamadı." }, 404);
}

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      let response;
      if (url.pathname.startsWith("/api/")) response = await api(request, env);
      else if (url.pathname === "/admin" || url.pathname === "/admin/") response = await env.ASSETS.fetch(new Request(new URL("/admin/index.html", url), request));
      else response = await env.ASSETS.fetch(request);
      return securityHeaders(response);
    } catch (error) {
      console.error(error);
      return securityHeaders(json({ error: "İstek tamamlanamadı." }, 500));
    }
  }
};
