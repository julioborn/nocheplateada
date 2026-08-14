const DEVICE_ID_KEY = "np_device_id";
const REGISTERED_KEY = "np_registered";

export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function isAlreadyRegistered(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(REGISTERED_KEY) === "true";
}

export function markAsRegistered() {
  if (typeof window === "undefined") return;
  localStorage.setItem(REGISTERED_KEY, "true");
}
