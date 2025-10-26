import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabaseClient";
import type { TicketType, TicketStats } from "@/app/dashboard/page";

const SECRET = process.env.JWT_SECRET || "secretkey";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) {
    return NextResponse.json({ message: "No token" }, { status: 401 });
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, SECRET) as { id: string; email: string };

    const { title, description, status, priority } = await req.json();

    if (!title) {
      return NextResponse.json(
        { message: "Title required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("tickets")
      .insert({
        title,
        description,
        status,
        priority,
        owner: decoded.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Ticket insert error:", error);
      return NextResponse.json(
        { message: "Failed to create ticket", error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Ticket created",
      ticket: data,
    });
  } catch (err) {
    console.error("Token error:", err);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}


export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) {
    return NextResponse.json({ message: "No token" }, { status: 401 });
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, SECRET) as { id: string };

    const { data: tickets, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("owner", decoded.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch tickets error:", error);
      return NextResponse.json(
        { message: "Failed to fetch tickets", error },
        { status: 500 }
      );
    }

    const stats = (tickets || []).reduce(
      (acc: TicketStats, ticket: TicketType) => {
        acc.total += 1;
        if (ticket.status in acc) acc[ticket.status] += 1;
        return acc;
      },
      { total: 0, open: 0, in_progress: 0, closed: 0 } as TicketStats
    );

    return NextResponse.json({
      message: "Tickets fetched successfully",
      tickets,
      stats,
    });
  } catch (err) {
    console.error("Token error:", err);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
