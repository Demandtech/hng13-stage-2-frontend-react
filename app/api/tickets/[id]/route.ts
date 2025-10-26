import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { readJSON, writeJSON } from "@/lib/storage";

const SECRET = process.env.JWT_SECRET || "secretkey";

export async function PUT(
  req: Request
) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ message: "No token" }, { status: 401 });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, SECRET) as any;

    const { title, description, status, priority } = await req.json();
    const tickets = readJSON("tickets.json");

    const pathname = new URL(req.url).pathname;
    const id = pathname.split("/").pop();

    const index = tickets.findIndex((t: any) => t.id === id);
    if (index === -1)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    const ticket = tickets[index];
    if (ticket.userId !== decoded.id)
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    tickets[index] = { ...ticket, title, description, status, priority };
    writeJSON("tickets.json", tickets);

    return NextResponse.json({ message: "Updated", ticket: tickets[index] });
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}

export async function DELETE(
  req: Request
) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ message: "No token" }, { status: 401 });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, SECRET) as any;

    const pathname = new URL(req.url).pathname;
    const id = pathname.split("/").pop();

    const tickets = readJSON("tickets.json");
    const index = tickets.findIndex((t: any) => t.id === id);
    if (index === -1)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    const ticket = tickets[index];
    if (ticket.userId !== decoded.id)
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    tickets.splice(index, 1);
    writeJSON("tickets.json", tickets);

    return NextResponse.json({ message: "Deleted successfully" });
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ message: "No token" }, { status: 401 });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, SECRET) as any;

    const pathname = new URL(req.url).pathname;
    const id = pathname.split("/").pop();

    const tickets = readJSON("tickets.json");
    const ticket = tickets.find((t: any) => t.id === id);

    if (!ticket)
      return NextResponse.json(
        { message: "Ticket not found" },
        { status: 404 }
      );

    if (ticket.userId !== decoded.id)
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    return NextResponse.json({ message: "Ticket found", ticket });
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
