import type { PharmaciesListData } from "@/features/pharmacies/lib/data";
import formatPhone from "@/shared/lib/formatPhone";
import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  filteredData: PharmaciesListData[];
  setDetail: Dispatch<SetStateAction<PharmaciesListData | null>>;
  setEditingPlan: Dispatch<SetStateAction<PharmaciesListData | null>>;
  setDetailDialog: Dispatch<SetStateAction<boolean>>;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  handleDelete: (pharmacies: PharmaciesListData) => void;
}

const PharmaciesTable = ({
  filteredData,
  setDetail,
  setEditingPlan,
  setDetailDialog,
  setDialogOpen,
  handleDelete,
}: Props) => {
  return (
    <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Dorixona nomi</TableHead>
            <TableHead>Inn</TableHead>
            <TableHead>Egasining nomeri</TableHead>
            <TableHead>Ma'sul shaxsning nomeri</TableHead>
            <TableHead>Tuman</TableHead>
            <TableHead>Obyekt</TableHead>
            <TableHead>Kim qo'shgan</TableHead>
            <TableHead className="text-right">Amallar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.inn}</TableCell>
              <TableCell>{formatPhone(item.owner_phone)}</TableCell>
              <TableCell>{formatPhone(item.responsible_phone)}</TableCell>
              <TableCell>{item.district.name}</TableCell>
              <TableCell>{item.place.name}</TableCell>
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
                <Button
                  variant="destructive"
                  size="icon"
                  className="cursor-pointer"
                  onClick={() => handleDelete(item)}
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

export default PharmaciesTable;
