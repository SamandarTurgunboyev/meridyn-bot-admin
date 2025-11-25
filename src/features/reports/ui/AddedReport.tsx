import type { ReportsTypeList } from "@/features/reports/lib/data";
import { reportsForm } from "@/features/reports/lib/form";
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
  initialValues: ReportsTypeList | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  setPlans: Dispatch<SetStateAction<ReportsTypeList[]>>;
}

const AddedReport = ({ initialValues, setDialogOpen, setPlans }: Props) => {
  const [load, setLoad] = useState<boolean>(false);
  const [displayPrice, setDisplayPrice] = useState<string>("");
  const form = useForm<z.infer<typeof reportsForm>>({
    resolver: zodResolver(reportsForm),
    defaultValues: {
      amount: initialValues?.amount || "",
      pharm_name: initialValues?.pharm_name || "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      setDisplayPrice(formatPrice(initialValues.amount));
    }
  }, [initialValues]);

  function onSubmit(values: z.infer<typeof reportsForm>) {
    setLoad(true);
    const newReport: ReportsTypeList = {
      id: initialValues ? initialValues.id : Date.now(),
      amount: values.amount,
      pharm_name: values.pharm_name,
      month: new Date(),
    };

    setTimeout(() => {
      setPlans((prev) => {
        if (initialValues) {
          return prev.map((item) =>
            item.id === initialValues.id ? newReport : item,
          );
        } else {
          return [...prev, newReport];
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
          name="pharm_name"
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
          name="amount"
          render={() => (
            <FormItem>
              <Label>Berilgan summa</Label>
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
                      form.setValue("amount", String(num));
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

        <Button className="w-full h-12 bg-blue-500 cursor-pointer hover:bg-blue-500">
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

export default AddedReport;
