import { client, safeRequest } from "../client";
import type { User } from "@/types";

export interface AuthResult {
  token: string;
  user: User;
}

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    safeRequest<AuthResult>(() => client.post("/auth/register", data)),

  login: (data: { email: string; password: string }) =>
    safeRequest<AuthResult>(() => client.post("/auth/login", data)),
};
