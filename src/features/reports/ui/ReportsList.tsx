import { ReportsData, type ReportsTypeList } from "@/features/reports/lib/data";
import AddedReport from "@/features/reports/ui/AddedReport";
import ReportsTable from "@/features/reports/ui/ReportsTable";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import Pagination from "@/shared/ui/pagination";
import { Plus } from "lucide-react";
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
        <h1 className="text-2xl font-bold">To'lovlar</h1>

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

      <ReportsTable
        handleDelete={handleDelete}
        plans={plans}
        setDialogOpen={setDialogOpen}
        setEditingPlan={setEditingPlan}
      />

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default ReportsList;
