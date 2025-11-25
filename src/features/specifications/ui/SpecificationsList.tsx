"use client";

import {
  FakeSpecifications,
  type SpecificationsType,
} from "@/features/specifications/lib/data";
import { AddedSpecification } from "@/features/specifications/ui/AddedSpecification";
import { SpecificationDetail } from "@/features/specifications/ui/SpecificationDetail ";
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
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const SpecificationsList = () => {
  const [data, setData] = useState<SpecificationsType[]>(FakeSpecifications);
  const [editingPlan, setEditingPlan] = useState<SpecificationsType | null>(
    null,
  );
  const [detail, setDetail] = useState<SpecificationsType | null>(null);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const handleDelete = (id: number) =>
    setData((prev) => prev.filter((e) => e.id !== id));

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
              setData={setData}
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
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow key={item.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>
                  {item.user.firstName} {item.user.lastName}
                </TableCell>
                <TableCell>{item.pharm.name}</TableCell>
                <TableCell>{item.client}</TableCell>
                <TableCell>{formatPrice(item.totalPrice)}</TableCell>
                <TableCell>{item.percentage}%</TableCell>
                <TableCell>{formatPrice(item.paidPrice)}</TableCell>
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
                  <Button
                    size="icon"
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-2 sticky bottom-0 bg-white flex justify-end gap-2 z-10 py-2 border-t">
        <Button
          size="icon"
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          <ChevronLeft />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            size="icon"
            variant={currentPage === i + 1 ? "default" : "outline"}
            className={clsx(
              currentPage === i + 1 ? "bg-blue-500 hover:bg-blue-600" : "",
            )}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          size="icon"
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default SpecificationsList;
