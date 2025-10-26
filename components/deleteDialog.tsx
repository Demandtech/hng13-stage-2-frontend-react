import React, { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { useDeleteTicket } from "@/hooks/useTicket";
import { Spinner } from "@heroui/spinner";
export default function DeleteDialog({
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

  const handleClose = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("ticket_id");

    router.replace(`${pathname}?${params.toString()}`);
    onClose();
  }, [router, pathname, searchParams, onClose]);

  const deleteMutation = useDeleteTicket();

  const handleDeleteTicket = () => {
    const id = searchParams.get("ticket_id");

    if (!id) return;
    deleteMutation.mutate({ id, closeModal: handleClose });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
        else onOpenChange();
      }}
    >
      <ModalContent>
        <ModalHeader className="flex-col items-start">
          Are you sure?
        </ModalHeader>
        <ModalBody>
          <p className="text-muted-foreground">
            This action cannot be undone. This will permanently delete the
            ticket
          </p>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-end gap-4">
            <Button onPress={handleClose} variant="bordered">
              Cancel
            </Button>
            <Button
              onPress={() => handleDeleteTicket()}
              color="danger"
              variant="solid"
              disabled={deleteMutation.isPending}
              isDisabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Spinner
                  size="sm"
                  classNames={{
                    spinnerBars: "bg-white text-white",
                  }}
                  variant="spinner"
                />
              )}
              Delete
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
