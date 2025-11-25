import { fakeDistrict } from "@/features/districts/lib/data";
import { ObjectListData } from "@/features/objects/lib/data";
import type { PharmciesType } from "@/features/pharmacies/lib/data";
import { PharmForm } from "@/features/pharmacies/lib/form";
import { FakeUserList } from "@/features/users/lib/data";
import formatPhone from "@/shared/lib/formatPhone";
import onlyNumber from "@/shared/lib/onlyNumber";
import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Circle, Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import { Loader2 } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";

interface Props {
  initialValues: PharmciesType | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  setData: Dispatch<SetStateAction<PharmciesType[]>>;
}

const AddedPharmacies = ({ initialValues, setData, setDialogOpen }: Props) => {
  const [load, setLoad] = useState<boolean>(false);
  const form = useForm<z.infer<typeof PharmForm>>({
    resolver: zodResolver(PharmForm),
    defaultValues: {
      additional_phone: initialValues?.additional_phone || "+998",
      district: initialValues?.district.id.toString() || "",
      inn: initialValues?.inn || "",
      lat: initialValues?.lat || "41.2949",
      long: initialValues?.long || "69.2361",
      name: initialValues?.name || "",
      object: initialValues?.object.id.toString() || "",
      phone_number: initialValues?.phone_number || "+998",
      user: initialValues?.user.id.toString() || "",
    },
  });

  const lat = form.watch("lat");
  const long = form.watch("long");

  const handleMapClick = (e: { get: (key: string) => number[] }) => {
    const coords = e.get("coords");
    form.setValue("lat", coords[0].toString());
    form.setValue("long", coords[1].toString());
  };

  function onSubmit(values: z.infer<typeof PharmForm>) {
    setLoad(true);
    const newObject: PharmciesType = {
      id: initialValues ? initialValues.id : Date.now(),
      name: values.name,
      lat: values.lat,
      long: values.long,
      user: FakeUserList.find((u) => u.id === Number(values.user))!,
      district: fakeDistrict.find((d) => d.id === Number(values.district))!,
      additional_phone: onlyNumber(values.additional_phone),
      inn: values.inn,
      object: ObjectListData.find((o) => o.id === Number(values.object))!,
      phone_number: onlyNumber(values.phone_number),
    };

    setTimeout(() => {
      setData((prev) => {
        if (initialValues) {
          return prev.map((item) =>
            item.id === initialValues.id ? newObject : item,
          );
        } else {
          return [...prev, newObject];
        }
      });
      setLoad(false);
      setDialogOpen(false);
    }, 2000);
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label>Dorixona nomi</Label>
              <FormControl>
                <Input placeholder="Nomi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="inn"
          render={({ field }) => (
            <FormItem>
              <Label>Inn</Label>
              <FormControl>
                <Input placeholder="Inn" {...field} />
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
              <Label>Dorixonaning boshlig'ini raqami</Label>
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
          name="additional_phone"
          render={({ field }) => (
            <FormItem>
              <Label>Ma'sul shaxsning raqami</Label>
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
          name="district"
          render={({ field }) => (
            <FormItem>
              <Label>Tuman</Label>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full !h-12">
                    <SelectValue placeholder="Tumanlar" />
                  </SelectTrigger>
                  <SelectContent>
                    {fakeDistrict.map((e) => (
                      <SelectItem key={e.id} value={String(e.id)}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="object"
          render={({ field }) => (
            <FormItem>
              <Label>Obyekt</Label>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full !h-12">
                    <SelectValue placeholder="Obyektlar" />
                  </SelectTrigger>
                  <SelectContent>
                    {ObjectListData.map((e) => (
                      <SelectItem key={e.id} value={String(e.id)}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user"
          render={({ field }) => (
            <FormItem>
              <Label>Foydalanuvchi</Label>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full !h-12">
                    <SelectValue placeholder="Foydalanuvchilar" />
                  </SelectTrigger>
                  <SelectContent>
                    {FakeUserList.map((e) => (
                      <SelectItem value={String(e.id)}>
                        {e.firstName} {e.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="h-[300px] w-full border rounded-lg overflow-hidden">
          <YMaps>
            <Map
              defaultState={{
                center: [Number(lat), Number(long)],
                zoom: 16,
              }}
              width="100%"
              height="300px"
              onClick={handleMapClick}
            >
              <Placemark geometry={[Number(lat), Number(long)]} />
              <Circle
                geometry={[[Number(lat), Number(long)], 100]}
                options={{
                  fillColor: "rgba(0, 150, 255, 0.2)",
                  strokeColor: "rgba(0, 150, 255, 0.8)",
                  strokeWidth: 2,
                  interactivityModel: "default#transparent",
                }}
              />
            </Map>
          </YMaps>
        </div>
        <Button
          className="w-full h-12 bg-blue-500 hover:bg-blue-500 cursor-pointer"
          type="submit"
        >
          {load ? (
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

export default AddedPharmacies;
