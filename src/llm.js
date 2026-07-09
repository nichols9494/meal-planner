import { invoke } from "@tauri-apps/api/core";

function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

async function askGemini(prompt) {
  try {
    return await invoke("ask_gemini", { prompt });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
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

// Ollama/local LLM is intentionally disabled for now.
// All platforms — Linux, Android, and Windows — use Gemini.
//
// Keep the same function signature so App.jsx does not need to change.
export async function askLLM(prompt, { mode = "auto" } = {}) {
  return askGemini(prompt);
}
