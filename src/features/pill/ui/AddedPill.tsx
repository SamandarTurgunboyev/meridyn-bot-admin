import type { PillType } from "@/features/pill/lib/data";
import { createPillFormData } from "@/features/pill/lib/form";
import formatPrice from "@/shared/lib/formatPrice";
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
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";

interface Props {
  initialValues: PillType | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  setPlans: Dispatch<SetStateAction<PillType[]>>;
}

const AddedPill = ({ initialValues, setDialogOpen, setPlans }: Props) => {
  const [load, setLoad] = useState(false);
  const [displayPrice, setDisplayPrice] = useState<string>("");
  const form = useForm<z.infer<typeof createPillFormData>>({
    resolver: zodResolver(createPillFormData),
    defaultValues: {
      name: initialValues?.name || "",
      price: initialValues?.price || "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      setDisplayPrice(formatPrice(initialValues.price));
    }
  }, [initialValues]);

  function onSubmit(data: z.infer<typeof createPillFormData>) {
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
            price: data.price,
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
                <Label className="text-md">Dori nomi</Label>
                <FormControl>
                  <Input
                    placeholder="Dori nomi"
                    className="h-12 !text-md"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={() => (
              <FormItem>
                <Label>Narxi</Label>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="1 500 000"
                    value={displayPrice}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "");
                      const num = Number(raw);
                      if (!isNaN(num)) {
                        form.setValue("price", String(num));
                        setDisplayPrice(raw ? formatPrice(num) : "");
                      }
                    }}
                    className="h-12 !text-md"
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

export default AddedPill;
