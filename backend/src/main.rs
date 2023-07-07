use std::error::Error;
use tauri::{CustomMenuItem, Menu, MenuItem, Submenu, WindowMenuEvent};

fn event_handler(event: WindowMenuEvent) {
    match event.menu_item_id() {
        "new" => {
            event.window().emit("menu-event", "new-event").unwrap();
        }
        "open" => {
            event.window().emit("menu-event", "open-event").unwrap();
        }
        "save" => {
            event.window().emit("menu-event", "save-event").unwrap();
        }
        "save_as" => {
            event.window().emit("menu-event", "save-as-event").unwrap();
        }
        "close" => {
            event.window().emit("menu-event", "close-event").unwrap();
        }
        _ => {}
    }
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
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
