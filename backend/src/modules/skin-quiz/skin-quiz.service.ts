import { AppError } from "../../middleware/errorHandler";
import { skinQuizRepository } from "./skin-quiz.repository";

export const skinQuizService = {
  listQuestions() {
    return skinQuizRepository.listQuestions();
  },

  async submit(answers: { questionId: string; optionId: string }[], userId?: string) {
    const optionIds = answers.map((a) => BigInt(a.optionId));
    const options = await skinQuizRepository.findOptionsByIds(optionIds);
    if (options.length === 0) {
      throw new AppError(400, "No valid answers submitted");
    }

    const tally = new Map<string, number>();
    for (const option of options) {
      tally.set(option.skinTypeValue, (tally.get(option.skinTypeValue) ?? 0) + 1);
    }

    const skinType = [...tally.entries()].sort((a, b) => b[1] - a[1])[0]![0];

    if (userId) {
      await skinQuizRepository.updateUserSkinType(BigInt(userId), skinType);
    }

    const recommendations = await skinQuizRepository.recommendProducts(skinType);
    return { skinType, recommendations };
  },

  createQuestion(data: { orderNo: number; text: string }) {
    return skinQuizRepository.createQuestion(data);
  },

  updateQuestion(id: string, data: Partial<{ orderNo: number; text: string }>) {
    return skinQuizRepository.updateQuestion(BigInt(id), data);
  },

  deleteQuestion(id: string) {
    return skinQuizRepository.deleteQuestion(BigInt(id));
  },

  createOption(questionId: string, data: { text: string; skinTypeValue: string }) {
    return skinQuizRepository.createOption(BigInt(questionId), data);
  },

  updateOption(id: string, data: Partial<{ text: string; skinTypeValue: string }>) {
    return skinQuizRepository.updateOption(BigInt(id), data);
  },

  deleteOption(id: string) {
    return skinQuizRepository.deleteOption(BigInt(id));
  },
};
