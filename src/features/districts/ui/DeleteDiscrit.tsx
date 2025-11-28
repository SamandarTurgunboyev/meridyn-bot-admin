import { discrit_api } from "@/features/districts/lib/api";
import type { DistrictListData } from "@/features/districts/lib/data";
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
import { type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

interface Props {
  opneDelete: boolean;
  setOpenDelete: Dispatch<SetStateAction<boolean>>;
  setDiscritDelete: Dispatch<SetStateAction<DistrictListData | null>>;
  discrit: DistrictListData | null;
}

const DeleteDiscrit = ({
  opneDelete,
  setOpenDelete,
  setDiscritDelete,
  discrit,
}: Props) => {
  const queryClient = useQueryClient();

  const { mutate: deleteDiscrict, isPending } = useMutation({
    mutationFn: (id: number) => discrit_api.delete(id),

    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["discrit_list"] });
      toast.success(`Tuman o'chirildi`);
      setOpenDelete(false);
      setDiscritDelete(null);
    },
    onError: (err: AxiosError) => {
      console.log(err);
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
          <DialogTitle>Tumanni o'chirish</DialogTitle>
          <DialogDescription className="text-md font-semibold">
            Siz rostan ham {discrit?.user.first_name} {discrit?.user.last_name}{" "}
            ga tegishli {discrit?.name} tumanini o'chirmoqchimisiz
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
            onClick={() => discrit && deleteDiscrict(discrit.id)}
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

export default DeleteDiscrit;
