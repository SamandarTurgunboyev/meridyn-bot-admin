import type { ObjectListData } from "@/features/objects/lib/data";
import { userStore } from "@/shared/hooks/user";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Eye, Loader2, Pencil, Trash2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  filteredData: ObjectListData[] | [];
  setDetail: Dispatch<SetStateAction<ObjectListData | null>>;
  setDetailDialog: Dispatch<SetStateAction<boolean>>;
  setEditingPlan: Dispatch<SetStateAction<ObjectListData | null>>;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  handleDelete: (object: ObjectListData) => void;
  isLoading: boolean;
  isError: boolean;
}

const ObjectTable = ({
  filteredData,
  setDetail,
  setDetailDialog,
  setEditingPlan,
  handleDelete,
  setDialogOpen,
  isError,
  isLoading,
}: Props) => {
  const { user: getme } = userStore();
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
              <TableHead>#</TableHead>
              <TableHead>Obyekt nomi</TableHead>
              <TableHead>Tuman</TableHead>
              <TableHead>Foydalanuvchi</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.district.name}</Badge>
                  </TableCell>
                  <TableCell>
                    {item.user.first_name} {item.user.last_name}
                  </TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setDetail(item);
                        setDetailDialog(true);
                      }}
                      className="bg-green-600 text-white cursor-pointer hover:bg-green-600 hover:text-white"
                    >
                      <Eye size={18} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-blue-600 text-white cursor-pointer hover:bg-blue-600 hover:text-white"
                      onClick={() => {
                        setEditingPlan(item);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil size={18} />
                    </Button>
                    {getme?.is_superuser && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="cursor-pointer"
                        disabled={!getme?.is_superuser}
                        onClick={() => handleDelete(item)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-lg">
                  Obyekt topilmadi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ObjectTable;
