#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use anyhow::Error;
use tauri::{CustomMenuItem, Manager, Menu, MenuItem, Submenu, Window, WindowMenuEvent};

fn create_menu() -> Menu {
    Menu::new().add_submenu(Submenu::new(
        "File",
        Menu::new()
            .add_item(CustomMenuItem::new("new", "New").accelerator("CmdOrControl+N"))
            .add_item(CustomMenuItem::new("open", "Open").accelerator("CmdOrControl+O"))
            .add_item(CustomMenuItem::new("save", "Save").accelerator("CmdOrControl+S"))
            .add_item(CustomMenuItem::new("save_as", "Save As").accelerator("CmdOrControl+Shift+S"))
            .add_item(CustomMenuItem::new("close", "Close").accelerator("CmdOrControl+W"))
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Quit),
    ))
}

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

fn main() -> Result<(), Error> {
    tauri::Builder::default()
        .menu(create_menu())
        .on_menu_event(event_handler)
        .invoke_handler(tauri::generate_handler![show_main_window])
        .run(tauri::generate_context!())?;

    Ok(())
}
