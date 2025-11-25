"use client";

import type { TourPlanType } from "@/features/tour-plan/lib/data";
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
  plan: TourPlanType | null;
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
              {plan.user.firstName} {plan.user.lastName}
            </p>
          </div>

          {/* District */}
          <div>
            <p className="font-semibold">Hudud:</p>
            <p>{plan.district}</p>
          </div>

          {/* Sana */}
          <div>
            <p className="font-semibold">Sana:</p>
            <p>{plan.date.toLocaleString()}</p>
          </div>

          {/* Status */}
          <div>
            <p className="font-semibold">Status:</p>
            <Badge
              className={
                plan.status === "completed" ? "bg-green-600" : "bg-yellow-500"
              }
            >
              {plan.status === "completed" ? "Bajarilgan" : "Rejalashtirilgan"}
            </Badge>
          </div>

          {plan.userLocation && (
            <YMaps>
              <Map
                defaultState={{
                  center: [
                    Number(plan.userLocation.lat),
                    Number(plan.userLocation.long),
                  ],
                  zoom: 16,
                }}
                width="100%"
                height="300px"
              >
                <Placemark
                  geometry={[
                    Number(plan.userLocation.lat),
                    Number(plan.userLocation.long),
                  ]}
                />
                <Circle
                  geometry={[[Number(plan.lat), Number(plan.long)], 100]}
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
