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

const file: File = { path: "", text: "" };

async function newEvent() {
  resetFile();
  createApp();
  const filename = document.getElementById("filename");
  if (filename) {
    filename.innerText = file.path;
  }
  const editor = document.getElementById("editor");
  if (editor) {
    editor.innerText = file.text;
    editor.addEventListener("input", updateText);
    editor.addEventListener("input", renderHtml);
  }
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
  const filename = document.getElementById("filename");
  if (filename) {
    filename.innerText = file.path;
  }
  const editor = document.getElementById("editor");
  if (editor) {
    editor.innerText = file.text;
    editor.addEventListener("input", updateText);
    editor.addEventListener("input", renderHtml);
  }
  renderHtml();
}

async function saveEvent() {
  if (file.path.length === 0) {
    file.path = (await save({
      filters: [
        {
          name: "Markdown",
          extensions: ["md"],
        },
      ],
    })) as string;
  }
  await writeTextFile(file.path, file.text);
}

async function saveAsEvent() {
  file.path = (await save({
    defaultPath: file.path,
    filters: [
      {
        name: "Markdown",
        extensions: ["md"],
      },
    ],
  })) as string;
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
  if (app) {
    return;
  }

  app = document.createElement("div");
  app.setAttribute("id", "app");

  const filename =
    document.getElementById("filename") || createFilenameElement();
  app.appendChild(filename);

  const editor = document.getElementById("editor") || createEditorElement();
  app.appendChild(editor);

  const preview = document.getElementById("preview") || createPreviewElement();
  app.appendChild(preview);

  document.body.appendChild(app);
}

function createFilenameElement() {
  const filename = document.createElement("h1");
  filename.setAttribute("id", "filename");
  return filename;
}

function createEditorElement() {
  const editor = document.createElement("div");
  editor.setAttribute("id", "editor");
  editor.contentEditable = "true";
  return editor;
}

function createPreviewElement() {
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

function resetFile() {
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
