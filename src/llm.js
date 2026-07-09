const BROWSER_GEMINI_API_KEY = "gemini-api-key-v1";
const GEMINI_MODEL = "gemini-2.5-flash";

function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function isTauriRuntime() {
  return (
    typeof window !== "undefined" &&
    Boolean(window.__TAURI_INTERNALS__)
  );
}

async function invokeTauri(command, payload = {}) {
  const { invoke } = await import("@tauri-apps/api/core");
  return await invoke(command, payload);
}

async function askGeminiThroughTauri(prompt) {
  try {
    return await invokeTauri("ask_gemini", { prompt });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

async function askGeminiFromBrowser(prompt) {
  const key = localStorage.getItem(BROWSER_GEMINI_API_KEY);

  if (!key) {
    throw new Error("No Gemini API key saved. Add your key in Settings first.");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error?.message ||
      `Gemini request failed with status ${response.status}.`;
    throw new Error(message);
  }

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return text;
}

export async function saveApiKey(key) {
  if (isTauriRuntime()) {
    return await invokeTauri("save_api_key", { key });
  }

  localStorage.setItem(BROWSER_GEMINI_API_KEY, key);
  return true;
}

export async function hasApiKey() {
  if (isTauriRuntime()) {
    return await invokeTauri("has_api_key");
  }

  return Boolean(localStorage.getItem(BROWSER_GEMINI_API_KEY));
}

export async function clearApiKey() {
  if (isTauriRuntime()) {
    return await invokeTauri("clear_api_key");
  }

  localStorage.removeItem(BROWSER_GEMINI_API_KEY);
  return true;
}

// Ollama/local LLM is intentionally disabled for now.
// Tauri builds still use the Rust backend.
// Browser/PWA builds use Gemini directly with the user's locally saved key.
export async function askLLM(prompt, { mode = "auto" } = {}) {
  if (isTauriRuntime()) {
    return askGeminiThroughTauri(prompt);
  }

  return askGeminiFromBrowser(prompt);
}