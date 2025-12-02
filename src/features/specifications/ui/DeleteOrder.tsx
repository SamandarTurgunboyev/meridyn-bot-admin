import { order_api } from "@/features/specifications/lib/api";
import type { OrderListDataRes } from "@/features/specifications/lib/data";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2, Trash, X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

interface Props {
  opneDelete: boolean;
  setOpenDelete: Dispatch<SetStateAction<boolean>>;
  setPillDelete: Dispatch<SetStateAction<OrderListDataRes | null>>;
  pillDelete: OrderListDataRes | null;
}

const DeleteOrder = ({
  opneDelete,
  setOpenDelete,
  pillDelete,
  setPillDelete,
}: Props) => {
  const queryClient = useQueryClient();

  const { mutate: deleteUser, isPending } = useMutation({
    mutationFn: (id: number) => order_api.delete(id),

    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["order_list"] });
      toast.success(`Foydalanuvchi o'chirildi`);
      setOpenDelete(false);
      setPillDelete(null);
    },
    onError: (err: AxiosError) => {
      const errMessage = err.response?.data as { message: string };
      const messageText = errMessage.message;
      toast.error(messageText || "Xatolik yuz berdi", {
        richColors: true,
        position: "top-center",
      });
    },
  });

  return (
    <Dialog open={opneDelete} onOpenChange={setOpenDelete}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dorini o'chirish</DialogTitle>
          <DialogDescription className="text-md font-semibold">
            Siz rostan ham bu zakazni o'chirmoqchimisiz
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            className="bg-blue-600 cursor-pointer hover:bg-blue-600"
            onClick={() => setOpenDelete(false)}
          >
            <X />
            Bekor qilish
          </Button>
          <Button
            variant={"destructive"}
            onClick={() => pillDelete && deleteUser(pillDelete.id)}
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Trash />
                O'chirish
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteOrder;
