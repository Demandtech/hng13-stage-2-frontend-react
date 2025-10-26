import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { readJSON, writeJSON } from "@/lib/storage";

const ACCESS_SECRET = process.env.JWT_SECRET || "secretkey";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const users = readJSON("users.json");
  const user = users.find((u: any) => u.email === email);

  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 404 });



  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 400 }
    );


  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );
  const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, {
    expiresIn: "7d",
  });

  user.refreshToken = refreshToken;
  writeJSON("users.json", users);

  const res = NextResponse.json({
    message: "Signin successful",
    tokens: { access_token: accessToken, refresh_token: refreshToken },
  });
  return res;
}
