import { pill_api } from "@/features/pill/lib/api";
import type { PillCreateReq, PillType } from "@/features/pill/lib/data";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";

interface Props {
  initialValues: PillType | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const AddedPill = ({ initialValues, setDialogOpen }: Props) => {
  const [displayPrice, setDisplayPrice] = useState<string>("");
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof createPillFormData>>({
    resolver: zodResolver(createPillFormData),
    defaultValues: {
      name: initialValues?.name || "",
      price: initialValues?.price || "",
    },
  });

  const { mutate: added, isPending: addedPending } = useMutation({
    mutationFn: (body: PillCreateReq) => {
      return pill_api.added(body);
    },
    onSuccess: () => {
      toast.success("Dori qo'shildi");
      setDialogOpen(false);
      queryClient.resetQueries({ queryKey: ["pill_list"] });
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
    mutationFn: ({ body, id }: { id: number; body: PillCreateReq }) => {
      return pill_api.update({ body, id });
    },
    onSuccess: () => {
      toast.success("Dori yangilandi");
      queryClient.resetQueries({ queryKey: ["pill_list"] });
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

  useEffect(() => {
    if (initialValues) {
      setDisplayPrice(formatPrice(initialValues.price));
    }
  }, [initialValues]);

  function onSubmit(data: z.infer<typeof createPillFormData>) {
    if (initialValues) {
      edit({
        id: initialValues.id,
        body: {
          name: data.name,
          price: data.price,
        },
      });
    } else {
      added({
        name: data.name,
        price: data.price,
      });
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
            disabled={addedPending || editPending}
          >
            {addedPending || editPending ? (
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
