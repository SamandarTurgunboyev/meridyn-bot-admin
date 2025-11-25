import type { PharmciesType } from "@/features/pharmacies/lib/data";
import formatPhone from "@/shared/lib/formatPhone";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Circle, Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import { useEffect, useState } from "react";

interface Props {
  detail: boolean;
  setDetail: (value: boolean) => void;
  object: PharmciesType | null;
}

const PharmDetailDialog = ({ detail, setDetail, object }: Props) => {
  const [open, setOpen] = useState(detail);

  useEffect(() => {
    setOpen(detail);
  }, [detail]);

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        setDetail(val);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Farmatsiya tafsilotlari</DialogTitle>
        </DialogHeader>

        {object ? (
          <div className="space-y-2">
            <div>
              <strong>Nomi:</strong> {object.name}
            </div>
            <div>
              <strong>INN:</strong> {object.inn}
            </div>
            <div>
              <strong>Telefon:</strong> {formatPhone(object.phone_number)}
            </div>
            <div>
              <strong>Qo‘shimcha telefon:</strong>{" "}
              {formatPhone(object.additional_phone)}
            </div>
            <div>
              <strong>Tuman:</strong> {object.district.name}
            </div>
            <div>
              <strong>Obyekt:</strong> {object.object.name}
            </div>
            <div>
              <strong>Kimga tegishli:</strong> {object.user.firstName}{" "}
              {object.user.lastName}
            </div>

            <div className="h-[300px] w-full border rounded-lg overflow-hidden">
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
                  <Circle
                    geometry={[[Number(object.lat), Number(object.long)], 100]}
                    options={{
                      fillColor: "rgba(0, 150, 255, 0.2)",
                      strokeColor: "rgba(0, 150, 255, 0.8)",
                      strokeWidth: 2,
                    }}
                  />
                </Map>
              </YMaps>
            </div>
          </div>
        ) : (
          <div>Ma'lumot topilmadi</div>
        )}
        <div className="text-right">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full h-12 bg-blue-500 text-white cursor-pointer hover:bg-blue-500 hover:text-white"
            >
              Yopish
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PharmDetailDialog;
