import MainProvider from "@/providers/main";
import AppRouter from "@/providers/routing/AppRoutes";
import "@/shared/config/i18n";
import { Toaster } from "@/shared/ui/sonner";

const App = () => {
  return (
    <MainProvider>
      <AppRouter />
      <Toaster />
    </MainProvider>
  );
};

export default App;
