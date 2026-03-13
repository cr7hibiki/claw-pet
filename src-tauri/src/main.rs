#![cfg_attr(not(target_os = "windows"), windows_subsystem = "windows")]

fn main() {
    let mut builder = tauri_plugin_websocket::Builder::new();
    let plugin = tauri_plugin_websocket::Builder::new().build();
    builder = builder.plugin(plugin);
    let context = tauri::generate_context!();
    builder.setup(context);
    builder.run(context);
}