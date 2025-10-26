import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { readJSON } from "@/lib/storage";

const SECRET = process.env.JWT_SECRET || "secretkey";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");

  if (!auth) {
    return NextResponse.json(
      { message: "Authorization token missing" },
      { status: 401, statusText: "Unauthorized" }
    );
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, SECRET) as { id: string; email: string };

    const users = readJSON("users.json");
    const user = users.find((u: any) => u.id === decoded.id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404, statusText: "Not Found" }
      );
    }

    const { password: _, ...safeUser } = user;

    return NextResponse.json(
      { message: "Authenticated user fetched", user: safeUser },
      { status: 200, statusText: "Success" }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401, statusText: "Unauthorized" }
    );
  }
}
