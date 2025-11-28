import { user_api } from "@/features/users/lib/api";
import type {
  UserCreateReq,
  UserListData,
  UserUpdateReq,
} from "@/features/users/lib/data";
import { AddedUser } from "@/features/users/lib/form";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";

interface UserFormProps {
  initialData: UserListData | null;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddUsers = ({ initialData, setDialogOpen }: UserFormProps) => {
  const form = useForm<z.infer<typeof AddedUser>>({
    resolver: zodResolver(AddedUser),
    defaultValues: {
      firstName: initialData?.first_name || "",
      lastName: initialData?.last_name || "",
      region: initialData?.region.name || "",
      isActive: initialData ? String(initialData.is_active) : "true",
    },
  });
  const queryClient = useQueryClient();

  const { mutate: update, isPending } = useMutation({
    mutationFn: ({ body, id }: { id: number; body: UserUpdateReq }) =>
      user_api.update({ body, id }),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["user_list"] });
      toast.success(`Foydalanuvchi tahrirlandi`);
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

  const { mutate: create, isPending: createPending } = useMutation({
    mutationFn: (body: UserCreateReq) => user_api.create(body),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["user_list"] });
      toast.success(`Foydalanuvchi qo'shildi`);
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

  function onSubmit(values: z.infer<typeof AddedUser>) {
    if (initialData) {
      update({
        body: {
          first_name: values.firstName,
          is_active: values.isActive === "true" ? true : false,
          last_name: values.lastName,
          region: Number(values.region),
        },
        id: initialData.id,
      });
    } else if (initialData === null) {
      create({
        first_name: values.firstName,
        is_active: values.isActive === "true" ? true : false,
        last_name: values.lastName,
        region_id: Number(values.region),
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <Label className="text-md">Ismi</Label>
              <FormControl>
                <Input
                  placeholder="Ismi"
                  {...field}
                  className="!h-12 !text-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <Label className="text-md">Familiyasi</Label>
              <FormControl>
                <Input
                  placeholder="Familiyasi"
                  {...field}
                  className="!h-12 !text-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <Label className="text-md">Hududi</Label>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full !h-12" value={field.value}>
                    <SelectValue placeholder="Hududni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Toshkent</SelectItem>
                    <SelectItem value="2">Samarqand</SelectItem>
                    <SelectItem value="3">Bekobod</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <Label className="text-md mr-4">Foydalanuvchi holati</Label>
              <FormControl>
                <Select
                  value={String(field.value)}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full !h-12">
                    <SelectValue placeholder="Foydalanuvchi holati" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Faol</SelectItem>
                    <SelectItem value="false">Faol emas</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-12 text-lg rounded-lg bg-blue-600 hover:bg-blue-600 cursor-pointer"
        >
          {isPending || createPending ? (
            <Loader2 className="animate-spin" />
          ) : initialData ? (
            "Saqlash"
          ) : (
            "Qo'shish"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AddUsers;
