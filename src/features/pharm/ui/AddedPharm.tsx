import type { PharmType } from "@/features/pharm/lib/data";
import { pharmForm } from "@/features/pharm/lib/form";
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
  initialValues: PharmType | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  setPlans: Dispatch<SetStateAction<PharmType[]>>;
}

const AddedPharm = ({ initialValues, setDialogOpen, setPlans }: Props) => {
  const [load, setLoad] = useState(false);
  const form = useForm<z.infer<typeof pharmForm>>({
    resolver: zodResolver(pharmForm),
    defaultValues: {
      name: initialValues?.name || "",
    },
  });

  function onSubmit(data: z.infer<typeof pharmForm>) {
    setLoad(true);
    if (initialValues) {
      setTimeout(() => {
        setPlans((prev) =>
          prev.map((plan) =>
            plan.id === initialValues.id
              ? {
                  ...plan,
                  ...data,
                }
              : plan,
          ),
        );
        setLoad(false);
        setDialogOpen(false);
      }, 2000);
    } else {
      setTimeout(() => {
        setPlans((prev) => [
          ...prev,
          {
            id: prev.length ? prev[prev.length - 1].id + 1 : 1,
            name: data.name,
          },
        ]);
        setLoad(false);
        setDialogOpen(false);
      }, 2000);
    }
  }

  return (
    <div className="mt-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label className="text-md">Farmasevtika nomi</Label>
                <FormControl>
                  <Input
                    placeholder="Farmasevtika nomi"
                    className="h-12 !text-md"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full h-12 text-lg rounded-lg bg-blue-600 hover:bg-blue-600 cursor-pointer"
            disabled={load}
          >
            {load ? (
              <Loader2 className="animate-spin" />
            ) : initialValues ? (
              "Tahrirlash"
            ) : (
              "Saqlash"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddedPharm;
