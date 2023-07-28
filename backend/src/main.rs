#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::error::Error;
use tauri::{CustomMenuItem, Manager, Menu, MenuItem, Submenu, Window, WindowMenuEvent};

fn event_handler(event: WindowMenuEvent) {
    match event.menu_item_id() {
        "new" => {
            event.window().emit("menu-event", "new").unwrap();
        }
        "open" => {
            event.window().emit("menu-event", "open").unwrap();
        }
        "save" => {
            event.window().emit("menu-event", "save").unwrap();
        }
        "save_as" => {
            event.window().emit("menu-event", "save-as").unwrap();
        }
        "close" => {
            event.window().emit("menu-event", "close").unwrap();
        }
        _ => {}
    }
}

#[tauri::command]
async fn show_main_window(window: Window) {
    window.get_window("main").unwrap().show().unwrap();
}

fn main() -> Result<(), Box<dyn Error>> {
    let new = CustomMenuItem::new("new", "New").accelerator("CmdOrControl+N");
    let open = CustomMenuItem::new("open", "Open").accelerator("CmdOrControl+O");
    let save = CustomMenuItem::new("save", "Save").accelerator("CmdOrControl+S");
    let save_as = CustomMenuItem::new("save_as", "Save As").accelerator("CmdOrControl+Shift+S");
    let close = CustomMenuItem::new("close", "Close").accelerator("CmdOrControl+W");
    let submenu = Submenu::new(
        "File",
        Menu::new()
            .add_item(new)
            .add_item(open)
            .add_item(save)
            .add_item(save_as)
            .add_item(close)
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Quit),
    );
    let menu = Menu::new().add_submenu(submenu);

    tauri::Builder::default()
        .menu(menu)
        .on_menu_event(event_handler)
        .invoke_handler(tauri::generate_handler![show_main_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
