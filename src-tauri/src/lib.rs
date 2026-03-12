use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let result: Result<(), Box<dyn std::error::Error + Send + Sync>> = tauri::Builder::default()
        .plugin(tauri_plugin_websocket::Builder::new().build())
        .setup(|app| {
            #[cfg(desktop)]
            {
                let _window = app.get_webview_window("main").unwrap();
                Ok::<(), Box<dyn std::error::Error + Send + Sync>>(())
            }
        })
        .run(tauri::generate_context!());
    result
}
