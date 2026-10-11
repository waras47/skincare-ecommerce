import { client, safeRequest } from "../client";
import type { DashboardStats } from "@/types";

export const dashboardApi = {
  getStats: () => safeRequest<DashboardStats>(() => client.get("/admin/dashboard")),
};
