import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from 'js-cookie'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ====================
// COOKIE LOGIN SESSION
// ====================

type UserSession = {
  id: number
  username: string
  role: string
}

const COOKIE_NAME = 'user'

export function setUserSession(user: UserSession) {
  Cookies.set(COOKIE_NAME, JSON.stringify(user), { expires: 1 })
}

export function getUserSession(): UserSession | null {
  const value = Cookies.get(COOKIE_NAME)
  return value ? JSON.parse(value) : null
}

export function clearUserSession() {
  Cookies.remove(COOKIE_NAME)
}
