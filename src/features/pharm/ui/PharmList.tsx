import { factory_api } from "@/features/pharm/lib/api";
import {
  type FactoryListDataRes,
  type PharmType,
} from "@/features/pharm/lib/data";
import AddedPharm from "@/features/pharm/ui/AddedPharm";
import DeletePharm from "@/features/pharm/ui/DeletePharm";
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
import { Edit, Loader2, Plus, Trash } from "lucide-react";
import { useState } from "react";

const PharmList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [nameFilter, setNameFilter] = useState<string>("");
  const limit = 20;
  const { data, isLoading, isError } = useQuery({
    queryKey: ["factory_list", currentPage, nameFilter],
    queryFn: () =>
      factory_api.list({
        limit,
        offset: (currentPage - 1) * limit,
        name: nameFilter,
      }),
    select(data) {
      return data.data.data;
    },
  });
  const totalPages = data ? Math.ceil(data?.count / limit) : 1;

  const [editingPlan, setEditingPlan] = useState<PharmType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [pillDelete, setPillDelete] = useState<FactoryListDataRes | null>(null);

  const handleDelete = (id: FactoryListDataRes) => {
    setOpenDelete(true);
    setPillDelete(id);
  };

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
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
                <TableHead className="text-end">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.results.length > 0 ? (
                data?.results.map((plan) => (
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
                        onClick={() => handleDelete(plan)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-lg">
                    Farmasevtika topilmadi.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      <DeletePharm
        opneDelete={openDelete}
        pillDelete={pillDelete}
        setOpenDelete={setOpenDelete}
        setPillDelete={setPillDelete}
      />
    </div>
  );
};

export default PharmList;
