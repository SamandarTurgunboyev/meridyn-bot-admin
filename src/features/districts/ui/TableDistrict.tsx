import type { DistrictListData } from "@/features/districts/lib/data";
import { userStore } from "@/shared/hooks/user";
import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Edit, Loader2, Trash } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  data: DistrictListData[] | [];
  isLoading: boolean;
  isError: boolean;
  handleDelete: (user: DistrictListData) => void;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  setEditingDistrict: Dispatch<SetStateAction<DistrictListData | null>>;
  currentPage: number;
}

const TableDistrict = ({
  data,
  isError,
  isLoading,
  handleDelete,
  setDialogOpen,
  setEditingDistrict,
  currentPage,
}: Props) => {
  const { user } = userStore();

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

      {!isError && !isLoading && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tuman nomi</TableHead>
              <TableHead>Kim qo‘shgan</TableHead>
              <TableHead className="text-right">Harakatlar</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((d, index) => (
              <TableRow key={d.id}>
                <TableCell>{index + 1 + (currentPage - 1) * 20}</TableCell>
                <TableCell>{d.name}</TableCell>
                <TableCell>
                  {d.user.first_name} {d.user.last_name}
                </TableCell>
                <TableCell className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingDistrict(d);
                      setDialogOpen(true);
                    }}
                    className="bg-blue-500 text-white hover:text-white hover:bg-blue-500 cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {user?.is_superuser && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(d)}
                      disabled={!user?.is_superuser}
                      className="cursor-pointer"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  Hech qanday tuman topilmadi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TableDistrict;
