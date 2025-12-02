"use client";

import type { PlanTourListDataRes } from "@/features/tour-plan/lib/data";
import formatDate from "@/shared/lib/formatDate";
import { Badge } from "@/shared/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Circle, Map, Placemark, YMaps } from "@pbe/react-yandex-maps";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  plan: PlanTourListDataRes | null;
}

const TourPlanDetailDialog = ({ open, setOpen, plan }: Props) => {
  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Tour Plan Detili
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Foydalanuvchi */}
          <div>
            <p className="font-semibold">Foydalanuvchi:</p>
            <p>
              {plan.user.first_name} {plan.user.last_name}
            </p>
          </div>

          {/* District */}
          <div>
            <p className="font-semibold">Hudud:</p>
            <p>{plan.place_name}</p>
          </div>

          {/* Sana */}
          <div>
            <p className="font-semibold">Sana:</p>
            <p>{plan.date && formatDate.format(plan.date, "YYYY-MM-DD")}</p>
          </div>

          {/* Status */}
          <div>
            <p className="font-semibold">Status:</p>
            <Badge
              className={plan.location_send ? "bg-green-600" : "bg-yellow-500"}
            >
              {plan.location_send ? "Bajarilgan" : "Rejalashtirilgan"}
            </Badge>
          </div>

          {plan.location_send && (
            <YMaps>
              <Map
                defaultState={{
                  center: [Number(plan.latitude), Number(plan.longitude)],
                  zoom: 16,
                }}
                width="100%"
                height="300px"
              >
                <Placemark
                  geometry={[Number(plan.latitude), Number(plan.longitude)]}
                />
                <Circle
                  geometry={[
                    [Number(plan.latitude), Number(plan.longitude)],
                    100,
                  ]}
                  options={{
                    fillColor: "rgba(0, 150, 255, 0.2)",
                    strokeColor: "rgba(0, 150, 255, 0.8)",
                    strokeWidth: 2,
                  }}
                />
              </Map>
            </YMaps>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TourPlanDetailDialog;
