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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const FAKE_ADMIN = {
    email: "admin",
    password: "12345",
  };

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      toast.success("Muvaffaqiyatli kirdingiz!", {
        richColors: true,
        position: "top-center",
      });
    } else if (error) {
      toast.error(error, {
        richColors: true,
        position: "top-center",
      });
    }
  }, [success, error]);

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    setTimeout(() => {
      if (
        values.email === FAKE_ADMIN.email &&
        values.password === FAKE_ADMIN.password
      ) {
        setSuccess(true);
        navigate("/dashboard");
      } else {
        setError("Login yoki parol noto‘g‘ri!");
      }
      setLoading(false);
    }, 800);
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
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Kirish"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
