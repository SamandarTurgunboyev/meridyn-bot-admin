"use client";

import { pharmData } from "@/features/pharm/lib/data";
import {
  SpecificationsFakePills,
  type SpecificationsType,
} from "@/features/specifications/lib/data";
import {
  SpecificationsForm,
  type SpecificationsFormType,
} from "@/features/specifications/lib/form";
import { FakeUserList } from "@/features/users/lib/data";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface Props {
  initialValues: SpecificationsType | null;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<SpecificationsType[]>>;
}

export const AddedSpecification = ({
  setData,
  initialValues,
  setDialogOpen,
}: Props) => {
  const form = useForm<SpecificationsFormType>({
    resolver: zodResolver(SpecificationsForm),
    defaultValues: initialValues
      ? {
          client: initialValues.client,
          pharm: String(initialValues.pharm.id),
          percentage: initialValues.percentage,
          totalPrice: initialValues.totalPrice,
          paidPrice: initialValues.paidPrice,
          user: String(initialValues.user.id),
          medicines: [
            ...initialValues.medicines,
            ...SpecificationsFakePills.filter(
              (p) => !initialValues.medicines.some((m) => m.id === p.id),
            ).map((p) => ({
              id: p.id,
              name: p.name,
              count: 0,
              price: p.price,
            })),
          ],
        }
      : {
          client: "",
          pharm: "",
          user: "",
          percentage: 0,
          totalPrice: 0,
          paidPrice: 0,
          medicines: SpecificationsFakePills.map((p) => ({
            id: p.id,
            name: p.name,
            count: 0,
            price: p.price,
          })),
        },
  });

  const medicines = form.watch("medicines");

  const calculateTotal = () => {
    const medicines = form.getValues("medicines");
    const total = medicines.reduce(
      (acc, med) => acc + med.price * med.count,
      0,
    );
    form.setValue("totalPrice", total);

    const percentage = form.getValues("percentage") || 0;
    const paid = Math.round((total * percentage) / 100);
    form.setValue("paidPrice", paid);
  };

  useEffect(() => {
    const subscription = form.watch((__, { name }) => {
      if (name?.startsWith("medicines") || name === "percentage")
        calculateTotal();
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = (values: SpecificationsFormType) => {
    if (initialValues) {
      setData((prev) =>
        prev.map((item) =>
          item.id === initialValues.id
            ? {
                ...item,
                ...values,
                pharm: pharmData.find((e) => e.id === Number(values.pharm))!,
                user: FakeUserList.find((e) => e.id === Number(values.user))!,
              }
            : item,
        ),
      );
    } else {
      setData((prev) => [
        ...prev,
        {
          ...values,
          id: Date.now(),
          pharm: pharmData.find((e) => e.id === Number(values.pharm))!,
          user: FakeUserList[1],
        },
      ]);
    }
    setDialogOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="pharm"
          render={({ field }) => (
            <FormItem>
              <Label>Farmasevtika</Label>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full !h-12">
                    <SelectValue placeholder="Farmasevtikalar" />
                  </SelectTrigger>
                  <SelectContent>
                    {pharmData.map((e) => (
                      <SelectItem value={String(e.id)} key={e.id}>
                        {e.name}
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
          name="user"
          render={({ field }) => (
            <FormItem>
              <Label>Foydalanuvchi</Label>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full !h-12">
                    <SelectValue placeholder="Foydalanuvchilar" />
                  </SelectTrigger>
                  <SelectContent>
                    {FakeUserList.map((e) => (
                      <SelectItem value={String(e.id)} key={e.id}>
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
          name="client"
          render={({ field }) => (
            <FormItem>
              <Label>Xaridor Nomi</Label>
              <FormControl>
                <Input {...field} placeholder="Xaridor nomi..." />
              </FormControl>{" "}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Medicines list */}
        <div className="space-y-2">
          {medicines.map((med, index) => (
            <div
              key={med.id}
              className="flex justify-between items-center space-x-2"
            >
              <p className="w-40">{med.name}</p>

              <div className="flex gap-1">
                <FormControl>
                  <Input
                    placeholder="Soni"
                    className="w-20"
                    value={med.count}
                    onChange={(e) => {
                      let value = parseInt(e.target.value, 10);
                      if (isNaN(value)) value = 0;

                      const updatedMedicines = [...medicines];
                      updatedMedicines[index].count = value;
                      form.setValue("medicines", updatedMedicines);
                      calculateTotal();
                    }}
                  />
                </FormControl>

                <FormControl>
                  <Input
                    type="text"
                    placeholder="Narxi"
                    className="w-24"
                    value={formatPrice(med.price * med.count)}
                    readOnly
                  />
                </FormControl>
              </div>
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="percentage"
          render={({ field }) => (
            <FormItem>
              <Label>To'lov foizi (%)</Label>
              <FormControl>
                <Input
                  {...field}
                  className="w-full"
                  onChange={(e) => {
                    let value = parseInt(e.target.value, 10);
                    if (isNaN(value)) value = 0;
                    if (value < 0) value = 0;
                    if (value > 100) value = 100;
                    field.onChange(value);
                    calculateTotal();
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="totalPrice"
            render={({ field }) => (
              <FormItem>
                <Label>Jami Narx</Label>
                <FormControl>
                  <Input {...field} readOnly value={formatPrice(field.value)} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paidPrice"
            render={({ field }) => (
              <FormItem>
                <Label>To'lanadi</Label>
                <FormControl>
                  <Input {...field} readOnly value={formatPrice(field.value)} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-500 cursor-pointer h-12"
        >
          Saqlash
        </Button>
      </form>
    </Form>
  );
};
