import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { readJSON, writeJSON } from "@/lib/storage";

const ACCESS_SECRET = process.env.JWT_SECRET || "secretkey";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { refresh_token } = body;

    if (!refresh_token) {
      return NextResponse.json(
        { message: "Refresh token missing" },
        { status: 400, statusText: "Bad Request" }
      );
    }

    const decoded = jwt.verify(refresh_token, REFRESH_SECRET) as { id: string };

    const users = readJSON("users.json");
    const user = users.find((u: any) => u.id === decoded.id);

    if (!user || user.refreshToken !== refresh_token) {
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 403, statusText: "Forbidden" }
      );
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    user.refreshToken = newRefreshToken;
    writeJSON("users.json", users);

    const res = NextResponse.json({
      message: "Token refreshed",
      tokens: {
        access_token: accessToken,
        refresh_token: newRefreshToken,
      },
    });

    return res;
  } catch (err: any) {
    console.error("Refresh error:", err);
    return NextResponse.json(
      { message: "Invalid or expired refresh token" },
      { status: 403, statusText: "Forbidden" }
    );
  }
}
