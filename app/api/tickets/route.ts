import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { readJSON, writeJSON } from "@/lib/storage";
import { TicketType, TicketStats } from "@/app/dashboard/page";

const SECRET = process.env.JWT_SECRET || "secretkey";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ message: "No token" }, { status: 401 });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, SECRET) as { id: string; email: string };

    const { title, description, status, priority } = await req.json();
    if (!title)
      return NextResponse.json({ message: "Title required" }, { status: 400 });

    const tickets = readJSON("tickets.json");
    const newTicket = {
      id: Date.now().toString(),
      title,
      description,
      userId: decoded.id,
      createdAt: new Date().toISOString(),
      status,
      priority,
    };

    tickets.push(newTicket);
    writeJSON("tickets.json", tickets);

    return NextResponse.json({ message: "Ticket created", ticket: newTicket });
  } catch (err) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ message: "No token" }, { status: 401 });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, SECRET) as any;

    const tickets = readJSON("tickets.json");
    const userTickets = tickets.filter((t: any) => t.userId === decoded.id);

    const stats = userTickets.reduce(
      (acc: TicketStats, ticket: TicketType) => {
        acc.total += 1;
        acc[ticket.status] += 1;
        return acc;
      },
      { total: 0, open: 0, in_progress: 0, closed: 0 } as TicketStats
    );

    return NextResponse.json({
      message: "Tickets fetched successfully",
      tickets: userTickets,
      stats,
    });
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
