import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";
import { TicketStatus, TicketPiority } from "@/app/dashboard/page";
import { motion, AnimatePresence } from "framer-motion";
import { Form } from "@heroui/form";
import {
  useCreateTicket,
  useGetSingleTicket,
  useUpdateTicket,
} from "@/hooks/useTicket";
import { Spinner } from "@heroui/spinner";

export default function TicketModal({
  isOpen,
  onOpenChange,
  onClose,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [mode, setMode] = useState<"create" | "edit">("create");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "open" as TicketStatus,
    priority: "low" as TicketPiority,
  });

  const handleClose = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("ticket_id");
    router.replace(`${pathname}?${params.toString()}`);
    onClose();
  }, [router, pathname, searchParams, onClose]);

  const createTicketMutation = useCreateTicket(handleClose);
  const updateTicketMutaion = useUpdateTicket(handleClose);
  const { data, isLoading: ticketLoading } = useGetSingleTicket(
    searchParams.get("ticket_id") as string
  );

  useEffect(() => {
    if (!isOpen) return;

    const id = searchParams.get("ticket_id");
    const isEdit = !!id;
    setMode(isEdit ? "edit" : "create");

    setFormData({
      title: "",
      description: "",
      status: "open",
      priority: "medium",
    });

    if (isEdit) {
      if (!data) return;

      setFormData({
        title: data?.title as string,
        description: data?.description as string,
        status: data?.status as TicketStatus,
        priority: data.priority as TicketPiority,
      });
    }
  }, [isOpen, searchParams, data]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (mode === "create") {
      createTicketMutation.mutate(formData);
    } else {
      const id = searchParams.get("ticket_id");

      if (!id) return;

      updateTicketMutaion.mutate({ ...formData, id });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
        else onOpenChange();
      }}
    >
      <ModalContent>
        <Form onSubmit={handleSubmit}>
          <ModalHeader className="flex-col items-start">
            <Skeleton isLoaded={!ticketLoading} className="h-6 rounded-lg mb-1">
              <h4>{mode === "edit" ? "Edit Ticket" : "Create New Ticket"}</h4>
            </Skeleton>

            <Skeleton isLoaded={!ticketLoading} className="h-4 rounded-md">
              <p className="text-sm font-normal text-muted-foreground">
                {mode === "edit"
                  ? "Update the ticket details below."
                  : "Fill in the details to create a new ticket."}
              </p>
            </Skeleton>
          </ModalHeader>

          <ModalBody className="w-full">
            {ticketLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
                <div className="flex gap-4">
                  <Skeleton className="h-12 flex-1 rounded-lg" />
                  <Skeleton className="h-12 flex-1 rounded-lg" />
                </div>
              </div>
            ) : (
              <AnimatePresence>
                <motion.article
                  key="ticket-form"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-4"
                >
                  <Input
                    isRequired
                    id="title"
                    label="Title"
                    placeholder="Enter ticket title"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                    }}
                    validate={(value) => {
                      if (value.length < 10) {
                        return "Username must be at least 10 characters long";
                      }
                    }}
                  />

                  <Textarea
                    isRequired
                    id="description"
                    label="Description"
                    placeholder="Enter ticket description"
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      });
                    }}
                    validate={(value) => {
                      if (value.length < 50) {
                        return "Username must be at least 50 characters long";
                      }
                    }}
                    className="w-full"
                  />

                  <div className="flex gap-4 w-full">
                    <Select
                      isRequired
                      label="Status"
                      selectedKeys={[formData.status]}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys).join("");
                        setFormData({
                          ...formData,
                          status: selected as TicketStatus,
                        });
                      }}
                      validate={(value) => {
                        if (!value) return "Status is required.";
                      }}
                      className="w-full"
                    >
                      <SelectItem key="open">Open</SelectItem>
                      <SelectItem key="in_progress">In Progress</SelectItem>
                      <SelectItem key="closed">Closed</SelectItem>
                    </Select>

                    <Select
                      isRequired
                      label="Priority"
                      selectedKeys={[formData.priority]}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys).join("");
                        setFormData({
                          ...formData,
                          priority: selected as TicketPiority,
                        });
                      }}
                      validate={(value) => {
                        if (!value) return "Priority is required.";
                      }}
                    >
                      <SelectItem key="low">Low</SelectItem>
                      <SelectItem key="medium">Medium</SelectItem>
                      <SelectItem key="high">High</SelectItem>
                    </Select>
                  </div>
                </motion.article>
              </AnimatePresence>
            )}
          </ModalBody>

          <ModalFooter className="w-full">
            <Button type="reset" onPress={handleClose} variant="bordered">
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="solid"
              isDisabled={
                updateTicketMutaion.isPending || createTicketMutation.isPending
              }
              disabled={
                updateTicketMutaion.isPending || createTicketMutation.isPending
              }
            >
              {(updateTicketMutaion.isPending ||
                createTicketMutation.isPending) && (
                <Spinner
                  size="sm"
                  classNames={{
                    spinnerBars: "bg-white text-white",
                  }}
                  variant="spinner"
                />
              )}
              {mode === "edit" ? "Save Changes" : "Create Ticket"}
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
}
