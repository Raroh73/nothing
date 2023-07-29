import { clearMocks } from "@tauri-apps/api/mocks";
import { afterEach, describe, expect, it } from "vitest";
import {
  createApp,
  createEditorElement,
  createFilenameElement,
  createPreviewElement,
  removeApp,
} from "../main";

describe("Main", () => {
  afterEach(() => {
    clearMocks();
  });

  it("should create the app", () => {
    createApp();
    const app = document.getElementById("app");
    expect(app).toBeTruthy();
  });

  it("should create an h1 element with id 'filename'", () => {
    const filenameElement = createFilenameElement();
    expect(filenameElement.tagName).toBe("H1");
    expect(filenameElement.getAttribute("id")).toBe("filename");
  });

  it("should create a div element with id 'editor' and contentEditable set to true", () => {
    const editorElement = createEditorElement();
    expect(editorElement.tagName).toBe("DIV");
    expect(editorElement.getAttribute("id")).toBe("editor");
    expect(editorElement.contentEditable).toBe("true");
  });

  it("should create a div element with id 'preview'", () => {
    const previewElement = createPreviewElement();
    expect(previewElement.tagName).toBe("DIV");
    expect(previewElement.getAttribute("id")).toBe("preview");
  });

  it("should remove the app", () => {
    removeApp();
    const app = document.getElementById("app");
    expect(app).toBeFalsy();
  });
});
