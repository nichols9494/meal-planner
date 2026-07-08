use std::fs;
use tauri::Manager;

fn key_file_path(app: &tauri::AppHandle) -> Result<std::path::PathBuf, String> {
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir.join("gemini_api_key.txt"))
}

#[tauri::command]
fn save_api_key(app: tauri::AppHandle, key: String) -> Result<(), String> {
    let path = key_file_path(&app)?;
    fs::write(path, key.trim()).map_err(|e| e.to_string())
}

#[tauri::command]
fn has_api_key(app: tauri::AppHandle) -> bool {
    match key_file_path(&app) {
        Ok(path) => path.exists() && fs::metadata(&path).map(|m| m.len() > 0).unwrap_or(false),
        Err(_) => false,
    }
}

#[tauri::command]
fn clear_api_key(app: tauri::AppHandle) -> Result<(), String> {
    let path = key_file_path(&app)?;
    if path.exists() {
        fs::remove_file(path).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[derive(serde::Serialize)]
struct GeminiPart {
    text: String,
}

#[derive(serde::Serialize)]
struct GeminiContent {
    parts: Vec<GeminiPart>,
}

#[derive(serde::Serialize)]
struct GeminiRequest {
    contents: Vec<GeminiContent>,
}

#[derive(serde::Deserialize, Default)]
struct GeminiResponsePart {
    #[serde(default)]
    text: String,
}

#[derive(serde::Deserialize, Default)]
struct GeminiResponseContent {
    #[serde(default)]
    parts: Vec<GeminiResponsePart>,
}

#[derive(serde::Deserialize, Default)]
struct GeminiCandidate {
    #[serde(default)]
    content: GeminiResponseContent,
}

#[derive(serde::Deserialize)]
struct GeminiError {
    message: String,
}

#[derive(serde::Deserialize, Default)]
struct GeminiResponse {
    #[serde(default)]
    candidates: Vec<GeminiCandidate>,
    #[serde(default)]
    error: Option<GeminiError>,
}

#[tauri::command]
async fn ask_gemini(app: tauri::AppHandle, prompt: String) -> Result<String, String> {
    let path = key_file_path(&app)?;
    let key = fs::read_to_string(&path)
        .map_err(|_| "No Gemini API key saved yet. Add one in Settings.".to_string())?;
    let key = key.trim().to_string();
    if key.is_empty() {
        return Err("No Gemini API key saved yet. Add one in Settings.".to_string());
    }

    let client = reqwest::Client::new();
    let body = GeminiRequest {
        contents: vec![GeminiContent {
            parts: vec![GeminiPart { text: prompt }],
        }],
    };

    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    let res = client
        .post(url)
        .header("x-goog-api-key", key)
        .header("content-type", "application/json")
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("Network error reaching Gemini: {e}"))?;

    let status = res.status();
    let parsed: GeminiResponse = res.json().await.unwrap_or_default();

    if let Some(err) = parsed.error {
        return Err(format!("Gemini API error: {}", err.message));
    }
    if !status.is_success() {
        return Err(format!("Gemini API returned status {status}"));
    }

    let text = parsed
        .candidates
        .into_iter()
        .next()
        .map(|c| c.content.parts.into_iter().map(|p| p.text).collect::<Vec<_>>().join(""))
        .unwrap_or_default();

    if text.is_empty() {
        return Err("Gemini returned an empty response (it may have been blocked by its safety filters — try rephrasing).".to_string());
    }

    Ok(text)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![save_api_key, has_api_key, clear_api_key, ask_gemini])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
