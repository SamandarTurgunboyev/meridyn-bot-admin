import { discrit_api } from "@/features/districts/lib/api";
import { object_api } from "@/features/objects/lib/api";
import type {
  ObjectCreate,
  ObjectListData,
  ObjectUpdate,
} from "@/features/objects/lib/data";
import { ObjectForm } from "@/features/objects/lib/form";
import { user_api } from "@/features/users/lib/api";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Circle,
  Map,
  Placemark,
  Polygon,
  YMaps,
  ZoomControl,
} from "@pbe/react-yandex-maps";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";

interface Props {
  initialValues: ObjectListData | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

interface CoordsData {
  lat: number;
  lon: number;
  polygon: [number, number][][];
}

export default function AddedObject({ initialValues, setDialogOpen }: Props) {
  const [searchUser, setSearchUser] = useState<string>("");
  const [searchDiscrit, setSearchDiscrit] = useState<string>("");
  const queryClient = useQueryClient();
  const [openUser, setOpenUser] = useState<boolean>(false);
  const [openDiscrit, setOpenDiscrit] = useState<boolean>(false);
  const form = useForm<z.infer<typeof ObjectForm>>({
    resolver: zodResolver(ObjectForm),
    defaultValues: {
      lat: initialValues ? String(initialValues?.latitude) : "41.2949",
      long: initialValues ? String(initialValues?.longitude) : "69.2361",
      name: initialValues?.name || "",
      user: initialValues ? String(initialValues.user.id) : "",
      district: initialValues ? String(initialValues.district.id) : "",
    },
  });

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user_list", searchUser],
    queryFn: () => {
      const params: {
        limit?: number;
        offset?: number;
        search?: string;
        is_active?: boolean | string;
        region_id?: number;
      } = {
        limit: 8,
        search: searchUser,
      };

      return user_api.list(params);
    },
    select(data) {
      return data.data.data;
    },
  });

  const user_id = form.watch("user");

  const { data: discrit, isLoading: discritLoading } = useQuery({
    queryKey: ["discrit_list", searchDiscrit, user_id],
    queryFn: () => {
      const params: {
        name?: string;
        user?: number;
      } = {
        name: searchDiscrit,
      };

      if (user_id !== "") {
        params.user = Number(user_id);
      }

      return discrit_api.list(params);
    },
    select(data) {
      return data.data.data;
    },
  });

  const [coords, setCoords] = useState({
    latitude: 41.311081,
    longitude: 69.240562,
  });
  const [polygonCoords, setPolygonCoords] = useState<
    [number, number][][] | null
  >(null);
  const [circleCoords, setCircleCoords] = useState<[number, number] | null>(
    null,
  );

  const getCoords = async (name: string): Promise<CoordsData | null> => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&polygon_geojson=1&limit=1`,
    );
    const data = await res.json();

    if (data.length > 0 && data[0].geojson) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      let polygon: [number, number][][] = [];

      if (data[0].geojson.type === "Polygon") {
        polygon = data[0].geojson.coordinates.map((ring: [number, number][]) =>
          ring.map((coord: [number, number]) => [coord[1], coord[0]]),
        );
      } else if (data[0].geojson.type === "MultiPolygon") {
        polygon = data[0].geojson.coordinates.map(
          (poly: [number, number][][]) =>
            poly[0].map((coord: [number, number]) => [coord[1], coord[0]]),
        );
      }

      return { lat, lon, polygon };
    }

    return null;
  };

  useEffect(() => {
    if (initialValues) {
      (async () => {
        const result = await getCoords(initialValues.district.name);
        if (result) {
          setCoords({
            latitude: initialValues.latitude,
            longitude: initialValues.longitude,
          });
          setPolygonCoords(result.polygon);
          form.setValue("lat", String(result.lat));
          form.setValue("long", String(result.lon));
          setCircleCoords([initialValues.latitude, initialValues.longitude]);
        }
      })();
    }
  }, [initialValues, form]);

  const handleMapClick = (
    e: ymaps.IEvent<MouseEvent, { coords: [number, number] }>,
  ) => {
    const [lat, lon] = e.get("coords");
    setCoords({ latitude: lat, longitude: lon });
    form.setValue("lat", String(lat));
    form.setValue("long", String(lon));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (body: ObjectCreate) => object_api.create(body),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["object_list"] });
      toast.success(`Obyekt qo'shildi`);
      setDialogOpen(false);
    },
    onError: (err: AxiosError) => {
      const errMessage = err.response?.data as { message: string };
      const messageText = errMessage.message;
      toast.error(messageText || "Xatolik yuz berdi", {
        richColors: true,
        position: "top-center",
      });
    },
  });

  const { mutate: edit, isPending: editPending } = useMutation({
    mutationFn: ({ body, id }: { id: number; body: ObjectUpdate }) =>
      object_api.update({ body, id }),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["object_list"] });
      toast.success(`Obyekt qo'shildi`);
      setDialogOpen(false);
    },
    onError: (err: AxiosError) => {
      const errMessage = err.response?.data as { message: string };
      const messageText = errMessage.message;
      toast.error(messageText || "Xatolik yuz berdi", {
        richColors: true,
        position: "top-center",
      });
    },
  });

  function onSubmit(values: z.infer<typeof ObjectForm>) {
    if (initialValues) {
      edit({
        body: {
          extra_location: {
            latitude: Number(values.lat),
            longitude: Number(values.long),
          },
          latitude: Number(values.lat),
          longitude: Number(values.long),
          name: values.name,
        },
        id: initialValues.id,
      });
    } else {
      mutate({
        district_id: Number(values.district),
        extra_location: {
          latitude: Number(values.lat),
          longitude: Number(values.long),
        },
        latitude: Number(values.lat),
        longitude: Number(values.long),
        name: values.name,
        user_id: Number(values.user),
      });
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label>Obyekt nomi</Label>
              <FormControl>
                <Input placeholder="Nomi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="user"
          control={form.control}
          render={({ field }) => {
            const selectedUser = user?.results.find(
              (u) => String(u.id) === field.value,
            );
            return (
              <FormItem className="flex flex-col">
                <Label className="text-md">Foydalanuvchi</Label>

                <Popover open={openUser} onOpenChange={setOpenUser}>
                  <PopoverTrigger asChild disabled={initialValues !== null}>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={openUser}
                        className={cn(
                          "w-full h-12 justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {selectedUser
                          ? `${selectedUser.first_name} ${selectedUser.last_name}`
                          : "Foydalanuvchi tanlang"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                  >
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Qidirish..."
                        className="h-9"
                        value={searchUser}
                        onValueChange={setSearchUser}
                      />

                      <CommandList>
                        {isUserLoading ? (
                          <div className="py-6 text-center text-sm">
                            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                          </div>
                        ) : user && user.results.length > 0 ? (
                          <CommandGroup>
                            {user.results.map((u) => (
                              <CommandItem
                                key={u.id}
                                value={`${u.id}`}
                                onSelect={() => {
                                  field.onChange(String(u.id));
                                  setOpenUser(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === String(u.id)
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {u.first_name} {u.last_name} {u.region?.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        ) : (
                          <CommandEmpty>Foydalanuvchi topilmadi</CommandEmpty>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          name="district"
          control={form.control}
          render={({ field }) => {
            const selectedDiscrit = discrit?.results.find(
              (u) => String(u.id) === field.value,
            );
            return (
              <FormItem className="flex flex-col">
                <Label className="text-md">Tumanlar</Label>

                <Popover open={openDiscrit} onOpenChange={setOpenDiscrit}>
                  <PopoverTrigger asChild disabled={initialValues !== null}>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={openDiscrit}
                        className={cn(
                          "w-full h-12 justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {selectedDiscrit
                          ? `${selectedDiscrit.name}`
                          : "Tuman tanlang"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                  >
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Qidirish..."
                        className="h-9"
                        value={searchDiscrit}
                        onValueChange={setSearchDiscrit}
                      />

                      <CommandList>
                        {discritLoading ? (
                          <div className="py-6 text-center text-sm">
                            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                          </div>
                        ) : discrit && discrit.results.length > 0 ? (
                          <CommandGroup>
                            {discrit.results.map((u) => (
                              <CommandItem
                                key={u.id}
                                value={`${u.id}`}
                                onSelect={async () => {
                                  field.onChange(String(u.id));
                                  const selectedDistrict =
                                    discrit.results?.find(
                                      (d) => d.id === Number(u.id),
                                    );
                                  setOpenUser(false);

                                  if (!selectedDistrict) return;

                                  const coordsData = await getCoords(
                                    selectedDistrict?.name,
                                  );
                                  if (!coordsData) return;

                                  setCoords({
                                    latitude: coordsData.lat,
                                    longitude: coordsData.lon,
                                  });
                                  setPolygonCoords(coordsData.polygon);

                                  form.setValue("lat", String(coordsData.lat));
                                  form.setValue("long", String(coordsData.lon));
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === String(u.id)
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {u.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        ) : (
                          <CommandEmpty>Tuman topilmadi</CommandEmpty>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="h-[300px] w-full border rounded-lg overflow-hidden">
          <YMaps query={{ lang: "en_RU" }}>
            <Map
              defaultState={{
                center: [coords.latitude, coords.longitude],
                zoom: 12,
              }}
              width="100%"
              height="100%"
              onClick={handleMapClick}
            >
              <ZoomControl
                options={{
                  position: { right: "10px", bottom: "70px" },
                }}
              />
              <Placemark geometry={[coords.latitude, coords.longitude]} />
              {polygonCoords && (
                <Polygon
                  geometry={polygonCoords}
                  options={{
                    fillColor: "rgba(0, 150, 255, 0.2)",
                    strokeColor: "rgba(0, 150, 255, 0.8)",
                    strokeWidth: 2,
                    interactivityModel: "default#transparent",
                  }}
                />
              )}
              {circleCoords && (
                <Circle
                  geometry={[circleCoords, 300]}
                  options={{
                    fillColor: "rgba(255, 100, 0, 0.3)",
                    strokeColor: "rgba(255, 100, 0, 0.8)",
                    strokeWidth: 2,
                    interactivityModel: "default#transparent",
                  }}
                />
              )}
            </Map>
          </YMaps>
        </div>
        <Button
          className="w-full h-12 bg-blue-500 hover:bg-blue-500 cursor-pointer"
          type="submit"
        >
          {isPending || editPending ? (
            <Loader2 className="animate-spin" />
          ) : initialValues ? (
            "Tahrirlash"
          ) : (
            "Qo'shish"
          )}
        </Button>
      </form>
    </Form>
  );
}
