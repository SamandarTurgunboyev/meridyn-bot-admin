import type { DoctorListType } from "@/features/doctors/lib/data";
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

interface Props {
  detail: boolean;
  setDetail: (open: boolean) => void;
  object: DoctorListType | null;
}

const DoctorDetailDialog = ({ detail, setDetail, object }: Props) => {
  if (!object) return null;

  return (
    <Dialog open={detail} onOpenChange={setDetail}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Shifokor tafsilotlari</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <p>
            <span className="font-semibold">Ism Familiya:</span>{" "}
            {object.first_name} {object.last_name}
          </p>
          <p>
            <span className="font-semibold">Telefon:</span>{" "}
            {formatPhone(object.phone_number)}
          </p>
          <p>
            <span className="font-semibold">Ish joyi:</span> {object.work}
          </p>
          <p>
            <span className="font-semibold">Mutaxassislik:</span> {object.spec}
          </p>
          <p>
            <span className="font-semibold">Tavsif:</span> {object.desc}
          </p>
          <p>
            <span className="font-semibold">Tuman:</span> {object.district.name}
          </p>
          <p>
            <span className="font-semibold">Foydalanuvchi:</span>{" "}
            {object.user.firstName} {object.user.lastName}
          </p>
          <p>
            <span className="font-semibold">Obyekt:</span> {object.object.name}
          </p>
          <span className="font-semibold">Manzili:</span>
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

        <DialogClose asChild>
          <Button className="mt-4 w-full bg-blue-600 cursor-pointer hover:bg-blue-600">
            Yopish
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorDetailDialog;
