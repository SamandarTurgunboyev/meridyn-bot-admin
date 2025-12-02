import type { PlanListData } from "@/features/plans/lib/data";
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
import { Edit, Eye, Loader2, Trash } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  filteredPlans: PlanListData[] | [];
  setEditingPlan: Dispatch<SetStateAction<PlanListData | null>>;
  setDetail: Dispatch<SetStateAction<boolean>>;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  handleDelete: (id: PlanListData) => void;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
}

const PalanTable = ({
  filteredPlans,
  setEditingPlan,
  setDetail,
  isError,
  isFetching,
  isLoading,
  setDialogOpen,
  handleDelete,
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
                <TableCell>{plan.title}</TableCell>
                <TableCell>{plan.description}</TableCell>
                <TableCell>
                  {plan.user.first_name + " " + plan.user.last_name}
                </TableCell>
                <TableCell
                  className={clsx(
                    plan.is_done ? "text-green-500" : "text-red-500",
                  )}
                >
                  {plan.is_done ? "Bajarilgan" : "Bajarilmagan"}
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
                    disabled={plan.is_done}
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
                    disabled={plan.is_done}
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

export default PalanTable;
