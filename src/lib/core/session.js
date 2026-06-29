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

<<<<<<< HEAD
export const requireRole = async (allowedRoles) => {
  const user = await getUserSession();

  if (!user) {
    redirect("/auth/signin");
  }

  const rolesArray = Array.isArray(allowedRoles)
    ? allowedRoles
    : [allowedRoles];

  if (!rolesArray.includes(user?.role)) {
=======
export const requireRoles = async (roles = []) => {
  const user = await getUserSession();

  if (!user) {
    redirect("/login");
  }

  if (!roles.includes(user.role)) {
>>>>>>> 88fd8279a504e1d93dc9aceba417f7293502f2b1
    redirect("/unauthorized");
  }

  return user;
<<<<<<< HEAD
};
=======
};
>>>>>>> 88fd8279a504e1d93dc9aceba417f7293502f2b1
