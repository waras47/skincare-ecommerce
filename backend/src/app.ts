import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { authRouter } from "./modules/auth/auth.routes";
import { adminCategoriesRouter, adminProductsRouter, categoriesRouter, productsRouter } from "./modules/catalog/catalog.routes";
import { adminSkinQuizRouter, skinQuizRouter } from "./modules/skin-quiz/skin-quiz.routes";
import { cartRouter } from "./modules/cart/cart.routes";
import { adminOrdersRouter, ordersRouter } from "./modules/orders/orders.routes";
import { adminReviewsRouter, reviewsRouter } from "./modules/reviews/reviews.routes";
import { wishlistRouter } from "./modules/wishlist/wishlist.routes";
import { adminUsersRouter, usersRouter } from "./modules/users/users.routes";
import { adminDashboardRouter } from "./modules/dashboard/dashboard.routes";

export const app = express();

app.set("json replacer", (_key: string, value: unknown) => (typeof value === "bigint" ? value.toString() : value));

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/skin-quiz", skinQuizRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/users", usersRouter);

app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/categories", adminCategoriesRouter);
app.use("/api/admin/skin-quiz", adminSkinQuizRouter);
app.use("/api/admin/orders", adminOrdersRouter);
app.use("/api/admin/reviews", adminReviewsRouter);
app.use("/api/admin/users", adminUsersRouter);
app.use("/api/admin/dashboard", adminDashboardRouter);

app.use(notFoundHandler);
app.use(errorHandler);
