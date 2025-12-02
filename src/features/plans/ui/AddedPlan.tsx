import { plans_api } from "@/features/plans/lib/api";
import type {
  PlanCreateReq,
  PlanListData,
  PlanUpdateReq,
} from "@/features/plans/lib/data";
import { createPlanFormData } from "@/features/plans/lib/form";
import { user_api } from "@/features/users/lib/api";
import formatDate from "@/shared/lib/formatDate";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
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
import { Textarea } from "@/shared/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Check, ChevronDownIcon, ChevronsUpDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface Props {
  initialValues?: PlanListData | null;
  setDialogOpen: (open: boolean) => void;
}

const AddedPlan = ({ initialValues, setDialogOpen }: Props) => {
  const form = useForm<z.infer<typeof createPlanFormData>>({
    resolver: zodResolver(createPlanFormData),
    defaultValues: {
      name: initialValues?.title || "",
      description: initialValues?.description || "",
      user: initialValues ? String(initialValues.user.id) : "",
      date: initialValues ? initialValues?.date : "",
    },
  });
  const [searchUser, setSearchUser] = useState<string>("");
  const [openUser, setOpenUser] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user_list", searchUser],
    queryFn: () => {
      const params: {
        limit?: number;
        offset?: number;
        search?: string;
        is_active?: boolean | string;
        region_id?: number;
      } = {
        limit: 8,
        search: searchUser,
      };

      return user_api.list(params);
    },
    select(data) {
      return data.data.data;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (body: PlanCreateReq) => plans_api.create(body),
    onSuccess: () => {
      setDialogOpen(false);
      toast.success("Reja qo'shildi");
      queryClient.refetchQueries({ queryKey: ["plan_list"] });
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
    mutationFn: ({ body, id }: { body: PlanUpdateReq; id: number }) =>
      plans_api.update({ body, id }),
    onSuccess: () => {
      setDialogOpen(false);
      toast.success("Reja tahrirlandi");
      queryClient.refetchQueries({ queryKey: ["plan_list"] });
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

  function onSubmit(data: z.infer<typeof createPlanFormData>) {
    if (initialValues) {
      edit({
        id: initialValues.id,
        body: {
          date: formatDate.format(data.date, "YYYY-MM-DD"),
          description: data.description,
          title: data.name,
        },
      });
    } else {
      mutate({
        date: formatDate.format(data.date, "YYYY-MM-DD"),
        description: data.description,
        title: data.name,
        user_id: Number(data.user),
      });
    }
  }

  return (
    <div className="mt-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="user"
            control={form.control}
            render={({ field }) => {
              const selectedUser = user?.results.find(
                (u) => String(u.id) === field.value,
              );
              return (
                <FormItem className="flex flex-col">
                  <Label className="text-md">Foydalanuvchi</Label>

                  <Popover open={openUser} onOpenChange={setOpenUser}>
                    <PopoverTrigger asChild disabled={initialValues !== null}>
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
                          value={searchUser}
                          onValueChange={setSearchUser}
                        />

                        <CommandList>
                          {isUserLoading ? (
                            <div className="py-6 text-center text-sm">
                              <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                            </div>
                          ) : user && user.results.length > 0 ? (
                            <CommandGroup>
                              {user.results.map((u) => (
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

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Label className="text-md">Rejani bajarish kuni</Label>

                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 justify-between font-normal"
                    >
                      {field.value
                        ? new Date(field.value).toLocaleDateString()
                        : "Sanani tanlang"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      toYear={new Date().getFullYear() + 50}
                      selected={field.value ? new Date(field.value) : undefined}
                      captionLayout="dropdown"
                      onSelect={(value) => {
                        if (value) {
                          field.onChange(value.toISOString()); // ⬅️ forma ichiga yozamiz
                        }
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full h-12 text-lg rounded-lg bg-blue-600 hover:bg-blue-600 cursor-pointer"
            disabled={isPending || editPending || initialValues?.is_done}
          >
            {isPending || editPending ? (
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
