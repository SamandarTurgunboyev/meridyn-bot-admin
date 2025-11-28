import { user_api } from "@/features/users/lib/api";
import type { UserListData, UserListRes } from "@/features/users/lib/data";
import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import clsx from "clsx";
import { Edit, Loader2, Trash } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

interface Props {
  data: AxiosResponse<UserListRes> | undefined;
  isLoading: boolean;
  isError: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  setEditingUser: Dispatch<SetStateAction<UserListData | null>>;
  handleDelete: (user: UserListData) => void;
  currentPage: number;
}

const UserTable = ({
  data,
  isLoading,
  isError,
  setDialogOpen,
  handleDelete,
  setEditingUser,
  currentPage,
}: Props) => {
  const queryClient = useQueryClient();

  const [pendingUserId, setPendingUserId] = useState<number | null>(null);

  const { mutate: active } = useMutation({
    mutationFn: (id: number) => user_api.active(id),
    onMutate: (id) => {
      setPendingUserId(id);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["user_list"] });
      toast.success(`Foydalanuvchi aktivlashdi`);
      setPendingUserId(null);
    },
    onError: (err: AxiosError) => {
      const errMessage = err.response?.data as { message: string };
      const messageText = errMessage.message;
      setPendingUserId(null);
      toast.error(messageText || "Xatolik yuz berdi", {
        richColors: true,
        position: "top-center",
      });
    },
  });

  const handleActivate = (userId: number) => {
    active(userId);
  };

  return (
    <div className="flex-1 overflow-auto">
      {isLoading && (
        <div className="h-full flex items-center justify-center bg-white/70 z-10">
          <span className="text-lg font-medium">
            <Loader2 className="animate-spin" />
          </span>
        </div>
      )}

      {isError && (
        <div className="h-full flex items-center justify-center z-10">
          <span className="text-lg font-medium text-red-600">
            Ma'lumotlarni olishda xatolik yuz berdi.
          </span>
        </div>
      )}
      {!isLoading && !isError && (
        <Table>
          <TableHeader>
            <TableRow className="text-[16px] text-center">
              <TableHead className="text-start">ID</TableHead>
              <TableHead className="text-start">Ismi</TableHead>
              <TableHead className="text-start">Familiyasi</TableHead>
              <TableHead className="text-start">Hududi</TableHead>
              <TableHead className="text-center">Holati</TableHead>
              <TableHead className="text-right">Harakatlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.data.data.results.length > 0 ? (
              data.data.data.results.map((user, index) => (
                <TableRow key={user.id} className="text-[14px] text-start">
                  <TableCell>{index + 1 + (currentPage - 1) * 20}</TableCell>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>{user.region.name}</TableCell>
                  <TableCell className="text-center">
                    {/* <Select
                      value={user.is_active ? "true" : "false"}
                      onValueChange={() => handleActivate(user.id)}
                    >
                      <SelectTrigger
                        className={clsx(
                          "w-[180px] mx-auto",
                          user.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800",
                        )}
                      >
                        {pendingUserId === user.id ? (
                          <Loader2 className="animate-spin h-4 w-4 mx-auto" />
                        ) : (
                          <SelectValue placeholder="Holati" />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          disabled={pendingUserId === user.id}
                          value="true"
                          className="text-green-500 hover:!text-green-500"
                        >
                          {pendingUserId === user.id ? (
                            <Loader2 className="animate-spin h-4 w-4 mx-auto" />
                          ) : (
                            "Faol"
                          )}
                        </SelectItem>
                        <SelectItem
                          disabled={pendingUserId === user.id}
                          value="false"
                          className="text-red-500 hover:!text-red-500"
                        >
                          {pendingUserId === user.id ? (
                            <Loader2 className="animate-spin h-4 w-4 mx-auto" />
                          ) : (
                            "Faol emas"
                          )}
                        </SelectItem>
                      </SelectContent>
                    </Select> */}
                    <Button
                      className={clsx(
                        "mx-auto cursor-pointer",
                        user.is_active
                          ? "bg-green-500 hover:bg-green-500"
                          : "bg-blue-500  hover:bg-blue-500",
                      )}
                      disabled={user.is_active}
                      onClick={() => handleActivate(user.id)}
                    >
                      {pendingUserId === user.id ? (
                        <Loader2 className="animate-spin h-4 w-4 mx-auto" />
                      ) : (
                        <>{user.is_active ? "Tasdiqlangan" : "Tasdiqlash"}</>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingUser(user);
                        setDialogOpen(true);
                      }}
                      className="bg-blue-500 text-white hover:bg-blue-500 hover:text-white cursor-pointer"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user)}
                      className="cursor-pointer"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-lg">
                  Foydalanuvchilar topilmadi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default UserTable;
