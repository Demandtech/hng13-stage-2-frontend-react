import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/config/axios";
import { TicketType, TicketStats } from "@/app/dashboard/page";
import { addToast } from "@heroui/toast";
import { AxiosError } from "axios";

const handleError = (error: unknown, title: string) => {
  let message = "An error occurred, please try again later!";
  if (error instanceof AxiosError) {
    message = error.response?.data?.message || message;
  }
  addToast({ title, description: message, color: "danger" });
};

export function useGetAllTickets() {
  return useQuery({
    queryKey: ["all-tickets"],
    queryFn: async (): Promise<{
      tickets: TicketType[];
      stats: TicketStats;
    }> => {
      const { data } = await axios.get("/tickets");
      return data;
    },
  });
}

export function useGetSingleTicket(id: string) {
  return useQuery({
    queryKey: ["single-ticket", id],
    queryFn: async (): Promise<TicketType> => {
      const { data } = await axios.get(`/tickets/${id}`);
      return data.ticket;
    },
    enabled: !!id,
  });
}

export function useCreateTicket(closeModal: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ticket: Partial<TicketType>) => {
      const { data } = await axios.post("/tickets", ticket);
      return data;
    },
    onSuccess: () => {
      addToast({
        title: "Ticket created successfully",
        description:
          "Ticket was created successfully, you can manage your ticket",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["all-tickets"] });
      closeModal();
    },
    onError: (error) => handleError(error, "Error creating ticket"),
  });
}

export function useUpdateTicket(closeModal: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ticket: Partial<TicketType>) => {
      const { data } = await axios.put(`/tickets/${ticket.id}`, ticket);
      return data;
    },
    onSuccess: (_data, variables) => {
      addToast({
        title: "Ticket updated successfully",
        description:
          "Ticket was updated successfully, you can manage your ticket",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["all-tickets"] });
      queryClient.invalidateQueries({
        queryKey: ["single-ticket", variables.id],
      });
      closeModal();
    },
    onError: (error) => handleError(error, "Error updating ticket"),
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { id: string; closeModal: () => void }) => {
      const { data } = await axios.delete(`/tickets/${variables.id}`);
      return data;
    },
    onSuccess: (_data, variables) => {
      const { closeModal } = variables;

      addToast({
        title: "Ticket deleted successfully",
        description: "Ticket was removed from the system",
        color: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["all-tickets"] });
      
      closeModal();
    },
    onError: (error) => handleError(error, "Error deleting ticket"),
  });
}
