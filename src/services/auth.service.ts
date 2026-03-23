import api from "@/lib/api";
import { AdminUser } from "@/store/auth.store";

// ---------------------------------------------------------------------------
// Payload types
// ---------------------------------------------------------------------------

export interface LoginPayload {
  email: string;
  password: string;
  deviceId: string;
}

export interface VerifyOtpPayload {
  email: string;
  otpCode: string;
  deviceId: string;
}

export interface ResendOtpPayload {
  email: string;
}

// ---------------------------------------------------------------------------
// Service functions — pure async, no hooks, no side effects
// ---------------------------------------------------------------------------

/**
 * Step 1: Submit credentials.
 * POST /api/v1/admin/auth/login
 *
 * On success the server sends an OTP to the admin's registered device.
 * The response shape is not yet confirmed — raw data is returned as-is.
 */
export async function loginWithCredentials(payload: LoginPayload): Promise<unknown> {
  const response = await api.post("/api/v1/admin/auth/login", payload);
  return response?.data;
}

/**
 * Step 2: Verify OTP.
 * POST /api/v1/admin/auth/verify-otp
 *
 * TODO: Confirm exact response shape from API docs.
 *       The auth token must be extracted in useVerifyOtpMutation before
 *       being stored — do not assume field name here.
 */
export async function verifyOtp(payload: VerifyOtpPayload): Promise<unknown> {
  const response = await api.post("/api/v1/admin/auth/verify-otp", payload);
  return response?.data;
}

/**
 * Resend OTP to the admin's registered device.
 * POST /api/v1/admin/auth/resend-otp
 */
export async function resendOtp(payload: ResendOtpPayload): Promise<unknown> {
  const response = await api.post("/api/v1/admin/auth/resend-otp", payload);
  return response?.data;
}

/**
 * Logout the current admin session.
 * POST /api/v1/admin/auth/logout
 *
 * Caller must clear local auth state and redirect regardless of whether
 * this call succeeds or fails.
 */
export async function logoutUser(): Promise<unknown> {
  const response = await api.post("/api/v1/admin/auth/logout");
  return response?.data;
}

/**
 * Fetch the authenticated admin's profile.
 * GET /api/v1/admin/auth/me
 *
 * TODO: Confirm exact response shape from API docs.
 *       Map the returned fields to AdminUser in useVerifyOtpMutation
 *       before storing in Zustand — do not assume field names here.
 */
export async function getMe(): Promise<AdminUser> {
  const response = await api.get("/api/v1/admin/auth/me");
  return response?.data;
}
