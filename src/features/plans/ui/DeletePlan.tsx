import { plans_api } from "@/features/plans/lib/api";
import type { PlanListData } from "@/features/plans/lib/data";
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
  setPlanDelete: Dispatch<SetStateAction<PlanListData | null>>;
  planDelete: PlanListData | null;
}

const DeletePlan = ({
  opneDelete,
  setOpenDelete,
  planDelete,
  setPlanDelete,
}: Props) => {
  const queryClient = useQueryClient();

  const { mutate: deleteUser, isPending } = useMutation({
    mutationFn: (id: number) => plans_api.delete(id),

    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["plan_list"] });
      toast.success(`Foydalanuvchi o'chirildi`);
      setOpenDelete(false);
      setPlanDelete(null);
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
          <DialogTitle>Rejani o'chirish</DialogTitle>
          <DialogDescription className="text-md font-semibold">
            Siz rostan ham {planDelete?.user.first_name}{" "}
            {planDelete?.user.last_name} ha tegishli rejani o'chirmoqchimisiz
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
            onClick={() => planDelete && deleteUser(planDelete.id)}
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

export default DeletePlan;
