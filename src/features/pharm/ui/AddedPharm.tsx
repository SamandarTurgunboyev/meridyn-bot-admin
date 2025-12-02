import { factory_api } from "@/features/pharm/lib/api";
import type { FactoryCreate, PharmType } from "@/features/pharm/lib/data";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";

interface Props {
  initialValues: PharmType | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const AddedPharm = ({ initialValues, setDialogOpen }: Props) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof pharmForm>>({
    resolver: zodResolver(pharmForm),
    defaultValues: {
      name: initialValues?.name || "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (body: FactoryCreate) => factory_api.create(body),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["factory_list"] });
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

  const { mutate: update, isPending: updatePending } = useMutation({
    mutationFn: ({ id, body }: { id: number; body: FactoryCreate }) =>
      factory_api.update({ body, id }),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["factory_list"] });
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

  function onSubmit(data: z.infer<typeof pharmForm>) {
    if (!initialValues) {
      mutate({
        name: data.name,
      });
    } else {
      update({
        body: {
          name: data.name,
        },
        id: initialValues.id,
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
            disabled={isPending || updatePending}
          >
            {isPending || updatePending ? (
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
