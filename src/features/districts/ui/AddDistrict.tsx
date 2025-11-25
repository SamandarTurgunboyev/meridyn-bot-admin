import type { District } from "@/features/districts/lib/data";
import { addDistrict } from "@/features/districts/lib/form";
import { FakeUserList } from "@/features/users/lib/data";
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
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type FormValues = z.infer<typeof addDistrict>;

interface Props {
  initialValues: District | null;
  setDistricts: Dispatch<SetStateAction<District[]>>;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AddDistrict({
  initialValues,
  setDistricts,
  setDialogOpen,
}: Props) {
  const [load, setLoad] = useState<boolean>(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(addDistrict),
    defaultValues: {
      name: initialValues?.name ?? "",
      userId: initialValues ? String(initialValues.user.id) : "",
    },
  });

  function onSubmit(values: FormValues) {
    const selectedUser = FakeUserList.find(
      (u) => u.id === Number(values.userId),
    );

    if (!selectedUser) return;
    setLoad(true);
    if (initialValues) {
      setTimeout(() => {
        setDistricts((prev) =>
          prev.map((d) =>
            d.id === initialValues.id
              ? {
                  ...d,
                  name: values.name,
                  user: selectedUser,
                }
              : d,
          ),
        );
        setDialogOpen(false);
        setLoad(false);
      }, 2000);
    } else {
      setTimeout(() => {
        setDistricts((prev) => [
          ...prev,
          {
            id: prev.length ? prev[prev.length - 1].id + 1 : 1,
            name: values.name,
            user: selectedUser,
          },
        ]);
        setDialogOpen(false);
        setLoad(false);
      }, 2000);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Label className="text-md">Tuman nomi</Label>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Chilonzor tumani"
                  className="h-12 text-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="userId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Label className="text-md">Kim qo‘shgan</Label>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full !h-12">
                    <SelectValue placeholder="Foydalanuvchi tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {FakeUserList.map((u) => (
                      <SelectItem key={u.id} value={String(u.id)}>
                        {u.firstName} {u.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SUBMIT */}
        <Button className="w-full h-12 bg-blue-700 hover:bg-blue-700 cursor-pointer">
          {load ? (
            <Loader2 className="animate-spin" />
          ) : initialValues ? (
            "Tahrirlash"
          ) : (
            "Qo‘shish"
          )}
        </Button>
      </form>
    </Form>
  );
}
