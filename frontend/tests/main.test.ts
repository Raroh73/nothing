import { clearMocks } from "@tauri-apps/api/mocks";
import { afterEach, describe, expect, it } from "vitest";
import { createApp, removeApp } from "../main";

describe("Main", () => {
  afterEach(() => {
    clearMocks();
  });

  it("should create the app", () => {
    createApp();
    const app = document.getElementById("app");
    expect(app).toBeTruthy();
  });

  it("should remove the app", () => {
    removeApp();
    const app = document.getElementById("app");
    expect(app).toBeFalsy();
  });
});
