"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Ticket, CheckCircle, Clock, Plus, XCircle } from "@/components/icons";
import { useDisclosure } from "@heroui/modal";
import TicketCard from "@/components/ticketCard";
import TicketModal from "@/components/ticketModal";
import { useGetAllTickets } from "@/hooks/useTicket";
import { Skeleton } from "@heroui/skeleton";
import { Suspense } from "react";

export type TicketStatus = "open" | "in_progress" | "closed";
export type TicketPiority = "low" | "medium" | "high";

export interface TicketType {
  id: string;
  title: string;
  description?: string;
  status: TicketStatus;
  priority?: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}

export type TicketStats = {
  open: number;
  closed: number;
  in_progress: number;
  total: number;
};

const Dashboard = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { data, isLoading: ticketsLoading } = useGetAllTickets();

  console.log(data?.stats);

  return (
    <Suspense>
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 py-8 md:py-12">
          <div className="mx-auto max-w-[1440px] px-4 md:px-8">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h2>
              <p className="text-muted-foreground">
                Overview of your ticket management system
              </p>
            </div>

            {ticketsLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="shadow-md border-2 border-border">
                    <CardHeader className="flex flex-row items-center gap-2">
                      <Skeleton className="w-8 h-8 rounded-md" />
                      <Skeleton className="w-20 h-4" />
                    </CardHeader>
                    <CardBody>
                      <Skeleton className="w-12 h-8" />
                      <Skeleton className="w-32 h-3 mt-2" />
                    </CardBody>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="shadow-md border-2 border-border">
                  <CardHeader className="flex flex-row items-center  gap-2 ">
                    <div className="w-8 h-8 rounded-md bg-accent border-2 border-accent-foreground/20 flex items-center justify-center">
                      <Ticket className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Total Tickets
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <div className="text-3xl font-bold text-accent-foreground">
                      {data?.stats.total}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      All tickets in the system
                    </p>
                  </CardBody>
                </Card>

                <Card className="shadow-md border-2 border-border">
                  <CardHeader className="flex flex-row items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-status-open-bg border-2 border-status-open-border flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-status-open" />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Open Tickets
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <div className="text-3xl font-bold text-status-open">
                      {data?.stats.open}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Awaiting attention
                    </p>
                  </CardBody>
                </Card>

                <Card className="shadow-md border-2 border-border">
                  <CardHeader className="flex flex-row items-center gap-2 pb-2">
                    <div className="w-8 h-8 rounded-md bg-status-progress-bg border-2 border-status-progress-border flex items-center justify-center">
                      <Clock className="w-4 h-4 text-status-progress" />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      In Progress
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <div className="text-3xl font-bold text-status-progress">
                      {data?.stats.in_progress}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Currently being worked on
                    </p>
                  </CardBody>
                </Card>

                <Card className="shadow-md border-2 border-border">
                  <CardHeader className="flex flex-row items-center gap-2 pb-2">
                    <div className="w-8 h-8 rounded-md bg-status-closed-bg border-2 border-status-closed-border flex items-center justify-center">
                      <XCircle className="w-4 h-4 text-status-closed" />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Closed
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <div className="text-3xl font-bold text-status-closed">
                      {data?.stats.closed}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Resolved tickets
                    </p>
                  </CardBody>
                </Card>
              </div>
            )}

            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">
                    Tickets
                  </h2>
                  <p className="text-muted-foreground">
                    Manage all your tickets in one place
                  </p>
                </div>
                <Button
                  size="sm"
                  color="primary"
                  variant="solid"
                  onPress={onOpen}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Ticket
                </Button>
              </div>

              {ticketsLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card
                      key={i}
                      className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 flex flex-col border-border"
                    >
                      <CardHeader className="justify-between pb-0">
                        <Skeleton className="w-16 h-4 rounded-full" />
                        <Skeleton className="w-12 h-3 rounded-full" />
                      </CardHeader>
                      <CardBody className="flex-1 flex flex-col justify-between">
                        <Skeleton className="w-5/6 h-6 mb-2" />
                        <Skeleton className="w-full h-12 mb-2" />
                        <Skeleton className="w-24 h-4" />
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : data?.tickets?.length === 0 ? (
                <Card className="shadow-md border-2 border-border">
                  <CardBody className="flex flex-col items-center justify-center py-16">
                    <Ticket className="w-16 h-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      No tickets yet
                    </h3>
                    <p className="text-muted-foreground mb-6 text-center max-w-md">
                      Get started by creating your first ticket
                    </p>
                    <Button color="primary" variant="solid" onPress={onOpen}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Ticket
                    </Button>
                  </CardBody>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.tickets?.map((ticket: TicketType) => (
                    <TicketCard
                      onEditOpen={onOpen}
                      key={ticket.id}
                      ticket={ticket}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <TicketModal
        onOpenChange={onOpenChange}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Suspense>
  );
};

export default Dashboard;
