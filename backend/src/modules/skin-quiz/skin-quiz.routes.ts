import { Router, type RequestHandler } from "express";
import { skinQuizController } from "./skin-quiz.controller";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate, requireRole } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import {
  createOptionSchema,
  createQuestionSchema,
  submitQuizSchema,
  updateOptionSchema,
  updateQuestionSchema,
} from "./skin-quiz.schema";

// Skin quiz works for guests too; only attach req.user when a token is present.
const tryAuthenticate: RequestHandler = (req, res, next) => {
  if (!req.headers.authorization) return next();
  authenticate(req, res, next);
};

export const skinQuizRouter = Router();
skinQuizRouter.get("/", asyncHandler(skinQuizController.listQuestions));
skinQuizRouter.post(
  "/submit",
  tryAuthenticate,
  validateBody(submitQuizSchema),
  asyncHandler(skinQuizController.submit),
);

const adminOnly = [authenticate, requireRole("admin")];

export const adminSkinQuizRouter = Router();
adminSkinQuizRouter.post(
  "/questions",
  ...adminOnly,
  validateBody(createQuestionSchema),
  asyncHandler(skinQuizController.createQuestion),
);
adminSkinQuizRouter.patch(
  "/questions/:id",
  ...adminOnly,
  validateBody(updateQuestionSchema),
  asyncHandler(skinQuizController.updateQuestion),
);
adminSkinQuizRouter.delete("/questions/:id", ...adminOnly, asyncHandler(skinQuizController.deleteQuestion));
adminSkinQuizRouter.post(
  "/questions/:questionId/options",
  ...adminOnly,
  validateBody(createOptionSchema),
  asyncHandler(skinQuizController.createOption),
);
adminSkinQuizRouter.patch(
  "/options/:id",
  ...adminOnly,
  validateBody(updateOptionSchema),
  asyncHandler(skinQuizController.updateOption),
);
adminSkinQuizRouter.delete("/options/:id", ...adminOnly, asyncHandler(skinQuizController.deleteOption));
