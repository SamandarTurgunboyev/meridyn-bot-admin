import { location_api } from "@/features/location/lib/api";
import type { LocationListDataRes } from "@/features/location/lib/data";
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
  setLocationDelete: Dispatch<SetStateAction<LocationListDataRes | null>>;
  locationDelete: LocationListDataRes | null;
  viewLocation: "user_send" | "user_send_object";
}
const DeleteLocation = ({
  opneDelete,
  viewLocation,
  locationDelete,
  setOpenDelete,
  setLocationDelete,
}: Props) => {
  const queryClient = useQueryClient();

  const { mutate: deleteUser, isPending } = useMutation({
    mutationFn: (id: number) => location_api.delete(id),

    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["location_list"] });
      toast.success(`Jo'natilgan lokatsiya o'chirildi`);
      setOpenDelete(false);
      setLocationDelete(null);
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

  const { mutate: deleteUserLocation, isPending: deleteUserLocationPen } =
    useMutation({
      mutationFn: (id: number) => location_api.list_user_location_delete(id),

      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["user_location_list"] });
        toast.success(`Jo'natilgan lokatsiya o'chirildi`);
        setOpenDelete(false);
        setLocationDelete(null);
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
            Siz rostan ham jo'natilgan lokatsiyani o'chirmoqchimisiz
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
            onClick={() =>
              locationDelete && viewLocation === "user_send_object"
                ? deleteUser(locationDelete.id)
                : locationDelete &&
                  viewLocation === "user_send" &&
                  deleteUserLocation(locationDelete.id)
            }
          >
            {isPending || deleteUserLocationPen ? (
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

export default DeleteLocation;
