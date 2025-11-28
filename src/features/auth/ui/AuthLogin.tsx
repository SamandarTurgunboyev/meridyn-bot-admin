import { auth_pai } from "@/features/auth/lib/api";
import { saveToken } from "@/shared/lib/cookie";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const AuthLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: (body: { username: string; password: string }) =>
      auth_pai.login(body),
    onSuccess: (res) => {
      toast.success(res.data.message, {
        richColors: true,
        position: "top-center",
      });

      saveToken(res.data.data.token);
      navigate("dashboard");
    },
    onError: (err: AxiosError) => {
      console.log(err);
      const errMessage = err.response?.data as { message: string };
      const messageText = errMessage.message;

      toast.error(messageText || "Xatolik yuz berdi", {
        richColors: true,
        position: "top-center",
      });
    },
  });

  const FormSchema = z.object({
    email: z.string().min(1, "Login kiriting"),
    password: z.string().min(1, "Parolni kiriting"),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    mutate({
      password: values.password,
      username: values.email,
    });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="gap-1">
          <CardTitle className="text-xl font-semibold">
            Admin panelga kirish
          </CardTitle>
          <CardDescription className="text-md">
            Login va parolingizni kiriting.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label>Login</Label>
                    <FormControl>
                      <Input
                        placeholder="admin"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label>Parol</Label>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="12345"
                          {...field}
                          className="!h-12 !text-md"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-black"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 text-lg"
                disabled={isPending}
              >
                {isPending ? <Loader2 className="animate-spin" /> : "Kirish"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthLogin;
