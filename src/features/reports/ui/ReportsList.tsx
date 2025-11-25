import { ReportsData, type ReportsTypeList } from "@/features/reports/lib/data";
import AddedReport from "@/features/reports/ui/AddedReport";
import formatDate from "@/shared/lib/formatDate";
import formatPrice from "@/shared/lib/formatPrice";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Edit, Plus, Trash } from "lucide-react";
import { useState } from "react";

const ReportsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const [plans, setPlans] = useState<ReportsTypeList[]>(ReportsData);

  const [editingPlan, setEditingPlan] = useState<ReportsTypeList | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = (id: number) => {
    setPlans(plans.filter((p) => p.id !== id));
  };

  return (
    <div className="flex flex-col h-full p-10 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Rejalarni boshqarish</h1>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className="bg-blue-500 cursor-pointer hover:bg-blue-500"
              onClick={() => setEditingPlan(null)}
            >
              <Plus className="!h-5 !w-5" /> Qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editingPlan ? "Rejani tahrirlash" : "Yangi reja qo'shish"}
              </DialogTitle>
            </DialogHeader>

            <AddedReport
              initialValues={editingPlan}
              setDialogOpen={setDialogOpen}
              setPlans={setPlans}
            />
          </DialogContent>
        </Dialog>
      </div>

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

      <div className="mt-2 sticky bottom-0 bg-white flex justify-end gap-2 z-10 py-2 border-t">
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          className="cursor-pointer"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          <ChevronLeft />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            variant={currentPage === i + 1 ? "default" : "outline"}
            size="icon"
            className={clsx(
              currentPage === i + 1
                ? "bg-blue-500 hover:bg-blue-500"
                : " bg-none hover:bg-blue-200",
              "cursor-pointer",
            )}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="cursor-pointer"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default ReportsList;
