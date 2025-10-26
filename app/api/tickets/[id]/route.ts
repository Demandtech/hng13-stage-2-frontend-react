import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabaseClient";

const SECRET = process.env.JWT_SECRET || "secretkey";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ message: "No token" }, { status: 401 });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, SECRET) as { id: string };
    const id = req.url.split("/").pop();

    const { data: ticket, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !ticket)
      return NextResponse.json(
        { message: "Ticket not found" },
        { status: 404 }
      );

    if (ticket.owner !== decoded.id)
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    return NextResponse.json({
      message: "Ticket found",
      ticket,
    });
  } catch (err) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ message: "No token" }, { status: 401 });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, SECRET) as { id: string };
    const id = req.url.split("/").pop();
    const { title, description, status, priority } = await req.json();

    // Ensure the ticket exists and belongs to user
    const { data: ticket, error: fetchError } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", id)
      .eq("owner", decoded.id)
      .single();

    if (fetchError || !ticket)
      return NextResponse.json(
        { message: "Ticket not found" },
        { status: 404 }
      );

    if (ticket.owner !== decoded.id)
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    const { data: updated, error: updateError } = await supabase
      .from("tickets")
      .update({
        title,
        description,
        status,
        priority,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json(
        { message: "Failed to update ticket" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Ticket updated successfully",
      ticket: updated,
    });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}

export async function DELETE(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ message: "No token" }, { status: 401 });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, SECRET) as { id: string };
    const id = req.url.split("/").pop();

    // Ensure it belongs to the user
    const { data: ticket, error: fetchError } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", id)
      .eq("owner", decoded.id)
      .single();

    if (fetchError || !ticket)
      return NextResponse.json(
        { message: "Ticket not found" },
        { status: 404 }
      );

    if (ticket.owner !== decoded.id)
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    const { error: deleteError } = await supabase
      .from("tickets")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return NextResponse.json(
        { message: "Failed to delete ticket" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
