import { discrit_api } from "@/features/districts/lib/api";
import type { DistrictListData } from "@/features/districts/lib/data";
import { addDistrict } from "@/features/districts/lib/form";
import { user_api } from "@/features/users/lib/api";
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
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type FormValues = z.infer<typeof addDistrict>;

interface Props {
  initialValues: DistrictListData | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AddDistrict({ initialValues, setDialogOpen }: Props) {
  const [openUser, setOpenUser] = useState<boolean>(false);
  const [userSearch, setUserSearch] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user_list", userSearch],
    queryFn: () => user_api.list({ search: userSearch }),
    select(data) {
      return data.data.data.results;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (body: { name: string; user_id: number }) =>
      discrit_api.create(body),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["discrit_list"] });
      toast.success(`Tuman qo'shildi`);
      setDialogOpen(false);
    },
    onError: (err: AxiosError) => {
      const errMessage = err.response?.data as { message: string };
      const messageText = errMessage.message;
      const errMessageName = err.response?.data as { data: { name: [string] } };
      const messageTextName = errMessageName.data.name[0];
      toast.error(messageTextName || messageText || "Xatolik yuz berdi", {
        richColors: true,
        position: "top-center",
      });
    },
  });

  const { mutate: update, isPending: updatePending } = useMutation({
    mutationFn: ({
      body,
      id,
    }: {
      id: number;
      body: { name: string; user: number };
    }) => discrit_api.update({ body, id }),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["discrit_list"] });
      toast.success(`Tuman qo'shildi`);
      setDialogOpen(false);
    },
    onError: (err: AxiosError) => {
      const errMessage = err.response?.data as { message: string };
      const errMessageName = err.response?.data as { data: { name: [string] } };
      const messageText = errMessage.message;
      const messageTextName = errMessageName.data.name[0];
      toast.error(messageTextName || messageText || "Xatolik yuz berdi", {
        richColors: true,
        position: "top-center",
      });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(addDistrict),
    defaultValues: {
      name: initialValues?.name ?? "",
      userId: initialValues ? String(initialValues.user.id) : "",
    },
  });

  function onSubmit(values: FormValues) {
    if (initialValues) {
      update({
        id: initialValues.id,
        body: {
          name: values.name,
          user: Number(values.userId),
        },
      });
    } else {
      mutate({ name: values.name, user_id: Number(values.userId) });
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

        <Button
          type="submit"
          className="w-full h-12 bg-blue-700 hover:bg-blue-800"
          disabled={isPending || updatePending}
        >
          {isPending || updatePending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : initialValues ? (
            "Tahrirlash"
          ) : (
            "Qo'shish"
          )}
        </Button>
      </form>
    </Form>
  );
}
