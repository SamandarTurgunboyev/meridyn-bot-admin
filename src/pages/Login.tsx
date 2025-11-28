import AuthLogin from "@/features/auth/ui/AuthLogin";
import LoginLayout from "@/LoginLayout";

export default function AdminLoginPage() {
  return (
    <LoginLayout>
      <AuthLogin />
    </LoginLayout>
  );
}
