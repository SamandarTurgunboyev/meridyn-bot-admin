import type { PlanListData } from "@/features/plans/lib/data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import { Badge } from "@/shared/ui/badge";
import {
  Circle,
  Map,
  Placemark,
  YMaps,
  ZoomControl,
} from "@pbe/react-yandex-maps";
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
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Reja haqida batafsil
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="space-y-4 mt-2 text-md">
          <div>
            <p className="font-semibold text-gray-900">Reja nomi:</p>
            <p>{plan.title}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">Tavsifi:</p>
            <p>{plan.description}</p>
          </div>

          {plan.comment && (
            <div>
              <p className="font-semibold text-gray-900">Qanday bajarildi:</p>
              <p>{plan.comment}</p>
            </div>
          )}

          {plan.doctor && (
            <div>
              <p className="font-semibold text-gray-900">
                Shikorga biriktirgan
              </p>
              <p>
                <span>Shifokot ismi: </span>
                {plan.doctor.first_name} {plan.doctor.last_name}
              </p>
            </div>
          )}

          {plan.pharmacy && (
            <div>
              <p className="font-semibold text-gray-900">
                Dorixonaga biriktirgan
              </p>
              <p>
                <span>Dorixona nomi: </span>
                {plan.pharmacy.name}
              </p>
            </div>
          )}

          <div>
            <p className="font-semibold text-gray-900">Kimga tegishli:</p>
            <p>
              {plan.user.first_name} {plan.user.last_name}
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">Reja statusi:</p>

            <Badge
              className={clsx(
                plan.comment
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700",
                "text-sm px-4 py-2 mt-2",
              )}
            >
              {plan.comment ? "Bajarilgan" : "Bajarilmagan"}
            </Badge>
          </div>

          <div>
            {plan.doctor
              ? "Shifokor manzili:"
              : plan.pharmacy && "Dorixona manzili:"}
          </div>

          <YMaps query={{ lang: "en_RU" }}>
            <div className="h-[300px] w-full rounded-md overflow-hidden">
              <Map
                state={{
                  center: [plan.latitude, plan.longitude],
                  zoom: 12,
                }}
                width="100%"
                height="100%"
              >
                <ZoomControl
                  options={{
                    position: { right: "10px", bottom: "70px" },
                  }}
                />

                <Placemark geometry={[plan.latitude, plan.longitude]} />

                <Circle
                  geometry={[[plan.latitude, plan.longitude], 300]}
                  options={{
                    fillColor: "rgba(255, 100, 0, 0.3)",
                    strokeColor: "rgba(255, 100, 0, 0.8)",
                    strokeWidth: 2,
                  }}
                />
              </Map>
            </div>
          </YMaps>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default PlanDetail;
