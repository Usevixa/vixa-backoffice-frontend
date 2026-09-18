import api from "@/lib/api";

export async function getOnboardingDropoffs(
  params?: Record<string, string | number | boolean>
): Promise<unknown> {
  const response = await api.get("/api/v1/admin/onboarding/dropoffs", { params });
  return response?.data;
}

export async function getOnboardingUserDetail(phoneNumber: string): Promise<unknown> {
  const response = await api.get(`/api/v1/admin/onboarding/user/${encodeURIComponent(phoneNumber)}`);
  return response?.data;
}

export async function getOnboardingFunnel(): Promise<unknown> {
  const response = await api.get("/api/v1/admin/onboarding/funnel");
  return response?.data;
}

export async function triggerOnboardingScan(): Promise<unknown> {
  const response = await api.post("/api/v1/admin/onboarding/trigger-scan");
  return response?.data;
}

export async function exportOnboardingDropoffs(
  params?: Record<string, string | boolean>
) {
  // Returns the full response (not response.data) so the hook can read
  // the content-disposition header for the filename.
  const response = await api.get("/api/v1/admin/onboarding/dropoffs/export", {
    params,
    responseType: "blob",
  });
  return response;
}