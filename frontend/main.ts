import { invoke } from "@tauri-apps/api";
import { open, save } from "@tauri-apps/api/dialog";
import { listen } from "@tauri-apps/api/event";
import { readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import DOMPurify from "dompurify";
import { marked } from "marked";

interface File {
  path: string;
  text: string;
}

export const file: File = { path: "", text: "" };

async function newEvent() {
  resetFile();
  createApp();
  updateFilenameInnerText();
  updateEditor();
  renderHtml();
}

async function openEvent() {
  file.path = (await open({
    filters: [
      {
        name: "Markdown",
        extensions: ["md"],
      },
    ],
  })) as string;
  file.text = await readTextFile(file.path);
  createApp();
  updateFilenameInnerText();
  updateEditor();
  renderHtml();
}

async function saveEvent() {
  if (file.path.length === 0) {
    const saveConfig = {
      filters: [
        {
          name: "Markdown",
          extensions: ["md"],
        },
      ],
    };
    file.path = (await save(saveConfig)) as string;
  }
  await writeTextFile(file.path, file.text);
}

async function saveAsEvent() {
  const saveConfig = {
    defaultPath: file.path,
    filters: [
      {
        name: "Markdown",
        extensions: ["md"],
      },
    ],
  };
  file.path = (await save(saveConfig)) as string;
  await writeTextFile(file.path, file.text);
}

async function closeEvent() {
  resetFile();
  removeApp();
}

async function updateText() {
  const editor = document.getElementById("editor");
  if (editor) {
    file.text = editor.innerText;
  }
}

async function renderHtml() {
  const preview = document.getElementById("preview");
  if (preview) {
    preview.innerHTML = DOMPurify.sanitize(marked(file.text));
  }
}

export async function createApp() {
  let app = document.getElementById("app");
  if (!app) {
    app = document.createElement("div");
    app.setAttribute("id", "app");

    const filename = createFilenameElement();
    app.appendChild(filename);

    const editor = createEditorElement();
    app.appendChild(editor);

    const preview = createPreviewElement();
    app.appendChild(preview);

    document.body.appendChild(app);
  }
}

export function createFilenameElement() {
  const filename = document.createElement("h1");
  filename.setAttribute("id", "filename");
  return filename;
}

export function createEditorElement() {
  const editor = document.createElement("div");
  editor.setAttribute("id", "editor");
  editor.contentEditable = "true";
  return editor;
}

export function createPreviewElement() {
  const preview = document.createElement("div");
  preview.setAttribute("id", "preview");
  return preview;
}

export async function removeApp() {
  const app = document.getElementById("app");
  if (app) {
    app.remove();
  }
}

export function resetFile() {
  file.path = "";
  file.text = "";
}

async function showMainWindow() {
  invoke("show_main_window");
}

window.addEventListener("DOMContentLoaded", () => {
  listen("menu-event", async (event) => {
    switch (event.payload) {
      case "new":
        newEvent();
        break;
      case "open":
        openEvent();
        break;
      case "save":
        saveEvent();
        break;
      case "save-as":
        saveAsEvent();
        break;
      case "close":
        closeEvent();
        break;
    }
  });
  showMainWindow();
});

function updateFilenameInnerText() {
  const filename = document.getElementById("filename");
  if (filename) {
    filename.innerText = file.path;
  }
}

function updateEditor() {
  const editor = document.getElementById("editor");
  if (editor) {
    editor.innerText = file.text;
    editor.addEventListener("input", updateText);
    editor.addEventListener("input", renderHtml);
  }
}
