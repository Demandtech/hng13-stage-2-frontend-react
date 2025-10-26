import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabaseClient";

const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";

export async function POST(req: Request) {
  try {
    const { refresh_token } = await req.json();

    if (!refresh_token) {
      return NextResponse.json(
        { error: "Refresh token is required" },
        { status: 400 }
      );
    }

    const decoded = jwt.verify(refresh_token, REFRESH_SECRET) as {
      id: string;
    };

    if (!decoded?.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", decoded.id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ refresh_token: null })
      .eq("id", user.id);

    if (updateError) {
      console.error("Failed to clear refresh token:", updateError);
      return NextResponse.json(
        { error: "Could not complete logout" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
