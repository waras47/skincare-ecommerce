import { dashboardRepository } from "./dashboard.repository";

export const dashboardService = {
  getStats() {
    return dashboardRepository.getStats();
  },
};
