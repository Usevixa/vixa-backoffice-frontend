import api from "@/lib/api";
import { UpdateNotesPayload, ToggleWithdrawalPayload, FlagUserPayload } from "@/types/user";



export async function getUsers(params?: Record<string, string>): Promise<unknown> {
  const response = await api.get("/api/v1/admin/users", { params });
  return response?.data;
}

export async function getUserProfile(userId: string): Promise<unknown> {
  const response = await api.get(`/api/v1/admin/users/${userId}/profile`);
  return response?.data;
}


export async function getUserKyc(userId: string): Promise<unknown> {
  const response = await api.get(`/api/v1/admin/users/${userId}/kyc`);
  return response?.data;
}


export async function getUserWallet(userId: string): Promise<unknown> {
  const response = await api.get(`/api/v1/admin/users/${userId}/wallets`);
  return response?.data;
}


export async function getUserActivity(userId: string): Promise<unknown> {
  const response = await api.get(`/api/v1/admin/users/${userId}/activity`);
  return response?.data;
}


export async function getUserNotes(userId: string): Promise<unknown> {
  const response = await api.get(`/api/v1/admin/users/${userId}/notes`);
  return response?.data;
}


export async function updateUserNotes(
  userId: string,
  payload: UpdateNotesPayload
): Promise<unknown> {
  const response = await api.put(`/api/v1/admin/users/${userId}/notes`, payload);
  return response?.data;
}

export async function freezeUserWallets(userId: string): Promise<unknown> {
  const response = await api.post(`/api/v1/admin/users/${userId}/freeze-wallets`);
  return response?.data;
}


export async function unfreezeUserWallet(userId: string): Promise<unknown> {
  const response = await api.post(`/api/v1/admin/users/${userId}/unfreeze-wallet`);
  return response?.data;
}


export async function toggleUserWithdrawal(
  userId: string,
  payload: ToggleWithdrawalPayload
): Promise<unknown> {
  const response = await api.patch(`/api/v1/admin/users/${userId}/withdrawals`, payload);
  return response?.data;
}

export async function flagUser(userId: string, payload: FlagUserPayload): Promise<unknown> {
  const response = await api.patch(`/api/v1/admin/users/${userId}/flag`, payload);
  return response?.data;
}
