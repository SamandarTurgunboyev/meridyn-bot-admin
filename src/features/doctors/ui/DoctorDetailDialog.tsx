import type { DoctorListResData } from "@/features/doctors/lib/data";
import formatPhone from "@/shared/lib/formatPhone";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Circle,
  Map,
  Placemark,
  Polygon,
  YMaps,
  ZoomControl,
} from "@pbe/react-yandex-maps";
import { useEffect, useState } from "react";

interface CoordsData {
  lat: number;
  lon: number;
  polygon: [number, number][][];
}

interface Props {
  detail: boolean;
  setDetail: (open: boolean) => void;
  object: DoctorListResData | null;
}

const DoctorDetailDialog = ({ detail, setDetail, object }: Props) => {
  const [coords, setCoords] = useState<[number, number]>([
    41.311081, 69.240562,
  ]);

  const [polygonCoords, setPolygonCoords] = useState<[number, number][][]>([]);

  const [circleCoords] = useState<[number, number] | null>(null);

  const getCoords = async (name: string): Promise<CoordsData | null> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          name,
        )}&format=json&polygon_geojson=1&limit=1`,
      );
      const data = await res.json();

      if (!data.length || !data[0].geojson) return null;

      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      let polygon: [number, number][][] = [];

      if (data[0].geojson.type === "Polygon") {
        polygon = data[0].geojson.coordinates.map((ring: []) =>
          ring.map((c) => [c[1], c[0]]),
        );
      }

      if (data[0].geojson.type === "MultiPolygon") {
        polygon = data[0].geojson.coordinates[0].map((ring: []) =>
          ring.map((c) => [c[1], c[0]]),
        );
      }

      return { lat, lon, polygon };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!object) return;

    const load = async () => {
      const district = await getCoords(object.district.name);

      if (district) {
        setPolygonCoords(district.polygon);
      }

      setCoords([object.latitude, object.longitude]);
      // setCircleCoords([object.latitude, object.longitude]);
    };

    load();
  }, [object]);

  if (!object) return null;

  return (
    <Dialog open={detail} onOpenChange={setDetail}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Shifokor tafsilotlari</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <p>
            <span className="font-semibold">Ism:</span> {object.first_name}{" "}
            {object.last_name}
          </p>
          <p>
            <span className="font-semibold">Telefon:</span>{" "}
            {formatPhone(object.phone_number)}
          </p>
          <p>
            <span className="font-semibold">Ish joyi:</span> {object.work_place}
          </p>
          <p>
            <span className="font-semibold">Mutaxassislik:</span>{" "}
            {object.sphere}
          </p>
          <p>
            <span className="font-semibold">Tuman:</span> {object.district.name}
          </p>
          <p>
            <span className="font-semibold">Manzili:</span>
          </p>

          {/* 🗺 MAP */}
          <div className="h-[300px] w-full border rounded-lg overflow-hidden">
            <YMaps query={{ lang: "en_RU" }}>
              <Map
                state={{
                  center: coords,
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

                {/* Ish joyining markazi */}
                <Placemark geometry={coords} />

                {/* Tuman polygon */}
                {polygonCoords.length > 0 && (
                  <Polygon
                    geometry={polygonCoords}
                    options={{
                      fillColor: "rgba(0, 150, 255, 0.2)",
                      strokeColor: "rgba(0, 150, 255, 0.8)",
                      strokeWidth: 2,
                    }}
                  />
                )}

                {/* Radius circle (ish joyi atrofida) */}
                {circleCoords && (
                  <Circle
                    geometry={[circleCoords, 500]}
                    options={{
                      fillColor: "rgba(255, 100, 0, 0.3)",
                      strokeColor: "rgba(255, 100, 0, 0.8)",
                      strokeWidth: 2,
                    }}
                  />
                )}
              </Map>
            </YMaps>
          </div>
        </div>

        <DialogClose asChild>
          <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-600">
            Yopish
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorDetailDialog;
