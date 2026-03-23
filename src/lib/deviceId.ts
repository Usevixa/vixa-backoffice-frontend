const DEVICE_ID_KEY = "vixa_device_id";

/**
 * Returns a stable device ID for this browser.
 * Generated once, persisted in localStorage, reused across sessions.
 * Pass this value to both login and OTP verification payloads.
 */
export function getDeviceId(): string {
  const existing = localStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;

  const id = crypto.randomUUID();
  localStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}
