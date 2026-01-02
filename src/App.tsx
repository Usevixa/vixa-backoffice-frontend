import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import Wallets from "@/pages/Wallets";
import Transactions from "@/pages/Transactions";
import CryptoExchange from "@/pages/CryptoExchange";
import GiftCards from "@/pages/GiftCards";
import Withdrawals from "@/pages/Withdrawals";
import AILogs from "@/pages/AILogs";
import Rates from "@/pages/Rates";
import Compliance from "@/pages/Compliance";
import Webhooks from "@/pages/Webhooks";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import AdminRoles from "@/pages/AdminRoles";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/wallets" element={<Wallets />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/crypto" element={<CryptoExchange />} />
            <Route path="/gift-cards" element={<GiftCards />} />
            <Route path="/withdrawals" element={<Withdrawals />} />
            <Route path="/ai-logs" element={<AILogs />} />
            <Route path="/rates" element={<Rates />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/webhooks" element={<Webhooks />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin-roles" element={<AdminRoles />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
