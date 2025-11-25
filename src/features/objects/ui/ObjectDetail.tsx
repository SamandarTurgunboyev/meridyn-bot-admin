import type { ObjectListType } from "@/features/objects/lib/data";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Circle, Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import { type Dispatch, type SetStateAction } from "react";

interface Props {
  object: ObjectListType | null;
  setDetail: Dispatch<SetStateAction<boolean>>;
  detail: boolean;
}

const ObjectDetailDialog = ({ object, detail, setDetail }: Props) => {
  if (!object) return null;

  return (
    <Dialog open={detail} onOpenChange={setDetail}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>{object.name}</DialogTitle>
        </DialogHeader>

        <Card className="my-2 shadow-sm">
          <CardContent className="space-y-2">
            <div>
              <span className="font-semibold">Tuman:</span>{" "}
              {object.district.name}
            </div>
            <div>
              <span className="font-semibold">Foydalanuvchi:</span>{" "}
              {object.user.firstName} {object.user.lastName}
            </div>
          </CardContent>
        </Card>

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
              <Placemark geometry={[Number(object.lat), Number(object.long)]} />
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

        <div className="mt-4 text-right">
          <DialogClose asChild>
            <Button variant="outline">Yopish</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ObjectDetailDialog;
