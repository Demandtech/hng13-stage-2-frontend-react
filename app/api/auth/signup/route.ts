import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { readJSON, writeJSON } from "@/lib/storage";

const ACCESS_SECRET = process.env.JWT_SECRET || "secretkey";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";

export async function POST(req: Request) {
  const { email, password, confirm_password } = await req.json();

  if (!email || !password || !confirm_password)
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 422, statusText: "Unprocessable Entity" }
    );

  if (password !== confirm_password) {
    return NextResponse.json(
      { message: "Password does not match" },
      { status: 400, statusText: "Bad Request" }
    );
  }

  const users = readJSON("users.json");

  if (users.find((u: any) => u.email === email))
    return NextResponse.json(
      { message: "Email already exists" },
      { status: 409, statusText: "Conflict" }
    );

  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now().toString(), email, password: hashed, refreshToken: "" };

  const accessToken = jwt.sign(
    { id: newUser.id, email: newUser.email },
    ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign({ id: newUser.id }, REFRESH_SECRET, {
    expiresIn: "7d",
  });

  newUser.refreshToken = refreshToken;

  users.push(newUser);
  writeJSON("users.json", users);

  const { password: _, ...safeUser } = newUser;

  return NextResponse.json({
    message: "Signup successful",
    user: safeUser,
    tokens: {
      access_token: accessToken,
      refresh_token: refreshToken,
    },
  });
}
