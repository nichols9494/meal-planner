use std::fs;
use tauri::Manager;

fn key_file_path(app: &tauri::AppHandle) -> Result<std::path::PathBuf, String> {
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir.join("anthropic_key.txt"))
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
struct ClaudeMessage {
    role: String,
    content: String,
}

#[derive(serde::Serialize)]
struct ClaudeRequest {
    model: String,
    max_tokens: u32,
    messages: Vec<ClaudeMessage>,
}

#[derive(serde::Deserialize, Default)]
struct ClaudeContentBlock {
    #[serde(default)]
    text: String,
}

#[derive(serde::Deserialize)]
struct ClaudeError {
    message: String,
}

#[derive(serde::Deserialize, Default)]
struct ClaudeResponse {
    #[serde(default)]
    content: Vec<ClaudeContentBlock>,
    #[serde(default)]
    error: Option<ClaudeError>,
}

#[tauri::command]
async fn ask_claude(app: tauri::AppHandle, prompt: String) -> Result<String, String> {
    let path = key_file_path(&app)?;
    let key = fs::read_to_string(&path)
        .map_err(|_| "No Anthropic API key saved yet. Add one in Settings.".to_string())?;
    let key = key.trim().to_string();
    if key.is_empty() {
        return Err("No Anthropic API key saved yet. Add one in Settings.".to_string());
    }

    let client = reqwest::Client::new();
    let body = ClaudeRequest {
        model: "claude-haiku-4-5-20251001".to_string(),
        max_tokens: 1024,
        messages: vec![ClaudeMessage {
            role: "user".to_string(),
            content: prompt,
        }],
    };

    let res = client
        .post("https://api.anthropic.com/v1/messages")
        .header("x-api-key", key)
        .header("anthropic-version", "2023-06-01")
        .header("content-type", "application/json")
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("Network error reaching Claude: {e}"))?;

    let status = res.status();
    let parsed: ClaudeResponse = res.json().await.unwrap_or_default();

    if let Some(err) = parsed.error {
        return Err(format!("Claude API error: {}", err.message));
    }
    if !status.is_success() {
        return Err(format!("Claude API returned status {status}"));
    }

    let text = parsed
        .content
        .into_iter()
        .map(|c| c.text)
        .collect::<Vec<_>>()
        .join("");
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
        .invoke_handler(tauri::generate_handler![
            save_api_key,
            has_api_key,
            clear_api_key,
            ask_claude
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
