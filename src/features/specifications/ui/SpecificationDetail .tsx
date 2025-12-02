"use client";

import type { OrderListDataRes } from "@/features/specifications/lib/data";
import formatPrice from "@/shared/lib/formatPrice";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { HardDriveDownloadIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  specification: OrderListDataRes | null;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const SpecificationDetail = ({
  specification,
  open,
  setOpen,
}: Props) => {
  const downloadFile = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl, {
        method: "GET",
        headers: {
          // Agar token kerak bo'lsa qo'shing
          // Authorization: `Bearer ${yourToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Fayl yuklab olishda xatolik yuz berdi");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "file.pdf"; // fayl nomi
      document.body.appendChild(a);
      a.click();

      // Tozalash
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  if (!specification) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Spetsifikatsiya tafsilotlari
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Asosiy ma'lumotlar - Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Xaridor */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-600 font-medium mb-1">Xaridor</p>
              <p className="text-lg font-semibold text-gray-800">
                {specification.employee_name}
              </p>
            </div>

            {/* Farmasevtika */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-green-600 font-medium mb-1">
                Farmasevtika
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {specification.factory.name}
              </p>
            </div>

            {/* Foydalanuvchi */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 md:col-span-2">
              <p className="text-sm text-purple-600 font-medium mb-1">
                Mas'ul xodim
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {specification.user.first_name} {specification.user.last_name}
              </p>
            </div>
          </div>

          {/* Dorilar ro'yxati */}
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">
                {specification.order_items.length}
              </span>
              Dorilar ro'yxati
            </h3>

            <div className="space-y-3">
              {specification.order_items.map((med, index) => (
                <div
                  key={med.id}
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded">
                          #{index + 1}
                        </span>
                        <p className="font-semibold text-gray-800">
                          {med.product}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>
                          Miqdor: <strong>{med.quantity} ta</strong>
                        </span>
                        <span>×</span>
                        <span>
                          Narx:{" "}
                          <strong>
                            {formatPrice(
                              Number(med.total_price) / med.quantity,
                            )}
                          </strong>
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-gray-500 mb-1">Jami</p>
                      <p className="text-lg font-bold text-indigo-600">
                        {formatPrice(med.total_price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* To'lov ma'lumotlari */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-5 border-2 border-slate-300">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              To'lov ma'lumotlari
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-slate-300">
                <span className="text-gray-600 font-medium">Jami narx:</span>
                <span className="text-xl font-bold text-gray-800">
                  {formatPrice(specification.total_price)}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-slate-300">
                <span className="text-gray-600 font-medium">
                  To'langan foizi:
                </span>
                <span className="text-lg font-semibold text-orange-600">
                  {specification.advance}%
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-700 font-bold text-lg">
                  To'langan:
                </span>
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(specification.paid_price)}
                </span>
              </div>
            </div>
          </div>
          <Button
            className="w-full h-12 bg-blue-600 text-md hover:bg-blue-700 cursor-pointer"
            onClick={() =>
              downloadFile(specification.file, `order-${specification.id}`)
            }
          >
            <HardDriveDownloadIcon className="size-5" />
            PDF faylda yuklab olish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
