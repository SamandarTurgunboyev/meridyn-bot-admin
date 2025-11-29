import type { RegionListResData } from "@/features/region/lib/data";
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

const RegionTable = ({
  region,
  handleDelete,
  isLoading,
  isError,
  setEditingRegion,
  setDialogOpen,
}: {
  region: RegionListResData[];
  isLoading: boolean;
  isError: boolean;
  setEditingRegion: Dispatch<SetStateAction<RegionListResData | null>>;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  handleDelete: (user: RegionListResData) => void;
}) => {
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
            <TableRow className="text-center">
              <TableHead className="text-start">ID</TableHead>
              <TableHead className="text-start">Nomi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {region.map((plan, index) => (
              <TableRow key={plan.id} className="text-start">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{plan.name}</TableCell>
                <TableCell className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-500 text-white hover:bg-blue-500 hover:text-white cursor-pointer"
                    onClick={() => {
                      setEditingRegion(plan);
                      setDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => handleDelete(plan)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default RegionTable;
