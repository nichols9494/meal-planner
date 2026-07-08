// Talks to a locally running Ollama server (http://127.0.0.1:11434).
// Ollama must be running on the machine for this to work — start it with
// `ollama serve` (or `brew services start ollama`) and make sure at least
// one model has been pulled, e.g. `ollama pull llama3.2`.

const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";
const DEFAULT_MODEL = "llama3.2";

export async function askLLM(prompt, { model = DEFAULT_MODEL } = {}) {
  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, prompt, stream: false }),
  });
  if (!res.ok) {
    throw new Error(
      `Ollama request failed (${res.status}). Is "ollama serve" running?`,
    );
  }
  const data = await res.json();
  return data.response;
}
