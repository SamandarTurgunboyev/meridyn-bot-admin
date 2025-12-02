"use client";

import { factory_api } from "@/features/pharm/lib/api";
import { pill_api } from "@/features/pill/lib/api";
import { order_api } from "@/features/specifications/lib/api";
import {
  type OrderCreateReq,
  type OrderListDataRes,
  type OrderUpdateReq,
} from "@/features/specifications/lib/data";
import {
  SpecificationsForm,
  type SpecificationsFormType,
} from "@/features/specifications/lib/form";
import { user_api } from "@/features/users/lib/api";
import formatPrice from "@/shared/lib/formatPrice";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  initialValues: OrderListDataRes | null;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddedSpecification = ({ initialValues, setDialogOpen }: Props) => {
  const queryClient = useQueryClient();
  const { data: pill } = useQuery({
    queryKey: ["pill_list", initialValues],
    queryFn: () =>
      pill_api.list({
        limit: 999,
      }),
    select(data) {
      return data.data.data;
    },
  });

  const [userSearch, setUserSearch] = useState<string>("");
  const [openUser, setOpenUser] = useState<boolean>(false);

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user_list", userSearch, initialValues],
    queryFn: () => user_api.list({ search: userSearch }),
    select(data) {
      return data.data.data.results;
    },
  });

  const [factorySearch, setFactorySearch] = useState<string>("");
  const [openFactory, setOpenFactory] = useState<boolean>(false);

  const { data: pharm, isLoading: isPharmLoading } = useQuery({
    queryKey: ["factory_list", userSearch, initialValues],
    queryFn: () => factory_api.list({ name: factorySearch }),
    select(data) {
      return data.data.data.results;
    },
  });

  const { mutate: create, isPending: createPending } = useMutation({
    mutationFn: (body: OrderCreateReq) => order_api.create(body),
    onSuccess: () => {
      setDialogOpen(false);
      queryClient.resetQueries({ queryKey: ["order_list"] });
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
    mutationFn: ({ body, id }: { id: number; body: OrderUpdateReq }) =>
      order_api.update({ body, id }),
    onSuccess: () => {
      setDialogOpen(false);
      queryClient.resetQueries({ queryKey: ["order_list"] });
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

  const form = useForm<SpecificationsFormType>({
    resolver: zodResolver(SpecificationsForm),
    defaultValues: {
      client: "",
      pharm: "",
      user: "",
      percentage: 0,
      totalPrice: 0,
      paidPrice: 0,
      medicines: [],
    },
  });

  useEffect(() => {
    if (!pill) return;

    if (initialValues) {
      const mergedMedicines = [
        ...initialValues.order_items.map((item) => {
          const pillItem = pill.results.find((p) => p.id === item.product);

          return {
            id: item.product,
            name: pillItem ? pillItem.name : "Unknown",
            price: pillItem ? Number(pillItem.price) : 0,
            count: Number(item.quantity),
          };
        }),

        ...pill.results
          .filter(
            (p) => !initialValues.order_items.some((m) => m.product === p.id),
          )
          .map((p) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            count: 0,
          })),
      ];

      form.reset({
        client: initialValues.employee_name,
        pharm: String(initialValues.factory.id),
        percentage: initialValues.advance,
        totalPrice: Number(initialValues.total_price),
        paidPrice: Number(initialValues.paid_price),
        user: String(initialValues.user.id),
        medicines: mergedMedicines,
      });

      return;
    }

    const fakeMedicines = pill.results.map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      count: 0,
    }));

    form.reset({
      client: "",
      pharm: "",
      user: "",
      percentage: 0,
      totalPrice: 0,
      paidPrice: 0,
      medicines: fakeMedicines,
    });
  }, [pill, initialValues, form]);

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
    if (!initialValues) {
      const items = medicines
        .filter((med) => med.count > 0)
        .map((med) => ({
          product: med.id,
          quantity: med.count,
          total_price: (med.price * med.count).toFixed(2),
        }));

      const total_price = items
        .reduce((sum, item) => sum + parseFloat(item.total_price), 0)
        .toFixed(2);

      create({
        advance: values.percentage,
        employee_name: values.client,
        factory_id: Number(values.pharm),
        paid_price: String(values.paidPrice),
        total_price,
        items,
        user_id: Number(values.user),
      });
    } else if (initialValues) {
      const items = medicines
        .filter((med) => med.count > 0)
        .map((med) => ({
          product_id: med.id,
          quantity: med.count,
          total_price: (med.price * med.count).toFixed(2),
        }));

      const total_price = items
        .reduce((sum, item) => sum + parseFloat(item.total_price), 0)
        .toFixed(2);

      update({
        body: {
          advance: values.percentage,
          employee_name: values.client,
          paid_price: String(values.paidPrice),
          total_price,
          items: items,
          factory_id: Number(values.pharm),
          user_id: Number(values.user),
        },
        id: initialValues.id,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="pharm"
          control={form.control}
          render={({ field }) => {
            const selectedUser = pharm?.find(
              (u) => String(u.id) === field.value,
            );
            return (
              <FormItem className="flex flex-col">
                <Label className="text-md">Farmasevtika</Label>

                <Popover open={openFactory} onOpenChange={setOpenFactory}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={openFactory}
                        className={cn(
                          "w-full h-12 justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {selectedUser
                          ? `${selectedUser.name}`
                          : "Foydalanuvchi tanlang"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                  >
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Qidirish..."
                        className="h-9"
                        value={factorySearch}
                        onValueChange={setFactorySearch}
                      />

                      <CommandList>
                        {isPharmLoading ? (
                          <div className="py-6 text-center text-sm">
                            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                          </div>
                        ) : pharm && pharm.length > 0 ? (
                          <CommandGroup>
                            {pharm.map((u) => (
                              <CommandItem
                                key={u.id}
                                value={`${u.id}`}
                                onSelect={() => {
                                  field.onChange(String(u.id));
                                  setOpenFactory(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === String(u.id)
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {u.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        ) : (
                          <CommandEmpty>Farmasevtika topilmadi</CommandEmpty>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          name="user"
          control={form.control}
          render={({ field }) => {
            const selectedUser = user?.find(
              (u) => String(u.id) === field.value,
            );
            return (
              <FormItem className="flex flex-col">
                <Label className="text-md">Foydalanuvchi</Label>

                <Popover open={openUser} onOpenChange={setOpenUser}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={openUser}
                        className={cn(
                          "w-full h-12 justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {selectedUser
                          ? `${selectedUser.first_name} ${selectedUser.last_name}`
                          : "Foydalanuvchi tanlang"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                  >
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Qidirish..."
                        className="h-9"
                        value={userSearch}
                        onValueChange={setUserSearch}
                      />

                      <CommandList>
                        {isUserLoading ? (
                          <div className="py-6 text-center text-sm">
                            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                          </div>
                        ) : user && user.length > 0 ? (
                          <CommandGroup>
                            {user.map((u) => (
                              <CommandItem
                                key={u.id}
                                value={`${u.id}`}
                                onSelect={() => {
                                  field.onChange(String(u.id));
                                  setOpenUser(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === String(u.id)
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {u.first_name} {u.last_name} {u.region.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        ) : (
                          <CommandEmpty>Foydalanuvchi topilmadi</CommandEmpty>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            );
          }}
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
              <div className="flex flex-col">
                <p className="w-40">{med.name}</p>
                <p>Narxi:{formatPrice(med.price)}</p>
              </div>

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
          disabled={createPending || updatePending}
          className="w-full bg-blue-500 hover:bg-blue-500 cursor-pointer h-12"
        >
          {createPending || updatePending ? <Loader2 /> : "Saqlash"}
        </Button>
      </form>
    </Form>
  );
};
