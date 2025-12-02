import type { LocationListDataRes } from "@/features/location/lib/data";
import formatDate from "@/shared/lib/formatDate";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Circle, Map, Placemark, Polygon, YMaps } from "@pbe/react-yandex-maps";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

interface Props {
  detail: boolean;
  setDetail: Dispatch<SetStateAction<boolean>>;
  object: LocationListDataRes | null;
}

interface CoordsData {
  lat: number;
  lon: number;
  polygon: [number, number][][];
}

const LocationDetailDialog = ({ detail, object, setDetail }: Props) => {
  const [circle, setCircle] = useState<string[] | undefined>([""]);
  const [coords, setCoords] = useState<[number, number]>([
    41.311081, 69.240562,
  ]);

  const [polygonCoords, setPolygonCoords] = useState<[number, number][][]>([]);

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
      if (object.district) {
        const district = await getCoords(object.district.name);

        if (district) {
          setPolygonCoords(district.polygon);
        }
      } else {
        setPolygonCoords([]);
      }

      setCoords([Number(object.latitude), Number(object.longitude)]);
    };

    load();
  }, [object]);

  useEffect(() => {
    if (object && object.place) {
      setCircle([
        object.place.latitude.toString(),
        object.place.longitude.toString(),
      ]);
    } else if (object && object.pharmacy) {
      setCircle([
        object.pharmacy.latitude.toString(),
        object.pharmacy.longitude.toString(),
      ]);
    } else if (object && object.doctor) {
      setCircle([
        object.doctor.latitude.toString(),
        object.doctor.longitude.toString(),
      ]);
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
              {object.user.first_name} {object.user.last_name}
            </p>
          </div>
          <div className="flex gap-2">
            <p className="font-semibold text-gray-900">Jo'natgan vaqti:</p>
            <p className="text-black">
              {formatDate.format(object.created_at, "DD-MM-YYYY")}
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
                  center: coords,
                  zoom: 12,
                }}
                width="100%"
                height="300px"
              >
                {/* Marking user location */}
                <Placemark geometry={coords} />

                {/* Circle around user */}
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

                {/* District polygon */}
                {polygonCoords.length > 0 && (
                  <Polygon
                    geometry={polygonCoords}
                    options={{
                      fillColor: "rgba(0, 150, 255, 0.15)",
                      strokeColor: "rgba(0, 150, 255, 1)",
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
