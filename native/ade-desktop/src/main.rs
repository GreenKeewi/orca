#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use orca_ade_desktop::{validate_readiness, verify_runtime, RuntimeManifest};
use serde_json::Value;
use std::io::{BufRead, BufReader, Read};
use std::process::{Child, Command, Stdio};
use std::sync::{mpsc, Mutex};
use std::time::Duration;
use tauri::{Manager, WebviewWindow};

#[derive(Default)]
struct OwnedRuntime {
    child: Option<Child>,
    readiness: Option<Value>,
}

#[tauri::command]
async fn ade_runtime_bootstrap(window: WebviewWindow) -> Result<Value, String> {
    tauri::async_runtime::spawn_blocking(move || bootstrap_owned(window))
        .await
        .map_err(|_| "Runtime startup worker failed".to_string())?
}

fn bootstrap_owned(window: WebviewWindow) -> Result<Value, String> {
    let state = window.state::<Mutex<OwnedRuntime>>();
    let origin = window
        .url()
        .map_err(|_| "Cannot inspect local window origin")?;
    let local = (origin.scheme() == "tauri" && origin.host_str() == Some("localhost"))
        || ((origin.scheme() == "http" || origin.scheme() == "https")
            && origin.host_str() == Some("tauri.localhost"));
    if !local {
        return Err("Native bootstrap requires the local asset origin".into());
    }
    if window.label() != "main" {
        return Err("Only the local main window may bootstrap".into());
    }
    let mut owned = state.lock().map_err(|_| "Runtime state unavailable")?;
    if let Some(child) = owned.child.as_mut() {
        if child
            .try_wait()
            .map_err(|_| "Runtime health unavailable")?
            .is_none()
        {
            return owned
                .readiness
                .clone()
                .ok_or("Runtime startup incomplete".into());
        }
        return Err("Owned runtime exited; restart to reconcile its saved state".into());
    }
    let root = if cfg!(debug_assertions) {
        std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("resources")
    } else {
        window
            .app_handle()
            .path()
            .resource_dir()
            .map_err(|_| "Missing app resources")?
            .join("ade-runtime")
    };
    let manifest: RuntimeManifest = serde_json::from_str(include_str!(concat!(
        env!("OUT_DIR"),
        "/runtime-manifest.json"
    )))
    .map_err(|_| "Missing build-time runtime manifest")?;
    let (node, launcher) = verify_runtime(&root, &manifest)?;
    let profile = window
        .app_handle()
        .path()
        .app_local_data_dir()
        .map_err(|_| "Missing ADE profile")?;
    std::fs::create_dir_all(&profile).map_err(|_| "Cannot create ADE profile")?;
    let mut random = [0u8; 32];
    getrandom::fill(&mut random).map_err(|_| "Cannot create runtime launch nonce")?;
    let nonce: String = random.iter().map(|byte| format!("{byte:02x}")).collect();
    let mut log_options = std::fs::OpenOptions::new();
    log_options.create(true).append(true);
    #[cfg(unix)]
    {
        use std::os::unix::fs::OpenOptionsExt;
        log_options.mode(0o600);
    }
    let log = log_options
        .open(profile.join("desktop-runtime.log"))
        .map_err(|_| "Cannot open private ADE runtime diagnostics")?;
    let mut command = Command::new(node);
    command
        .arg(launcher)
        .args([
            "--json",
            "--bind",
            "127.0.0.1",
            "--port",
            "0",
            "--desktop-parent-stdio",
        ])
        .env("ORCA_USER_DATA", &profile)
        .env("ORCA_USER_DATA_PATH", &profile)
        .env("ORCA_ADE_PARENT_NONCE", &nonce)
        .env("ORCA_BACKGROUND_LAUNCH", "1")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::from(log));
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        command.creation_flags(0x08000000);
    }
    let mut child = command
        .spawn()
        .map_err(|_| "Cannot launch packaged Node runtime")?;
    let pid = child.id();
    let stdout = child.stdout.take().ok_or("Missing owned runtime pipe")?;
    let (send, receive) = mpsc::channel();
    std::thread::spawn(move || {
        for line in BufReader::new(stdout.take(262144)).lines() {
            let Ok(line) = line else { break };
            if let Ok(value) = serde_json::from_str::<Value>(&line) {
                if value["type"] == "orca_server_ready" {
                    let _ = send.send(value);
                    return;
                }
            }
        }
    });
    let result = receive
        .recv_timeout(Duration::from_secs(60))
        .map_err(|_| {
            "Runtime did not become ready; inspect the ADE profile diagnostics".to_string()
        })
        .and_then(|value| {
            validate_readiness(&value, &nonce, pid)?;
            Ok(value)
        });
    match result {
        Ok(value) => {
            owned.child = Some(child);
            owned.readiness = Some(value.clone());
            Ok(value)
        }
        Err(error) => {
            drop(child.stdin.take());
            owned.child = Some(child);
            Err(error)
        }
    }
}

fn main() {
    tauri::Builder::default()
        .manage(Mutex::new(OwnedRuntime::default()))
        .invoke_handler(tauri::generate_handler![ade_runtime_bootstrap])
        .setup(|app| {
            if std::env::var("ORCA_BACKGROUND_LAUNCH").as_deref() != Ok("1") {
                if let Some(window) = app.get_webview_window("main") {
                    window.show()?;
                }
            }
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("Could not build Orca ADE desktop")
        .run(|app, event| {
            if matches!(event, tauri::RunEvent::Exit) {
                if let Ok(mut owned) = app.state::<Mutex<OwnedRuntime>>().lock() {
                    if let Some(child) = owned.child.as_mut() {
                        drop(child.stdin.take());
                    }
                }
            }
        });
}
