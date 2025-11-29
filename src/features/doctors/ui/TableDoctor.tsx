import type { DoctorListResData } from "@/features/doctors/lib/data";
import formatPhone from "@/shared/lib/formatPhone";
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
  setDetail: Dispatch<SetStateAction<DoctorListResData | null>>;
  setDetailDialog: Dispatch<SetStateAction<boolean>>;
  doctor: DoctorListResData[] | [];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
}

const TableDoctor = ({
  doctor,
  setDetail,
  setDetailDialog,
  isError,
  isLoading,
  isFetching,
}: Props) => {
  return (
    <div className="flex-1 overflow-auto">
      {(isLoading || isFetching) && (
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
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Shifokor Ism Familiyasi</TableHead>
              <TableHead>Telefon raqami</TableHead>
              <TableHead>Tuman</TableHead>
              <TableHead>Obyekt</TableHead>
              <TableHead>Ish joyi</TableHead>
              <TableHead>Sohasi</TableHead>
              <TableHead>Kim qo'shgan</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctor.length > 0 ? (
              doctor.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {item.first_name} {item.last_name}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPhone(item.phone_number)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.district.name}</Badge>
                  </TableCell>
                  <TableCell>{item.place.name}</TableCell>
                  <TableCell>{item.work_place}</TableCell>
                  <TableCell>{item.sphere}</TableCell>
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
                        // setEditingPlan(item);
                        // setDialogOpen(true);
                      }}
                    >
                      <Pencil size={18} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="cursor-pointer"
                      // onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4 text-lg">
                  Shifokor topilmadi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TableDoctor;
