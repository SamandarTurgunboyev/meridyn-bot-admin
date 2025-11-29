import { region_api } from "@/features/region/lib/api";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";

interface Props {
  initialValues: RegionType | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const AddedRegion = ({ initialValues, setDialogOpen }: Props) => {
  const form = useForm<z.infer<typeof regionForm>>({
    resolver: zodResolver(regionForm),
    defaultValues: { name: initialValues?.name || "" },
  });
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (body: { name: string }) => region_api.create(body),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["region_list"] });
      toast.success(`Yangi hudud qo'shildi`);
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
    mutationFn: ({ body, id }: { id: number; body: { name: string } }) =>
      region_api.update({ body, id }),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["region_list"] });
      toast.success(`Yangi hudud qo'shildi`);
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

  function onSubmit(value: z.infer<typeof regionForm>) {
    if (initialValues) {
      edit({ id: initialValues.id, body: { name: value.name } });
    } else {
      mutate({
        name: value.name,
      });
    }
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

        <Button
          type="submit"
          className="w-full bg-blue-500 cursor-pointer hover:bg-blue-500"
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

export default AddedRegion;
