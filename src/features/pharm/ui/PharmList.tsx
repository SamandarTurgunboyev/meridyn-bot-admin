import { pharmData, type PharmType } from "@/features/pharm/lib/data";
import AddedPharm from "@/features/pharm/ui/AddedPharm";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
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
import { useMemo, useState } from "react";

const PharmList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const [plans, setPlans] = useState<PharmType[]>(pharmData);

  const [editingPlan, setEditingPlan] = useState<PharmType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [nameFilter, setNameFilter] = useState<string>("");

  const handleDelete = (id: number) => {
    setPlans(plans.filter((p) => p.id !== id));
  };

  const filteredPlans = useMemo(() => {
    return plans.filter((item) => {
      const statusMatch = item.name
        .toLowerCase()
        .includes(nameFilter.toLowerCase());

      return statusMatch;
    });
  }, [plans, nameFilter]);

  return (
    <div className="flex flex-col h-full p-10 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Farmasevtikalar ro'yxati</h1>

        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Farmasevtika nomi"
            className="h-12"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                className="bg-blue-500 cursor-pointer hover:bg-blue-500 h-12"
                onClick={() => setEditingPlan(null)}
              >
                <Plus className="!h-5 !w-5" /> Qo'shish
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {editingPlan
                    ? "Farmasevtikani tahrirlash"
                    : "Yangi farmasevtika qo'shish"}
                </DialogTitle>
              </DialogHeader>

              <AddedPharm
                initialValues={editingPlan}
                setDialogOpen={setDialogOpen}
                setPlans={setPlans}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead className="text-start">ID</TableHead>
              <TableHead className="text-start">Nomi</TableHead>
              <TableHead className="text-end">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlans.map((plan) => (
              <TableRow key={plan.id} className="text-start">
                <TableCell>{plan.id}</TableCell>
                <TableCell>{plan.name}</TableCell>
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

export default PharmList;
