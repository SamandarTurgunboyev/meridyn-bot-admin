import type { ReportsTypeList } from "@/features/reports/lib/data";
import formatDate from "@/shared/lib/formatDate";
import formatPrice from "@/shared/lib/formatPrice";
import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Edit, Trash } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

const ReportsTable = ({
  plans,
  setEditingPlan,
  setDialogOpen,
  handleDelete,
}: {
  plans: ReportsTypeList[];
  setEditingPlan: Dispatch<SetStateAction<ReportsTypeList | null>>;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  handleDelete: (id: number) => void;
}) => {
  return (
    <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="text-center">
            <TableHead className="text-start">ID</TableHead>
            <TableHead className="text-start">Dorixoan nomi</TableHead>
            <TableHead className="text-start">To'langan summa</TableHead>
            <TableHead className="text-start">To'langan sanasi</TableHead>
            <TableHead className="text-right">Harakatlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.id} className="text-start">
              <TableCell>{plan.id}</TableCell>
              <TableCell>{plan.pharm_name}</TableCell>
              <TableCell>{formatPrice(plan.amount, true)}</TableCell>
              <TableCell>
                {formatDate.format(plan.month, "DD-MM-YYYY")}
              </TableCell>

              <TableCell className="flex gap-2 justify-end">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportsTable;
