export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface AuthUser {
  id: string;
  role: "customer" | "admin";
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
