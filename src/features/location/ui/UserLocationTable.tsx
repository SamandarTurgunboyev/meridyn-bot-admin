import type { LocationListDataRes } from "@/features/location/lib/data";
import { userStore } from "@/shared/hooks/user";
import formatDate from "@/shared/lib/formatDate";
import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Eye, Trash2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  filtered: LocationListDataRes[] | [];
  setDetail: Dispatch<SetStateAction<LocationListDataRes | null>>;
  setDetailDialog: Dispatch<SetStateAction<boolean>>;
  handleDelete: (id: LocationListDataRes) => void;
}

const UserLocationTable = ({
  filtered,
  setDetail,
  setDetailDialog,
  handleDelete,
}: Props) => {
  const { user: getme } = userStore();
  return (
    <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Jo'natgan foydalanuvchi</TableHead>
            <TableHead>Jo'natgan vaqti</TableHead>
            <TableHead>Qayerdan jo'natdi</TableHead>
            <TableHead className="text-right">Amallar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {item.user.first_name} {item.user.last_name}
              </TableCell>
              <TableCell>
                {formatDate.format(item.created_at, "DD-MM-YYYY")}
              </TableCell>

              <TableCell>
                {item.district
                  ? "Tuman"
                  : item.place
                    ? "Obyekt"
                    : item.doctor
                      ? "Shifokor"
                      : item.pharmacy
                        ? "Dorixona"
                        : "Turgan joyidan"}
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
                {getme?.is_superuser && (
                  <Button
                    variant="destructive"
                    size="icon"
                    disabled={!getme?.is_superuser}
                    className="cursor-pointer"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 size={18} />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserLocationTable;
