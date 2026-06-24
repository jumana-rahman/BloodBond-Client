import { headers } from "next/headers";
import { auth } from "../auth";
import { redirect } from "next/navigation";

export const getUserSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user || null;
};

export const getUserToken = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.session?.token || null;
};

export const requireRoles = async (roles = []) => {
  const user = await getUserSession();

  if (!user) {
    redirect("/login");
  }

  if (!roles.includes(user.role)) {
    redirect("/unauthorized");
  }

  return user;
};