import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  loginWithCredentials,
  verifyOtp,
  resendOtp,
  LoginPayload,
  VerifyOtpPayload,
  ResendOtpPayload,
} from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";



function getErrorMessage(err: unknown): string {
  const backendMessage = (err as any)?.response?.data?.message;
  if (typeof backendMessage === "string" && backendMessage.trim()) {
    return backendMessage;
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return "Something went wrong. Please try again.";
}


export function useLoginMutation(onSuccess: () => void) {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginWithCredentials(payload),
    onSuccess: () => {
      toast.success("OTP sent successfully");
      onSuccess();
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });
}


export function useVerifyOtpMutation(onSuccess: () => void) {
  const { setToken, setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (payload: VerifyOtpPayload) => {
      const verifyResponse = await verifyOtp(payload) as any;

      // Response shape: { success, message, data: { accessToken, admin, ... } }
      const token = verifyResponse?.data?.accessToken;

      if (!token) {
        throw new Error("Authentication failed: no token received.");
      }

      setToken(token);

      // User data is nested under data.admin
      const user = verifyResponse?.data?.admin;
      setUser(user);

      return user;
    },
    onSuccess: () => {
      toast.success("Login successful");
      onSuccess();
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });
}


export function useResendOtpMutation() {
  return useMutation({
    mutationFn: (payload: ResendOtpPayload) => resendOtp(payload),
    onSuccess: () => {
      toast.success("OTP resent successfully");
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });
}