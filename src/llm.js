import { invoke } from "@tauri-apps/api/core";

const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";
const DEFAULT_OLLAMA_MODEL = "llama3.2";

async function askOllama(
  prompt,
  { model = DEFAULT_OLLAMA_MODEL, timeoutMs = 3000 } = {},
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, stream: false }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Ollama responded with ${res.status}`);
    const data = await res.json();
    return data.response;
  } finally {
    clearTimeout(timer);
  }
}

async function askClaude(prompt) {
  return await invoke("ask_claude", { prompt });
}

export async function saveApiKey(key) {
  return await invoke("save_api_key", { key });
}
export async function hasApiKey() {
  return await invoke("has_api_key");
}
export async function clearApiKey() {
  return await invoke("clear_api_key");
}

// mode: "auto" (try local, fall back to cloud), "local" (Ollama only), "cloud" (Claude only)
export async function askLLM(prompt, { mode = "auto" } = {}) {
  if (mode === "cloud") return askClaude(prompt);
  if (mode === "local") return askOllama(prompt);
  try {
    return await askOllama(prompt);
  } catch {
    return await askClaude(prompt);
  }
}
