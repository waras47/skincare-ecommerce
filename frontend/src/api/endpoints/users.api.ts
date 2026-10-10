import { client, safeRequest } from "../client";
import type { Address, User } from "@/types";

export const usersApi = {
  getProfile: () => safeRequest<User>(() => client.get("/users/me")),
  updateProfile: (data: Partial<{ name: string; skinType: string }>) =>
    safeRequest<User>(() => client.patch("/users/me", data)),

  listAddresses: () => safeRequest<Address[]>(() => client.get("/users/me/addresses")),
  createAddress: (data: Omit<Address, "id" | "userId">) =>
    safeRequest<Address>(() => client.post("/users/me/addresses", data)),
  updateAddress: (id: string, data: Partial<Omit<Address, "id" | "userId">>) =>
    safeRequest<Address>(() => client.patch(`/users/me/addresses/${id}`, data)),
  deleteAddress: (id: string) => safeRequest<null>(() => client.delete(`/users/me/addresses/${id}`)),

  // admin
  listCustomers: () => safeRequest<User[]>(() => client.get("/admin/users")),
};
