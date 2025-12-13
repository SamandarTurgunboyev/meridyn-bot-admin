import { user_api } from "@/features/users/lib/api";
import type { UserListData, UserListRes } from "@/features/users/lib/data";
import { userStore } from "@/shared/hooks/user";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
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
  setUserList: Dispatch<SetStateAction<number[] | []>>;
  handleDelete: (user: UserListData) => void;
  currentPage: number;
  userList: number[] | null;
  sendMessage: boolean;
}

const UserTable = ({
  data,
  isLoading,
  isError,
  setDialogOpen,
  handleDelete,
  userList,
  setEditingUser,
  setUserList,
  sendMessage,
  currentPage,
}: Props) => {
  const queryClient = useQueryClient();
  const { user: getme } = userStore();
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);

  // TableHeader checkbox holati
  const allSelected = data?.data.data.results.length
    ? userList?.length === data.data.data.results.length
    : false;

  const { mutate: active } = useMutation({
    mutationFn: (id: number) => user_api.active(id),
    onMutate: (id) => setPendingUserId(id),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["user_list"] });
      toast.success(`Foydalanuvchi aktivlashdi`);
      setPendingUserId(null);
    },
    onError: (err: AxiosError) => {
      const errMessage = err.response?.data as { message: string };
      setPendingUserId(null);
      toast.error(errMessage?.message || "Xatolik yuz berdi", {
        richColors: true,
        position: "top-center",
      });
    },
  });

  const handleActivate = (userId: number) => active(userId);

  // TableHeader checkbox toggle
  const handleSelectAll = () => {
    if (!data) return;
    if (allSelected) {
      setUserList([]);
      setUserList([]);
    } else {
      const allIds = data.data.data.results.map((u) => u.id);
      setUserList(allIds);
      setUserList(allIds);
    }
  };

  // Individual checkbox toggle
  const handleSelect = (id: number) => {
    let updated: number[] = [];
    if (userList) {
      if (userList?.includes(id)) {
        updated = userList.filter((i) => i !== id);
      } else {
        updated = [...userList, id];
      }
      setUserList(updated);
      setUserList(updated.length ? updated : []);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      {isLoading && (
        <div className="h-full flex items-center justify-center bg-white/70 z-10">
          <Loader2 className="animate-spin" />
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
              {sendMessage && (
                <TableHead className="text-start">
                  <Checkbox
                    id="user_id_all"
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
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
                  {sendMessage && (
                    <TableCell className="text-start">
                      <Checkbox
                        id={`user_id_${user.id}`}
                        checked={userList?.includes(user.id)}
                        onCheckedChange={() => handleSelect(user.id)}
                      />
                    </TableCell>
                  )}
                  <TableCell>{index + 1 + (currentPage - 1) * 20}</TableCell>
                  <TableCell>
                    {user.first_name ? user.first_name : "No'malum"}
                  </TableCell>
                  <TableCell>
                    {user.last_name ? user.last_name : "No'malum"}
                  </TableCell>
                  <TableCell>
                    {user.region ? user.region.name : "No'malum"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      className={clsx(
                        "mx-auto cursor-pointer",
                        user.is_active
                          ? "bg-green-500 hover:bg-green-500"
                          : "bg-blue-500 hover:bg-blue-500",
                      )}
                      disabled={user.is_active || sendMessage}
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
                      disabled={sendMessage}
                      className="bg-blue-500 text-white hover:bg-blue-500 hover:text-white cursor-pointer"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {getme?.is_superuser && (
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={!getme?.is_superuser || sendMessage}
                        onClick={() => handleDelete(user)}
                        className="cursor-pointer"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-lg">
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
