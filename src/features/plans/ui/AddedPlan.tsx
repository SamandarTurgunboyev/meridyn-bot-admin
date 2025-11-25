import type { Plan } from "@/features/plans/lib/data";
import { createPlanFormData } from "@/features/plans/lib/form";
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
import { Textarea } from "@/shared/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

interface Props {
  initialValues?: Plan | null;
  setDialogOpen: (open: boolean) => void;
  setPlans: React.Dispatch<React.SetStateAction<Plan[]>>;
}

const AddedPlan = ({ initialValues, setDialogOpen, setPlans }: Props) => {
  const [load, setLoad] = useState(false);
  const form = useForm<z.infer<typeof createPlanFormData>>({
    resolver: zodResolver(createPlanFormData),
    defaultValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      user: initialValues ? String(initialValues.user.id) : "",
    },
  });

  function onSubmit(data: z.infer<typeof createPlanFormData>) {
    setLoad(true);
    if (initialValues) {
      setTimeout(() => {
        setPlans((prev) =>
          prev.map((plan) =>
            plan.id === initialValues.id
              ? {
                  ...plan,
                  ...data,
                  user: FakeUserList.find((u) => u.id === Number(data.user))!, // user obyekt
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
            description: data.description,
            user: FakeUserList.find((u) => u.id === Number(data.user))!, // user obyekt
            status: "Bajarilmagan",
            createdAt: new Date(),
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
            name="user"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Label className="text-md">Kimga tegishli</Label>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full !h-12">
                      <SelectValue placeholder="foydalanuvchi" />
                    </SelectTrigger>
                    <SelectContent>
                      {FakeUserList.map((e) => (
                        <SelectItem value={String(e.id)}>
                          {e.firstName} {e.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label className="text-md">Reja nomi</Label>
                <FormControl>
                  <Input
                    placeholder="Reja nomi"
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <Label className="text-md">Reja tavsifi</Label>
                <FormControl>
                  <Textarea
                    placeholder="Reja tavsifi"
                    className="min-h-32 max-h-52 !text-md"
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

export default AddedPlan;
