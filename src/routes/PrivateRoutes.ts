// src/utils/protectedLoader.ts
import { redirect } from "react-router-dom";
import { store } from "../redux/store";
import { TUserRole } from "../types/users";
import { toast } from "sonner";
/**
 * Base protection - just checks authentication
 */
export async function authLoader() {
  const { token } = store.getState().auth;
  return token ? null : redirect('/login?from=' + encodeURIComponent(window.location.pathname));
}

/**
 * Role-based protection
 */
export async function roleLoader(allowedRoles: TUserRole[]) {
  const { user, token } = store.getState().auth;
  
  if (!token) {
    throw redirect('/login');
  }

  if (!user?.role || !allowedRoles.includes(user.role)) {
    toast.error("You are not authorized!",{duration:5000})
    throw redirect('/login');
  }

  return { user }; // Pass user data to the route
}

/**
 * Automatic role-based redirection
 */
export async function roleRedirectLoader() {
  const { user, token } = store.getState().auth;
  
  if (!token) {
    throw redirect('/login');
  }

  switch (user?.role) {
    case 'admin':
    case 'superAdmin':
      return redirect('/dashboard/admin');
    case 'user':
      return redirect('/dashboard/user');
    default:
      return redirect('/login');
  }
}