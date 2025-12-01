import { discrit_api } from "@/features/districts/lib/api";
import { doctor_api } from "@/features/doctors/lib/api";
import type {
  CreateDoctorReq,
  DoctorListResData,
  UpdateDoctorReq,
} from "@/features/doctors/lib/data";
import { DoctorForm } from "@/features/doctors/lib/form";
import { object_api } from "@/features/objects/lib/api";
import { user_api } from "@/features/users/lib/api";
import formatPhone from "@/shared/lib/formatPhone";
import onlyNumber from "@/shared/lib/onlyNumber";
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
import { Textarea } from "@/shared/ui/textarea";
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
  initialValues: DoctorListResData | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

interface CoordsData {
  lat: number;
  lon: number;
  polygon: [number, number][][];
}

const AddedDoctor = ({ initialValues, setDialogOpen }: Props) => {
  const queryClient = useQueryClient();
  const [searchUser, setSearchUser] = useState<string>("");
  const [searchObject, setSearchObject] = useState<string>("");
  const [selectDiscrit, setSelectedDiscrit] = useState<string>("");
  const [searchDiscrit, setSearchDiscrit] = useState<string>("");
  const [openUser, setOpenUser] = useState<boolean>(false);
  const [openDiscrit, setOpenDiscrit] = useState<boolean>(false);
  const [openObject, setOpenObject] = useState<boolean>(false);

  const form = useForm<z.infer<typeof DoctorForm>>({
    resolver: zodResolver(DoctorForm),
    defaultValues: {
      desc: initialValues?.description || "",
      district: initialValues?.district.id.toString() || "",
      first_name: initialValues?.first_name || "",
      last_name: initialValues?.last_name || "",
      lat: String(initialValues?.latitude) || "41.2949",
      long: String(initialValues?.longitude) || "69.2361",
      object: initialValues?.place.id.toString() || "",
      phone_number: initialValues?.phone_number || "+998",
      spec: initialValues?.sphere || "",
      work: initialValues?.work_place || "",
      user: initialValues?.user.id.toString() || "",
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

  const { data: object, isLoading: isObjectLoading } = useQuery({
    queryKey: ["object_list", searchUser, selectDiscrit],
    queryFn: () => {
      const params: {
        name?: string;
        district?: string;
      } = {
        name: searchUser,
        district: selectDiscrit,
      };

      return object_api.list(params);
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

  const { mutate, isPending } = useMutation({
    mutationFn: (body: CreateDoctorReq) => doctor_api.create(body),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["doctor_list"] });
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
    mutationFn: ({ body, id }: { body: UpdateDoctorReq; id: number }) =>
      doctor_api.update({ body, id }),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["doctor_list"] });
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
            latitude: Number(initialValues.latitude),
            longitude: Number(initialValues.longitude),
          });
          setPolygonCoords(result.polygon);
          form.setValue("lat", String(result.lat));
          form.setValue("long", String(result.lon));
          setCircleCoords([
            Number(initialValues.latitude),
            Number(initialValues.longitude),
          ]);
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

  function onSubmit(values: z.infer<typeof DoctorForm>) {
    if (initialValues) {
      edit({
        id: initialValues.id,
        body: {
          description: values.desc,
          extra_location: {
            latitude: Number(values.lat),
            longitude: Number(values.long),
          },
          first_name: values.first_name,
          last_name: values.last_name,
          latitude: Number(values.lat),
          longitude: Number(values.long),
          phone_number: onlyNumber(values.phone_number),
          sphere: values.spec,
          work_place: values.work,
        },
      });
    } else {
      mutate({
        description: values.desc,
        district_id: Number(values.district),
        extra_location: {
          latitude: Number(values.lat),
          longitude: Number(values.long),
        },
        first_name: values.first_name,
        last_name: values.last_name,
        latitude: Number(values.lat),
        longitude: Number(values.long),
        phone_number: onlyNumber(values.phone_number),
        place_id: Number(values.object),
        sphere: values.spec,
        user_id: Number(values.user),
        work_place: values.work,
      });
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <Label>Ism</Label>
              <FormControl>
                <Input placeholder="Ismi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <Label>Familiya</Label>
              <FormControl>
                <Input placeholder="Familiyasi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <Label>Telefon raqami</Label>
              <FormControl>
                <Input
                  placeholder="+998 90 123-45-67"
                  {...field}
                  value={formatPhone(field.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="work"
          render={({ field }) => (
            <FormItem>
              <Label>Ish joyi</Label>
              <FormControl>
                <Input placeholder="114-poliklinika" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="spec"
          render={({ field }) => (
            <FormItem>
              <Label>Sohasi</Label>
              <FormControl>
                <Input placeholder="Kardiolog" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem>
              <Label>Tavsif</Label>
              <FormControl>
                <Textarea
                  placeholder="Tavsif"
                  {...field}
                  className="min-h-32 max-h-52"
                />
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
                                {u.first_name} {u.last_name} {u.region.name}
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

                                  setSelectedDiscrit(selectedDistrict.name);

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
                                  setOpenDiscrit(false);
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

        <FormField
          name="object"
          control={form.control}
          render={({ field }) => {
            const selectedObject = object?.results.find(
              (u) => String(u.id) === field.value,
            );
            return (
              <FormItem className="flex flex-col">
                <Label className="text-md">Obyektlar</Label>

                <Popover open={openObject} onOpenChange={setOpenObject}>
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
                        {selectedObject
                          ? `${selectedObject.name}`
                          : "Obyekt tanlang"}
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
                        value={searchObject}
                        onValueChange={setSearchObject}
                      />

                      <CommandList>
                        {isObjectLoading ? (
                          <div className="py-6 text-center text-sm">
                            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                          </div>
                        ) : object && object.results.length > 0 ? (
                          <CommandGroup>
                            {object.results.map((u) => (
                              <CommandItem
                                key={u.id}
                                value={`${u.id}`}
                                onSelect={async () => {
                                  field.onChange(String(u.id));
                                  const selectedObject = object.results?.find(
                                    (d) => d.id === Number(u.id),
                                  );
                                  setOpenUser(false);

                                  if (!selectedObject) return;

                                  setCircleCoords([
                                    selectedObject.latitude,
                                    selectedObject.longitude,
                                  ]);
                                  setCoords({
                                    latitude: selectedObject.latitude,
                                    longitude: selectedObject.longitude,
                                  });

                                  form.setValue(
                                    "lat",
                                    String(selectedObject.latitude),
                                  );
                                  form.setValue(
                                    "long",
                                    String(selectedObject.longitude),
                                  );
                                  setOpenObject(false);
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
                          <CommandEmpty>Obyekt topilmadi</CommandEmpty>
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
};

export default AddedDoctor;
