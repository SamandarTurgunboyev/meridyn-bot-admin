import { getToken } from "@/shared/lib/cookie";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const LoginLayout = ({ children }: { children: ReactNode }) => {
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return children;
};

export default LoginLayout;
