import type { ResportListResData } from "@/features/reports/lib/data";
import formatDate from "@/shared/lib/formatDate";
import formatPrice from "@/shared/lib/formatPrice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Loader2 } from "lucide-react";

const ReportsTable = ({
  plans,
  // setEditingPlan,
  // setDialogOpen,
  // handleDelete,
  isError,
  isLoading,
}: {
  plans: ResportListResData[];
  isLoading: boolean;
  isError: boolean;
  // setEditingPlan: Dispatch<SetStateAction<ResportListResData | null>>;
  // setDialogOpen: Dispatch<SetStateAction<boolean>>;
  // handleDelete: (id: number) => void;
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
      {!isError && !isLoading && (
        <Table>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead className="text-start">ID</TableHead>
              <TableHead className="text-start">Dorixoan nomi</TableHead>
              <TableHead className="text-start">To'langan summa</TableHead>
              <TableHead className="text-start">To'langan sanasi</TableHead>
              {/* <TableHead className="text-right">Harakatlar</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id} className="text-start">
                <TableCell>{plan.id}</TableCell>
                <TableCell>{plan.employee_name}</TableCell>
                <TableCell>{formatPrice(plan.price, true)}</TableCell>
                <TableCell>
                  {formatDate.format(plan.created_at, "DD-MM-YYYY")}
                </TableCell>

                {/* <TableCell className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-500 text-white hover:bg-blue-500 hover:text-white cursor-pointer"
                  onClick={() => {
                    setEditingPlan(plan);
                    setDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => handleDelete(plan.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ReportsTable;
