"use client";

import { TicketType, TicketStatus, TicketPiority } from "@/app/dashboard/page";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useCallback } from "react";
import { Trash, Calendar, Edit } from "@/components/icons";
import { Button } from "@heroui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDisclosure } from "@heroui/modal";
import DeleteDialog from "./deleteDialog";

export default function TicketCard({
  ticket,
  onEditOpen,
}: {
  ticket: TicketType;
  onEditOpen: () => void;
}) {
  const {
    isOpen,
    onOpen: onDeleteOpen,
    onOpenChange,
    onClose,
  } = useDisclosure();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const getPriorityColor = (priority: TicketPiority) => {
    const colors = {
      low: "text-muted-foreground",
      medium: "text-status-progress",
      high: "text-destructive",
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusLabel = (status: TicketStatus) => {
    const labels = {
      open: "Open",
      in_progress: "In Progress",
      closed: "Closed",
    };
    return labels[status];
  };

  const getStatusColor = (status: TicketStatus) => {
    const colors = {
      open: "text-status-open bg-status-open-bg border-status-open-border",
      in_progress:
        "text-status-progress bg-status-progress-bg border-status-progress-border",
      closed:
        "text-status-closed bg-status-closed-bg border-status-closed-border",
    };

    return colors[status as keyof typeof colors];
  };

  const createQuery = useCallback(
    (ticket_id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("ticket_id", ticket_id);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handleEdit = useCallback(
    (ticket_id: string) => {
      createQuery(ticket_id);
      onEditOpen();
    },
    [onEditOpen]
  );

  const handleDelete = useCallback(
    (ticket_id: string) => {
      createQuery(ticket_id);
      onDeleteOpen();
    },
    [onDeleteOpen]
  );

  return (
    <Card
      key={ticket.id}
      className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 flex flex-col border-border"
    >
      <CardHeader className="justify-between pb-0">
        <div
          className={`${getStatusColor(ticket.status)} py-1 px-3 text-xs border-1.5 rounded-xl`}
        >
          {getStatusLabel(ticket.status)}
        </div>

        {ticket.priority && (
          <span
            className={`text-xs font-medium uppercase ${getPriorityColor(ticket.priority)}`}
          >
            {ticket.priority}
          </span>
        )}
      </CardHeader>
      <CardBody className="flex-1 flex flex-col justify-between">
        <h3 className="line-clamp-2 font-bold text-2xl">{ticket.title}</h3>
        <p className="line-clamp-3 text-muted-foreground pb-2">
          {ticket.description || "No description provided"}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Calendar className="w-3 h-3" />
          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="bordered"
            size="sm"
            className="flex-1"
            onPress={() => handleEdit(ticket.id)}
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="solid"
            color="danger"
            size="sm"
            onPress={() => handleDelete(ticket.id)}
          >
            <Trash className="w-3 h-3" />
          </Button>
        </div>
      </CardBody>
      <DeleteDialog
        onClose={onClose}
        onOpenChange={onOpenChange}
        isOpen={isOpen}
      />
    </Card>
  );
}
