import { cookies } from "next/headers";

export type CustomerSession = {
  id: string;
  name: string;
  email: string;
};

export const CUSTOMER_COOKIE = "filmkeren_customer";

export async function getCustomerSession(): Promise<CustomerSession | null> {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get(CUSTOMER_COOKIE)?.value;
  if (!rawSession) return null;

  try {
    const session = JSON.parse(rawSession) as CustomerSession;
    if (!session.id || !session.email || !session.name) return null;
    return session;
  } catch {
    return null;
  }
}

export function safeRedirectPath(value: FormDataEntryValue | string | null | undefined, fallback = "/movies") {
  const path = String(value ?? "").trim();
  if (!path.startsWith("/") || path.startsWith("//")) return fallback;
  return path;
}
