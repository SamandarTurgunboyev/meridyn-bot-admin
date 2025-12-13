import { tour_plan_api } from "@/features/tour-plan/lib/api";
import type {
  PlanTourCreate,
  PlanTourListDataRes,
  PlanTourUpdate,
} from "@/features/tour-plan/lib/data";
import { tourPlanForm } from "@/features/tour-plan/lib/form";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Check, ChevronDownIcon, ChevronsUpDown, Loader2 } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";

interface Props {
  initialValues: PlanTourListDataRes | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const AddedTourPlan = ({ initialValues, setDialogOpen }: Props) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof tourPlanForm>>({
    resolver: zodResolver(tourPlanForm),
    defaultValues: {
      date: initialValues?.date ? new Date(initialValues?.date) : undefined,
      district: initialValues?.place_name || "",

      user: initialValues?.user.id.toString() || "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (body: PlanTourCreate) => tour_plan_api.create(body),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["tour_plan_list"] });
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
    mutationFn: ({ body, id }: { id: number; body: PlanTourUpdate }) =>
      tour_plan_api.update({ body, id }),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["tour_plan_list"] });
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

  const [open, setOpen] = useState(false);
  const [searchUser, setSearchUser] = useState<string>("");

  const [openUser, setOpenUser] = useState<boolean>(false);
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

  function onSubmit(values: z.infer<typeof tourPlanForm>) {
    if (!initialValues) {
      mutate({
        date: formatDate.format(values.date, "YYYY-MM-DD"),
        place_name: values.district,
        user_id: Number(values.user),
      });
    } else if (initialValues) {
      edit({
        body: {
          user: Number(values.user),
          date: formatDate.format(values.date, "YYYY-MM-DD"),
          place_name: values.district,
        },
        id: initialValues.id,
      });
    }
  }

  return (
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
                                {u.first_name} {u.last_name} {u.region?.name}
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
          name="district"
          render={({ field }) => (
            <FormItem>
              <Label>Manzil</Label>
              <FormControl>
                <Input placeholder="Manzil nomi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <Label>Boradigan kuni</Label>
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-full justify-between font-normal"
                    >
                      {field.value
                        ? new Date(field.value).toLocaleDateString()
                        : "Boradigan kuni"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      captionLayout="dropdown"
                      onSelect={(val) => {
                        field.onChange(val);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <div className="h-[300px] w-full border rounded-lg overflow-hidden">
          <YMaps>
            <Map
              defaultState={{ center: [Number(lat), Number(long)], zoom: 16 }}
              width="100%"
              height="300px"
              onClick={handleMapClick}
            >
              <Placemark geometry={[Number(lat), Number(long)]} />
              <Circle
                geometry={[[Number(lat), Number(long)], 100]}
                options={{
                  fillColor: "rgba(0,150,255,0.2)",
                  strokeColor: "rgba(0,150,255,0.8)",
                  strokeWidth: 2,
                  interactivityModel: "default#transparent",
                }}
              />
            </Map>
          </YMaps>
        </div> */}

        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-500 cursor-pointer"
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

export default AddedTourPlan;
