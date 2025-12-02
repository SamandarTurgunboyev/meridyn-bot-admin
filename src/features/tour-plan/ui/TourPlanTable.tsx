import type { PlanTourListDataRes } from "@/features/tour-plan/lib/data";
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
import clsx from "clsx";
import { Edit, Eye, Loader2, Trash } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  data: PlanTourListDataRes[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  setDetail: Dispatch<SetStateAction<PlanTourListDataRes | null>>;
  setDetailOpen: Dispatch<SetStateAction<boolean>>;
  setEditingPlan: Dispatch<SetStateAction<PlanTourListDataRes | null>>;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  handleDelete: (paln: PlanTourListDataRes) => void;
}

const TourPlanTable = ({
  data,
  isFetching,
  isError,
  isLoading,
  setDetail,
  setEditingPlan,
  handleDelete,
  setDialogOpen,
  setDetailOpen,
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
      )}{" "}
      {!isLoading && !isError && (
        <Table>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead className="text-start">ID</TableHead>
              <TableHead className="text-start">Kimga tegishli</TableHead>
              <TableHead className="text-start">Boriladigan joyi</TableHead>
              <TableHead className="text-start">Sanasi</TableHead>
              <TableHead className="text-start">Statusi</TableHead>
              <TableHead className="text-right">Harakatlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((plan) => (
                <TableRow key={plan.id} className="text-start">
                  <TableCell>{plan.id}</TableCell>
                  <TableCell>
                    {plan.user.first_name + " " + plan.user.last_name}
                  </TableCell>
                  <TableCell>{plan.place_name}</TableCell>
                  <TableCell>
                    {plan.date && formatDate.format(plan.date, "DD-MM-YYYY")}
                  </TableCell>
                  <TableCell
                    className={clsx(
                      plan.location_send ? "text-green-500" : "text-red-500",
                    )}
                  >
                    {plan.location_send ? "Borildi" : "Borilmagan"}
                  </TableCell>

                  <TableCell className="flex gap-1 justify-end">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setDetail(plan);
                        setDetailOpen(true);
                      }}
                      className="bg-green-600 text-white cursor-pointer hover:bg-green-600 hover:text-white"
                    >
                      <Eye size={18} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
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
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => handleDelete(plan)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-lg">
                  Tur plan topilmadi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TourPlanTable;
