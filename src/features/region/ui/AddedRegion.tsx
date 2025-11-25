import type { RegionType } from "@/features/region/lib/data";
import { regionForm } from "@/features/region/lib/form";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";

interface Props {
  initialValues: RegionType | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  setPlans: Dispatch<SetStateAction<RegionType[]>>;
}

const AddedRegion = ({ initialValues, setDialogOpen, setPlans }: Props) => {
  const [load, setLoad] = useState<boolean>(false);
  const form = useForm<z.infer<typeof regionForm>>({
    resolver: zodResolver(regionForm),
    defaultValues: { name: initialValues?.name || "" },
  });

  function onSubmit(value: z.infer<typeof regionForm>) {
    setLoad(true);

    setTimeout(() => {
      setPlans((prev) => {
        if (initialValues) {
          return prev.map((item) =>
            item.id === initialValues.id ? { ...item, ...value } : item,
          );
        }
        return [
          ...prev,
          { id: prev.length ? prev[prev.length - 1].id + 1 : 1, ...value },
        ];
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label>Nomi</Label>
              <FormControl>
                <Input placeholder="Nomi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full bg-blue-500 cursor-pointer hover:bg-blue-500">
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

export default AddedRegion;
