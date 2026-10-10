import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../../middleware/errorHandler";
import { authRepository } from "./auth.repository";
import type { registerSchema, loginSchema } from "./auth.schema";
import type { z } from "zod";

const SALT_ROUNDS = 10;

function signToken(user: { id: bigint; role: string }): string {
  return jwt.sign({ id: user.id.toString(), role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

function toPublicUser(user: { id: bigint; name: string; email: string; role: string; skinType: string | null }) {
  return {
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    skinType: user.skinType,
  };
}

export const authService = {
  async register(input: z.infer<typeof registerSchema>) {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError(409, "Email already registered");
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = await authRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    return { token: signToken(user), user: toPublicUser(user) };
  },

  async login(input: z.infer<typeof loginSchema>) {
    const user = await authRepository.findByEmail(input.email);
    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new AppError(401, "Invalid email or password");
    }

    return { token: signToken(user), user: toPublicUser(user) };
  },
};
