import type { PlanListData } from "@/features/plans/lib/data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import { Badge } from "@/shared/ui/badge";
import clsx from "clsx";
import { type Dispatch, type SetStateAction } from "react";

interface Props {
  setDetail: Dispatch<SetStateAction<boolean>>;
  detail: boolean;
  plan: PlanListData | null;
}

const PlanDetail = ({ detail, setDetail, plan }: Props) => {
  if (!plan) return null;

  return (
    <Dialog open={detail} onOpenChange={setDetail}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Reja haqida batafsil
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="space-y-4 mt-2 text-md">
          {/* Reja nomi */}
          <div>
            <p className="font-semibold text-gray-900">Reja nomi:</p>
            <p>{plan.title}</p>
          </div>

          {/* Reja tavsifi */}
          <div>
            <p className="font-semibold text-gray-900">Tavsifi:</p>
            <p>{plan.description}</p>
          </div>

          {/* Kimga tegishli */}
          <div>
            <p className="font-semibold text-gray-900">Kimga tegishli:</p>
            <p>
              {plan.user.first_name} {plan.user.last_name}
            </p>
          </div>

          {/* Reja statusi */}
          <div>
            <p className="font-semibold text-gray-900">Reja statusi:</p>

            <Badge
              className={clsx(
                plan.is_done
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700",
                "text-sm px-4 py-2 mt-2",
              )}
            >
              {plan.is_done ? "Bajarilgan" : "Bajarilmagan"}
            </Badge>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default PlanDetail;
