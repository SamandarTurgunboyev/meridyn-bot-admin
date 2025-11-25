import type { User } from "@/features/users/lib/data";
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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";

interface UserFormProps {
  initialData?: User | null;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddUsers = ({ initialData, setUsers, setDialogOpen }: UserFormProps) => {
  const [load, setLoad] = useState(false);
  const form = useForm<z.infer<typeof AddedUser>>({
    resolver: zodResolver(AddedUser),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      region: initialData?.region || "",
      isActive: initialData ? String(initialData.isActive) : "true",
    },
  });

  function onSubmit(values: z.infer<typeof AddedUser>) {
    setLoad(true);
    if (initialData) {
      setTimeout(() => {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === initialData.id
              ? {
                  ...user,
                  ...values,
                  isActive: values.isActive === "true" ? true : false,
                }
              : user,
          ),
        );
        setLoad(false);
        setDialogOpen(false);
      }, 2000);
    } else {
      setTimeout(() => {
        setUsers((prev) => [
          ...prev,
          {
            id: prev.length ? prev[prev.length - 1].id + 1 : 1,
            ...values,
            isActive: values.isActive === "true" ? true : false,
          },
        ]);
        setLoad(false);
        setDialogOpen(false);
      }, 2000);
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
                    <SelectItem value="Toshkent">Toshkent</SelectItem>
                    <SelectItem value="Samarqand">Samarqand</SelectItem>
                    <SelectItem value="Bekobod">Bekobod</SelectItem>
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
          {load ? (
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
