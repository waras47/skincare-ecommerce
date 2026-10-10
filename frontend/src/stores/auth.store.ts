import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { authApi } from "@/api/endpoints/auth.api";
import type { User } from "@/types";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("token"));
  const user = ref<User | null>(JSON.parse(localStorage.getItem("user") ?? "null"));
  const error = ref<string | null>(null);

  const isLoggedIn = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === "admin");

  function persist(nextToken: string, nextUser: User) {
    token.value = nextToken;
    user.value = nextUser;
    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
  }

  async function register(data: { name: string; email: string; password: string }): Promise<boolean> {
    const result = await authApi.register(data);
    if (!result.ok) {
      error.value = result.error;
      return false;
    }
    persist(result.data.token, result.data.user);
    return true;
  }

  async function login(data: { email: string; password: string }): Promise<boolean> {
    const result = await authApi.login(data);
    if (!result.ok) {
      error.value = result.error;
      return false;
    }
    persist(result.data.token, result.data.user);
    return true;
  }

  function setUser(nextUser: User) {
    user.value = nextUser;
    localStorage.setItem("user", JSON.stringify(nextUser));
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return { token, user, error, isLoggedIn, isAdmin, register, login, logout, setUser };
});
