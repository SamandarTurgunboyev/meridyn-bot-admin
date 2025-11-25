import type { LocationListType } from "@/features/location/lib/data";
import formatDate from "@/shared/lib/formatDate";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Circle, Map, Placemark, YMaps } from "@pbe/react-yandex-maps";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

interface Props {
  detail: boolean;
  setDetail: Dispatch<SetStateAction<boolean>>;
  object: LocationListType | null;
}

const LocationDetailDialog = ({ detail, object, setDetail }: Props) => {
  const [circle, setCircle] = useState<string[] | undefined>([""]);

  useEffect(() => {
    if (object && object.object) {
      setCircle([object.object.lat, object.object.long]);
    } else if (object && object.pharmcies) {
      setCircle([object.pharmcies.lat, object.pharmcies.long]);
    } else if (object && object.doctor) {
      setCircle([object.doctor.lat, object.doctor.long]);
    } else {
      setCircle(undefined);
    }
  }, [object]);

  if (!object) return null;

  return (
    <Dialog open={detail} onOpenChange={setDetail}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Reja haqida batafsil
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="space-y-4 mt-2 text-md">
          <div className="flex gap-2">
            <p className="font-semibold text-gray-900">
              Jo'natgan foydalanvchi:
            </p>
            <p className="text-black">
              {object.user.firstName} {object.user.lastName}
            </p>
          </div>
          <div className="flex gap-2">
            <p className="font-semibold text-gray-900">Jo'natgan vaqti:</p>
            <p className="text-black">
              {formatDate.format(object.createdAt, "DD-MM-YYYY")}
            </p>
          </div>
          {object.district && (
            <div className="flex gap-2">
              <p className="font-semibold text-gray-900">Tuman:</p>
              <p className="text-black">{object.district.name}</p>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-gray-900">Qayerdan jo'natdi:</p>
            <YMaps>
              <Map
                defaultState={{
                  center: [Number(object.lat), Number(object.long)],
                  zoom: 16,
                }}
                width="100%"
                height="300px"
              >
                <Placemark
                  geometry={[Number(object.lat), Number(object.long)]}
                />
                {circle && (
                  <Circle
                    geometry={[[Number(circle[0]), Number(circle[1])], 100]}
                    options={{
                      fillColor: "rgba(0, 150, 255, 0.2)",
                      strokeColor: "rgba(0, 150, 255, 0.8)",
                      strokeWidth: 2,
                    }}
                  />
                )}
              </Map>
            </YMaps>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDetailDialog;
