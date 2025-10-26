import fs from "fs";
import path from "path";

export function readJSON(file: string) {
  const filePath = path.join(process.cwd(), "data", file);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function writeJSON(file: string, data: any) {
  const filePath = path.join(process.cwd(), "data", file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}
