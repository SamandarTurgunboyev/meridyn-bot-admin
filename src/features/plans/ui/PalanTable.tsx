import type { Plan } from "@/features/plans/lib/data";
import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import clsx from "clsx";
import { Edit, Eye, Trash } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  filteredPlans: Plan[];
  setEditingPlan: Dispatch<SetStateAction<Plan | null>>;
  setDetail: Dispatch<SetStateAction<boolean>>;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  handleDelete: (id: number) => void;
}

const PalanTable = ({
  filteredPlans,
  setEditingPlan,
  setDetail,
  setDialogOpen,
  handleDelete,
}: Props) => {
  return (
    <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="text-center">
            <TableHead className="text-start">ID</TableHead>
            <TableHead className="text-start">Reja nomi</TableHead>
            <TableHead className="text-start">Tavsifi</TableHead>
            <TableHead className="text-start">Kimga tegishli</TableHead>
            <TableHead className="text-start">Status</TableHead>
            <TableHead className="text-right">Harakatlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPlans.map((plan) => (
            <TableRow key={plan.id} className="text-start">
              <TableCell>{plan.id}</TableCell>
              <TableCell>{plan.name}</TableCell>
              <TableCell>{plan.description}</TableCell>
              <TableCell>
                {plan.user.firstName + " " + plan.user.lastName}
              </TableCell>
              <TableCell
                className={clsx(
                  plan.status === "Bajarildi"
                    ? "text-green-500"
                    : "text-red-500",
                )}
              >
                {plan.status}
              </TableCell>
              <TableCell className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-green-500 text-white cursor-pointer hover:bg-green-500 hover:text-white"
                  onClick={() => {
                    setEditingPlan(plan);
                    setDetail(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
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

export default PalanTable;
