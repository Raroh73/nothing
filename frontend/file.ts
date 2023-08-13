
export interface File {
    path: string;
    text: string;
  }

export function updateFile(file: File, path: string, text: string) {
    file.path = path;
    file.text = text;
}

export function resetFile(file: File) {
    updateFile(file, "", "")
}