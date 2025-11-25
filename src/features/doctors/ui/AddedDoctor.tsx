import { fakeDistrict } from "@/features/districts/lib/data";
import type { DoctorListType } from "@/features/doctors/lib/data";
import { DoctorForm } from "@/features/doctors/lib/form";
import { ObjectListData } from "@/features/objects/lib/data";
import { FakeUserList } from "@/features/users/lib/data";
import formatPhone from "@/shared/lib/formatPhone";
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
import { Textarea } from "@/shared/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Circle, Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import { Loader2 } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";

interface Props {
  initialValues: DoctorListType | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  setData: Dispatch<SetStateAction<DoctorListType[]>>;
}

const AddedDoctor = ({ initialValues, setData, setDialogOpen }: Props) => {
  const [load, setLoad] = useState<boolean>(false);
  const form = useForm<z.infer<typeof DoctorForm>>({
    resolver: zodResolver(DoctorForm),
    defaultValues: {
      desc: initialValues?.desc || "",
      district: initialValues?.district.id.toString() || "",
      first_name: initialValues?.first_name || "",
      last_name: initialValues?.last_name || "",
      lat: initialValues?.lat || "41.2949",
      long: initialValues?.long || "69.2361",
      object: initialValues?.object.id.toString() || "",
      phone_number: initialValues?.phone_number || "+998",
      spec: initialValues?.spec || "",
      work: initialValues?.work || "",
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

  function onSubmit(values: z.infer<typeof DoctorForm>) {
    setLoad(true);
    const newObject: DoctorListType = {
      id: initialValues ? initialValues.id : Date.now(),
      user: FakeUserList.find((u) => u.id === Number(values.user))!,
      district: fakeDistrict.find((d) => d.id === Number(values.district))!,
      desc: values.desc,
      first_name: values.first_name,
      last_name: values.last_name,
      lat: values.lat,
      long: values.long,
      object: ObjectListData.find((d) => d.id === Number(values.object))!,
      phone_number: values.phone_number,
      spec: values.spec,
      work: values.work,
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
                    <SelectValue placeholder="Obyekt" />
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
              defaultState={{ center: [Number(lat), Number(long)], zoom: 16 }}
              width="100%"
              height="300px"
              onClick={handleMapClick}
            >
              <Placemark geometry={[Number(lat), Number(long)]} />
              <Circle
                geometry={[[Number(lat), Number(long)], 100]}
                options={{
                  fillColor: "rgba(0,150,255,0.2)",
                  strokeColor: "rgba(0,150,255,0.8)",
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

export default AddedDoctor;
