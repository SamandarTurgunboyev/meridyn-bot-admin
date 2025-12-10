import { region_api } from "@/features/region/lib/api";
import type { RegionListResData } from "@/features/region/lib/data";
import { send_message } from "@/features/users/lib/api";
import type { UserListData } from "@/features/users/lib/data";
import AddUsers from "@/features/users/ui/AddUsers";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  Check,
  ChevronsUpDown,
  Loader2,
  MessageCircle,
  Plus,
  XIcon,
} from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const FormSchema = z.object({
  text: z.string().min(10, {
    message: "Xabar uzunligi kamida 10ta belgidan katta bolishi kerak",
  }),
});

interface Props {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  statusFilter: "all" | "true" | "false";
  setStatusFilter: Dispatch<SetStateAction<"all" | "true" | "false">>;
  regionValue: RegionListResData | null;
  setRegionValue: Dispatch<SetStateAction<RegionListResData | null>>;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  editingUser: UserListData | null;
  setEditingUser: Dispatch<SetStateAction<UserListData | null>>;
  setSendMessage: Dispatch<SetStateAction<boolean>>;
  setUserList: Dispatch<SetStateAction<number[] | []>>;
  sendMessage: boolean;
  userList: number[] | null;
}

const Filter = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  regionValue,
  sendMessage,
  setRegionValue,
  userList,
  dialogOpen,
  setUserList,
  setDialogOpen,
  editingUser,
  setEditingUser,
  setSendMessage,
}: Props) => {
  const [openRegion, setOpenRegion] = useState(false);
  const [regionSearch, setRegionSearch] = useState("");
  const [message, setMessage] = useState<boolean>(false);

  const { data: regions, isLoading } = useQuery({
    queryKey: ["region_list", regionSearch],
    queryFn: () => region_api.list({ name: regionSearch }),
    select: (res) => res.data.data,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (body: { user_ids: number[]; message: string }) =>
      send_message.send(body),
    onSuccess: () => {
      toast.success("Xabar jo'natildi", {
        richColors: true,
        position: "top-center",
      });
      setMessage(false);
      setSendMessage(false);
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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (userList) {
      mutate({
        message: data.text,
        user_ids: userList,
      });
    }
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Search input */}
      <Input
        type="text"
        placeholder="Ism yoki Familiyasi bo'yicha qidirish"
        className="border rounded px-3 py-2 text-sm w-64"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Select
        value={statusFilter}
        onValueChange={(val) =>
          setStatusFilter(val as "all" | "true" | "false")
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Holati" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Barchasi</SelectItem>
          <SelectItem value="true">Faol</SelectItem>
          <SelectItem value="false">Faol emas</SelectItem>
        </SelectContent>
      </Select>

      <Popover open={openRegion} onOpenChange={setOpenRegion}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={openRegion}
            className={cn(
              "w-64 justify-between",
              !regionValue && "text-muted-foreground",
            )}
          >
            {regionValue ? regionValue.name : "Hudud tanlang"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Hududni qidirish..."
              className="h-9"
              value={regionSearch}
              onValueChange={setRegionSearch}
            />
            <CommandList>
              {isLoading ? (
                <div className="py-6 text-center text-sm">
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                </div>
              ) : regions && regions.length > 0 ? (
                <CommandGroup>
                  <CommandItem
                    value={""}
                    onSelect={() => {
                      setRegionValue(null);
                      setRegionSearch("");
                      setOpenRegion(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        regionValue === null ? "opacity-100" : "opacity-0",
                      )}
                    />
                    Barchasi
                  </CommandItem>
                  {regions.map((r) => (
                    <CommandItem
                      key={r.id}
                      value={`${r.name}`}
                      onSelect={() => {
                        setRegionValue(r);
                        setRegionSearch("");
                        setOpenRegion(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          regionValue?.id === r.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {r.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty>Hudud topilmadi</CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="bg-blue-500 cursor-pointer hover:bg-blue-500"
            onClick={() => setEditingUser(null)}
            disabled={sendMessage}
          >
            <Plus className="!h-5 !w-5" /> Qo'shish
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingUser
                ? "Foydalanuvchini tahrirlash"
                : "Foydalanuvchi qo'shish"}
            </DialogTitle>
          </DialogHeader>

          <AddUsers initialData={editingUser} setDialogOpen={setDialogOpen} />
        </DialogContent>
      </Dialog>
      <Button
        variant="default"
        className="bg-blue-500 cursor-pointer hover:bg-blue-500"
        onClick={() => {
          setSendMessage((prev) => !prev);
          setUserList([]);
        }}
      >
        {sendMessage ? (
          <>
            <XIcon className="!h-5 !w-5" />
            Bekor qilish
          </>
        ) : (
          <>
            <MessageCircle className="!h-5 !w-5" />
            Xabar jo'natish
          </>
        )}
      </Button>
      {sendMessage && (
        <Button
          variant="default"
          className="bg-blue-500 cursor-pointer hover:bg-blue-500"
          onClick={() => {
            if (userList === null) {
              toast.error("Kamida 1ta foydalanuvchi tanlash kerak.", {
                richColors: true,
                position: "top-center",
              });
            } else {
              setMessage(true);
              form.reset({
                text: "",
              });
            }
          }}
        >
          Xabarni jo'natish
        </Button>
      )}

      <Dialog open={message} onOpenChange={setMessage}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xabar jo'natish</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 flex flex-col"
            >
              <FormField
                name="text"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label>Xabarni yozing</Label>
                    <FormControl>
                      <Textarea
                        className="min-h-44 max-h-64"
                        placeholder="Xabar"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 mt-2">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setMessage(false);
                      setSendMessage(false);
                    }}
                  >
                    Bekor qilish
                  </Button>
                </DialogClose>
                <Button type="submit">
                  {isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Jo'natish"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Filter;
