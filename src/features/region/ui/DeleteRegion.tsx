import { region_api } from "@/features/region/lib/api";
import type { RegionListResData } from "@/features/region/lib/data";
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
  setRegionDelete: Dispatch<SetStateAction<RegionListResData | null>>;
  regionDelete: RegionListResData | null;
}

const DeleteRegion = ({
  opneDelete,
  setOpenDelete,
  setRegionDelete,
  regionDelete,
}: Props) => {
  const queryClient = useQueryClient();

  const { mutate: deleteRegion, isPending } = useMutation({
    mutationFn: (id: number) => region_api.delete(id),

    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["region_list"] });
      toast.success(`Foydalanuvchi o'chirildi`);
      setOpenDelete(false);
      setRegionDelete(null);
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
          <DialogTitle>Foydalanuvchini o'chrish</DialogTitle>
          <DialogDescription className="text-md font-semibold">
            Siz rostan ham {regionDelete?.name} hududini o'chimoqchimiszi
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
            onClick={() => regionDelete && deleteRegion(regionDelete.id)}
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

export default DeleteRegion;
