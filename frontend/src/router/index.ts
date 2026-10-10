import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/layouts/DefaultLayout.vue"),
      children: [
        { path: "", name: "home", component: () => import("@/views/home/HomeView.vue") },
        { path: "products", name: "products", component: () => import("@/views/product/ProductListView.vue") },
        {
          path: "products/:slug",
          name: "product-detail",
          component: () => import("@/views/product/ProductDetailView.vue"),
        },
        { path: "skin-quiz", name: "skin-quiz", component: () => import("@/views/skin-quiz/QuizView.vue") },
        {
          path: "cart",
          name: "cart",
          component: () => import("@/views/cart/CartView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "checkout",
          name: "checkout",
          component: () => import("@/views/checkout/CheckoutView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "orders",
          name: "orders",
          component: () => import("@/views/orders/OrderListView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "orders/:id",
          name: "order-detail",
          component: () => import("@/views/orders/OrderDetailView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "wishlist",
          name: "wishlist",
          component: () => import("@/views/wishlist/WishlistView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "profile",
          name: "profile",
          component: () => import("@/views/profile/ProfileView.vue"),
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: "/",
      component: () => import("@/layouts/AuthLayout.vue"),
      children: [
        { path: "login", name: "login", component: () => import("@/views/auth/LoginView.vue") },
        { path: "register", name: "register", component: () => import("@/views/auth/RegisterView.vue") },
      ],
    },
    {
      path: "/admin",
      component: () => import("@/layouts/AdminLayout.vue"),
      meta: { requiresAdmin: true },
      children: [
        { path: "products", name: "admin-products", component: () => import("@/views/admin/AdminProductsView.vue") },
        {
          path: "categories",
          name: "admin-categories",
          component: () => import("@/views/admin/AdminCategoriesView.vue"),
        },
        { path: "skin-quiz", name: "admin-skin-quiz", component: () => import("@/views/admin/AdminQuizView.vue") },
        { path: "orders", name: "admin-orders", component: () => import("@/views/admin/AdminOrdersView.vue") },
        { path: "users", name: "admin-users", component: () => import("@/views/admin/AdminUsersView.vue") },
        { path: "reviews", name: "admin-reviews", component: () => import("@/views/admin/AdminReviewsView.vue") },
      ],
    },
    { path: "/:pathMatch(.*)*", name: "not-found", component: () => import("@/views/NotFoundView.vue") },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  return true;
});

export { router };
