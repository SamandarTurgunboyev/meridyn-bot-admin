import { pill_api } from "@/features/pill/lib/api";
import { type PillListData, type PillType } from "@/features/pill/lib/data";
import AddedPill from "@/features/pill/ui/AddedPill";
import DeletePill from "@/features/pill/ui/DeletePill";
import { userStore } from "@/shared/hooks/user";
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
import { Input } from "@/shared/ui/input";
import Pagination from "@/shared/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Edit, Plus, Trash } from "lucide-react";
import { useState } from "react";

const PillList = () => {
  const { user: getme } = userStore();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const [nameFilter, setNameFilter] = useState<string>("");

  const { data } = useQuery({
    queryKey: ["pill_list", nameFilter, currentPage],
    queryFn: () =>
      pill_api.list({
        limit,
        offset: (currentPage - 1) * limit,
        name: nameFilter,
      }),
    select(data) {
      return data.data.data;
    },
  });

  const totalPages = data ? Math.ceil(data.count / limit) : 1;

  const [editingPlan, setEditingPlan] = useState<PillType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [pillDelete, setPillDelete] = useState<PillListData | null>(null);

  const handleDelete = (id: PillListData) => {
    setOpenDelete(true);
    setPillDelete(id);
  };

  return (
    <div className="flex flex-col h-full p-10 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Dorilar ro'yxati</h1>

        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Dori nomi"
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
                  {editingPlan ? "Dorini tahrirlash" : "Yangi dorini qo'shish"}
                </DialogTitle>
              </DialogHeader>

              <AddedPill
                initialValues={editingPlan}
                setDialogOpen={setDialogOpen}
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
              <TableHead className="text-start">Narxi</TableHead>
              <TableHead className="text-start">Qo'shilgan sanasi</TableHead>
              <TableHead className="text-end">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.results.map((plan) => (
              <TableRow key={plan.id} className="text-start">
                <TableCell>{plan.id}</TableCell>
                <TableCell>{plan.name}</TableCell>
                <TableCell>{formatPrice(plan.price)}</TableCell>
                <TableCell>
                  {formatDate.format(plan.created_at, "Dd-MM-YYYY")}
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
                  {getme?.is_superuser && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => handleDelete(plan)}
                      disabled={!getme.is_superuser}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      <DeletePill
        opneDelete={openDelete}
        setOpenDelete={setOpenDelete}
        pillDelete={pillDelete}
        setPillDelete={setPillDelete}
      />
    </div>
  );
};

export default PillList;
