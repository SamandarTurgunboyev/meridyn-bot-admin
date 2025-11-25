import type { TourPlanType } from "@/features/tour-plan/lib/data";
import { tourPlanForm } from "@/features/tour-plan/lib/form";
import { FakeUserList } from "@/features/users/lib/data";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Circle, Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import { ChevronDownIcon, Loader2 } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";

interface Props {
  initialValues: TourPlanType | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  setPlans: Dispatch<SetStateAction<TourPlanType[]>>;
}

const AddedTourPlan = ({ initialValues, setDialogOpen, setPlans }: Props) => {
  const [load, setLoad] = useState<boolean>(false);
  const form = useForm<z.infer<typeof tourPlanForm>>({
    resolver: zodResolver(tourPlanForm),
    defaultValues: {
      date: initialValues?.date || undefined,
      district: initialValues?.district || "",
      lat: initialValues?.lat || "41.2949",
      long: initialValues?.long || "69.2361",
      user: initialValues?.user.id.toString() || "",
    },
  });

  const [open, setOpen] = useState(false);

  const lat = form.watch("lat");
  const long = form.watch("long");

  const handleMapClick = (e: { get: (key: string) => number[] }) => {
    const coords = e.get("coords");
    form.setValue("lat", coords[0].toString());
    form.setValue("long", coords[1].toString());
  };

  function onSubmit(values: z.infer<typeof tourPlanForm>) {
    setLoad(true);
    const newObject: TourPlanType = {
      id: initialValues ? initialValues.id : Date.now(),
      user: FakeUserList.find((u) => u.id === Number(values.user))!,
      date: values.date,
      district: values.district,
      lat: values.lat,
      long: values.long,
      status: "planned",
    };

    setTimeout(() => {
      setPlans((prev) => {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="user"
          render={({ field }) => (
            <FormItem>
              <Label>Kim uchun</Label>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
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

        <FormField
          control={form.control}
          name="district"
          render={({ field }) => (
            <FormItem>
              <Label>Manzil</Label>
              <FormControl>
                <Input placeholder="Manzil nomi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <Label>Boradigan kuni</Label>
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-full justify-between font-normal"
                    >
                      {field.value
                        ? new Date(field.value).toLocaleDateString()
                        : "Boradigan kuni"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      captionLayout="dropdown"
                      onSelect={(val) => {
                        field.onChange(val);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
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
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-500 cursor-pointer"
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

export default AddedTourPlan;
