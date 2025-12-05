"use client";

import type { DistributedListData } from "@/features/distributed/lib/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  specification: DistributedListData | null;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DistributedDetail = ({ specification, open, setOpen }: Props) => {
  if (!specification) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Tafsilot
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Asosiy ma'lumotlar - Grid */}
          <div className="grid grid-cols-1">
            {/* Xaridor */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-600 font-medium mb-1">
                Xaridorning ismi
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {specification.employee_name}
              </p>
            </div>

            {/* Foydalanuvchi */}
            <div className="bg-gradient-to-br mt-5 from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 md:col-span-2">
              <p className="text-sm text-purple-600 font-medium mb-1">
                Mas'ul xodim
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {specification.user.first_name} {specification.user.last_name}
              </p>
            </div>

            <div className="bg-gradient-to-br mt-5 from-green-50 to-green-100 rounded-lg p-4 border border-green-200 md:col-span-2">
              <p className="text-sm text-green-600 font-medium mb-1">
                Topshirilgan sanasi
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {specification.date}
              </p>
            </div>
          </div>

          {/* Dorilar ro'yxati */}
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              Topshirilgan dori
            </h3>

            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-indigo-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-gray-800">
                        {specification.product.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>
                        Miqdor: <strong>{specification.quantity} ta</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
