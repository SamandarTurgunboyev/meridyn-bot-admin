import { user_api } from "@/features/users/lib/api";
import type { UserListData } from "@/features/users/lib/data";
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
  setUserDelete: Dispatch<SetStateAction<UserListData | null>>;
  userDelete: UserListData | null;
}

const DeleteUser = ({
  opneDelete,
  setOpenDelete,
  userDelete,
  setUserDelete,
}: Props) => {
  const queryClient = useQueryClient();

  const { mutate: deleteUser, isPending } = useMutation({
    mutationFn: ({ id }: { id: number }) => user_api.delete({ id }),

    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["user_list"] });
      toast.success(`Foydalanuvchi o'chirildi`);
      setOpenDelete(false);
      setUserDelete(null);
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
          <DialogTitle>Foydalanuvchini o'chrish</DialogTitle>
          <DialogDescription className="text-md font-semibold">
            Siz rostan ham {userDelete?.first_name} {userDelete?.last_name}{" "}
            nomli foydalanuvchini o'chimoqchimiszi
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
            onClick={() => userDelete && deleteUser({ id: userDelete.id })}
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

export default DeleteUser;
