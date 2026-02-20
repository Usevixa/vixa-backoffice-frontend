import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Users from "@/pages/Users";
import Wallets from "@/pages/Wallets";
import Deposits from "@/pages/Deposits";
import Withdrawals from "@/pages/Withdrawals";
import Swaps from "@/pages/Swaps";
import OpenXSwitchConsole from "@/pages/OpenXSwitchConsole";
import YellowCardConsole from "@/pages/YellowCardConsole";
import Rates from "@/pages/Rates";
import Compliance from "@/pages/Compliance";
import Webhooks from "@/pages/Webhooks";
import ReconciliationSettlement from "@/pages/ReconciliationSettlement";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import AdminRoles from "@/pages/AdminRoles";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <Route element={<MainLayout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/users" element={<Users />} />
      <Route path="/wallets" element={<Wallets />} />
      <Route path="/deposits" element={<Deposits />} />
      <Route path="/withdrawals" element={<Withdrawals />} />
      <Route path="/swaps" element={<Swaps />} />
      <Route path="/openxswitch" element={<OpenXSwitchConsole />} />
      <Route path="/yellowcard" element={<YellowCardConsole />} />
      <Route path="/rates" element={<Rates />} />
      <Route path="/compliance" element={<Compliance />} />
      <Route path="/webhooks" element={<Webhooks />} />
      <Route path="/reconciliation" element={<ReconciliationSettlement />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/admin-roles" element={<AdminRoles />} />
    </Route>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route element={<MainLayout />}>
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/users" element={isAuthenticated ? <Users /> : <Navigate to="/login" replace />} />
        <Route path="/wallets" element={isAuthenticated ? <Wallets /> : <Navigate to="/login" replace />} />
        <Route path="/deposits" element={isAuthenticated ? <Deposits /> : <Navigate to="/login" replace />} />
        <Route path="/withdrawals" element={isAuthenticated ? <Withdrawals /> : <Navigate to="/login" replace />} />
        <Route path="/swaps" element={isAuthenticated ? <Swaps /> : <Navigate to="/login" replace />} />
        <Route path="/openxswitch" element={isAuthenticated ? <OpenXSwitchConsole /> : <Navigate to="/login" replace />} />
        <Route path="/yellowcard" element={isAuthenticated ? <YellowCardConsole /> : <Navigate to="/login" replace />} />
        <Route path="/rates" element={isAuthenticated ? <Rates /> : <Navigate to="/login" replace />} />
        <Route path="/compliance" element={isAuthenticated ? <Compliance /> : <Navigate to="/login" replace />} />
        <Route path="/webhooks" element={isAuthenticated ? <Webhooks /> : <Navigate to="/login" replace />} />
        <Route path="/reconciliation" element={isAuthenticated ? <ReconciliationSettlement /> : <Navigate to="/login" replace />} />
        <Route path="/reports" element={isAuthenticated ? <Reports /> : <Navigate to="/login" replace />} />
        <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />} />
        <Route path="/admin-roles" element={isAuthenticated ? <AdminRoles /> : <Navigate to="/login" replace />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
