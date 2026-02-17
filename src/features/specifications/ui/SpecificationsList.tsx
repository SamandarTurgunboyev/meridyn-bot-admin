"use client";

import { order_api } from "@/features/specifications/lib/api";
import { type OrderListDataRes } from "@/features/specifications/lib/data";
import { AddedSpecification } from "@/features/specifications/ui/AddedSpecification";
import DeleteOrder from "@/features/specifications/ui/DeleteOrder";
import { SpecificationDetail } from "@/features/specifications/ui/SpecificationDetail ";
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
import { Eye, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const SpecificationsList = () => {
  const [editingPlan, setEditingPlan] = useState<OrderListDataRes | null>(null);
  const [detail, setDetail] = useState<OrderListDataRes | null>(null);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const { user: getme } = userStore();

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order_list", currentPage],
    queryFn: () => order_api.list({ limit, offset: (currentPage - 1) * limit }),
    select(data) {
      return data.data.data;
    },
  });
  const totalPages = order ? Math.ceil(order.count / limit) : 1;

  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [pillDelete, setPillDelete] = useState<OrderListDataRes | null>(null);

  const handleDelete = (id: OrderListDataRes) => {
    setOpenDelete(true);
    setPillDelete(id);
  };

  return (
    <div className="flex flex-col h-full p-10 w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Spesifikatsiyalarni boshqarish</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => setEditingPlan(null)}
            >
              <Plus className="!h-5 !w-5" /> Qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg !h-[80vh] overflow-x-hidden">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? "Tahrirlash" : "Yangi spesifikatsiya"}
              </DialogTitle>
            </DialogHeader>
            <AddedSpecification
              initialValues={editingPlan}
              setDialogOpen={setDialogOpen}
            />
          </DialogContent>
        </Dialog>

        <SpecificationDetail
          specification={detail}
          open={detailOpen}
          setOpen={setDetailOpen}
        />
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
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Foydalanuvchi</TableHead>
                <TableHead>Farmasevtika</TableHead>
                <TableHead>Zakaz qilgan</TableHead>
                <TableHead>Jami</TableHead>
                <TableHead>% To‘langan</TableHead>
                <TableHead>To‘langan summa</TableHead>
                <TableHead>Qo'shilgan sanasi</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order?.results.map((item, idx) => (
                <TableRow key={item.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>
                    {item.user.first_name} {item.user.last_name}
                  </TableCell>
                  <TableCell>{item.factory.name}</TableCell>
                  <TableCell>{item.employee_name}</TableCell>
                  <TableCell>{formatPrice(item.total_price)}</TableCell>
                  <TableCell>{item.advance}%</TableCell>
                  <TableCell>{formatPrice(item.paid_price)}</TableCell>
                  <TableCell>
                    {formatDate.format(item.created_at, "DD-MM-YYYY")}
                  </TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setDetail(item);
                        setDetailOpen(true);
                      }}
                      className="bg-green-500 hover:bg-green-500 hover:text-white text-white cursor-pointer"
                    >
                      <Eye size={18} />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="bg-blue-600 text-white hover:bg-blue-600 hover:text-white cursor-pointer"
                      onClick={() => {
                        setEditingPlan(item);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil size={18} />
                    </Button>
                    {getme?.is_superuser && (
                      <Button
                        size="icon"
                        disabled={!getme?.is_superuser}
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => handleDelete(item)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      <DeleteOrder
        opneDelete={openDelete}
        pillDelete={pillDelete}
        setOpenDelete={setOpenDelete}
        setPillDelete={setPillDelete}
      />
    </div>
  );
};

export default SpecificationsList;
