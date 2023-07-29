import { clearMocks } from "@tauri-apps/api/mocks";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createApp,
  createEditorElement,
  createFilenameElement,
  createPreviewElement,
  file,
  removeApp,
  resetFile,
} from "../main";

describe("Main", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    clearMocks();
  });

  it("should create the app", () => {
    createApp();
    const test = document.getElementById("app");
    expect(test).toBeTruthy();
  });

  it("should create an h1 element with id 'filename'", () => {
    const test = createFilenameElement();
    expect(test.tagName).toBe("H1");
    expect(test.getAttribute("id")).toBe("filename");
  });

  it("should create a div element with id 'editor' and contentEditable set to true", () => {
    const test = createEditorElement();
    expect(test.tagName).toBe("DIV");
    expect(test.getAttribute("id")).toBe("editor");
    expect(test.contentEditable).toBe("true");
  });

  it("should create a div element with id 'preview'", () => {
    const test = createPreviewElement();
    expect(test.tagName).toBe("DIV");
    expect(test.getAttribute("id")).toBe("preview");
  });

  it("should remove the app", () => {
    const app = document.createElement("div");
    app.setAttribute("id", "app");
    document.body.appendChild(app);
    removeApp();
    const test = document.getElementById("app");
    expect(test).toBeFalsy();
  });

  it("should reset the file", () => {
    file.path = "example/path";
    file.text = "example text";
    resetFile();
    const test = file;
    expect(test.path).toBe("");
    expect(test.text).toBe("");
  });
});
