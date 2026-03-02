import React from "react";
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
import OxsSend from "@/pages/OxsSend";
import OxsReceive from "@/pages/OxsReceive";
import OxsSwap from "@/pages/OxsSwap";
import Deposits from "@/pages/Deposits";
import Withdrawals from "@/pages/Withdrawals";
import TransactionHistory from "@/pages/TransactionHistory";
import Rates from "@/pages/Rates";
import Webhooks from "@/pages/Webhooks";
import ReconciliationSettlement from "@/pages/ReconciliationSettlement";
import Settings from "@/pages/Settings";
import AdminRoles from "@/pages/AdminRoles";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ element }: { element: React.ReactElement }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/users" element={<ProtectedRoute element={<Users />} />} />
        <Route path="/wallets" element={<ProtectedRoute element={<Wallets />} />} />
        <Route path="/oxs-send" element={<ProtectedRoute element={<OxsSend />} />} />
        <Route path="/oxs-receive" element={<ProtectedRoute element={<OxsReceive />} />} />
        <Route path="/oxs-swap" element={<ProtectedRoute element={<OxsSwap />} />} />
        <Route path="/deposits" element={<ProtectedRoute element={<Deposits />} />} />
        <Route path="/withdrawals" element={<ProtectedRoute element={<Withdrawals />} />} />
        <Route path="/transaction-history" element={<ProtectedRoute element={<TransactionHistory />} />} />
        <Route path="/rates" element={<ProtectedRoute element={<Rates />} />} />
        <Route path="/webhooks" element={<ProtectedRoute element={<Webhooks />} />} />
        <Route path="/reconciliation" element={<ProtectedRoute element={<ReconciliationSettlement />} />} />
        <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
        <Route path="/admin-roles" element={<ProtectedRoute element={<AdminRoles />} />} />
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
