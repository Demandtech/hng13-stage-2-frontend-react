import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { readJSON, writeJSON } from "@/lib/storage";

const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";

export async function POST(req: Request) {
  const { refresh_token } = await req.json();

  const res = NextResponse.json({ message: "Logout successful" });

  if (refresh_token) {
    try {
      const decoded = jwt.verify(refresh_token, REFRESH_SECRET) as {
        id: string;
      };
      const users = readJSON("users.json");
      const user = users.find((u: any) => u.id === decoded.id);
      if (user) {
        user.refreshToken = null;
        writeJSON("users.json", users);
      }
    } catch {}
  }
  return res;
}
