import { prisma } from "../../lib/prisma";

export const skinQuizRepository = {
  listQuestions() {
    return prisma.skinQuizQuestion.findMany({
      orderBy: { orderNo: "asc" },
      include: { options: true },
    });
  },

  findOptionsByIds(ids: bigint[]) {
    return prisma.skinQuizOption.findMany({ where: { id: { in: ids } } });
  },

  createQuestion(data: { orderNo: number; text: string }) {
    return prisma.skinQuizQuestion.create({ data });
  },

  updateQuestion(id: bigint, data: Partial<{ orderNo: number; text: string }>) {
    return prisma.skinQuizQuestion.update({ where: { id }, data });
  },

  deleteQuestion(id: bigint) {
    return prisma.skinQuizQuestion.delete({ where: { id } });
  },

  createOption(questionId: bigint, data: { text: string; skinTypeValue: string }) {
    return prisma.skinQuizOption.create({ data: { ...data, questionId } });
  },

  updateOption(id: bigint, data: Partial<{ text: string; skinTypeValue: string }>) {
    return prisma.skinQuizOption.update({ where: { id }, data });
  },

  deleteOption(id: bigint) {
    return prisma.skinQuizOption.delete({ where: { id } });
  },

  updateUserSkinType(userId: bigint, skinType: string) {
    return prisma.user.update({ where: { id: userId }, data: { skinType } });
  },

  async recommendProducts(skinType: string, limit = 6) {
    // JSON array_contains filtering is provider-finicky; filter in app code
    // like catalogRepository.listProducts does for the same skin_types column.
    // ponytail: full table scan, fine at MVP catalog size; add a proper JSON
    // path query or a normalized product_skin_types table if catalog grows large.
    const candidates = await prisma.product.findMany({
      include: { images: { where: { isPrimary: true }, take: 1 } },
      orderBy: { createdAt: "desc" },
    });
    return candidates
      .filter((p) => Array.isArray(p.skinTypes) && (p.skinTypes as string[]).includes(skinType))
      .slice(0, limit);
  },
};
