import type { LocationListType } from "@/features/location/lib/data";
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
  filtered: LocationListType[];
  setDetail: Dispatch<SetStateAction<LocationListType | null>>;
  setDetailDialog: Dispatch<SetStateAction<boolean>>;
  handleDelete: (id: number) => void;
}

const LocationTable = ({
  filtered,
  setDetail,
  setDetailDialog,
  handleDelete,
}: Props) => {
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
                {item.user.firstName} {item.user.lastName}
              </TableCell>
              <TableCell>
                {formatDate.format(item.createdAt, "DD-MM-YYYY")}
              </TableCell>

              <TableCell>
                {item.district
                  ? "Tuman"
                  : item.object
                    ? "Obyekt"
                    : item.doctor
                      ? "Shifokor"
                      : item.pharmcies
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
                <Button
                  variant="destructive"
                  size="icon"
                  className="cursor-pointer"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LocationTable;
