
import { describe, expect, it } from "vitest";

import {
  File,
  resetFile,
  updateFile,
} from "../File"

describe("Main", () => {

    it("should reset the file", () => {
      const file: File = { path: "", text: "" };
  
      resetFile(file);
      expect(file.path).toBe("");
      expect(file.text).toBe("");
    });
  
    it("should update the file", () => {
      const file: File = { path: "oldPath", text: "oldText" };
  
      updateFile(file, "newPath", "newText");
      expect(file.path).toBe("newPath");
      expect(file.text).toBe("newText");
    })
});