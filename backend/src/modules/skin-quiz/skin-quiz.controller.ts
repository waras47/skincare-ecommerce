import type { Request, Response } from "express";
import { skinQuizService } from "./skin-quiz.service";

export const skinQuizController = {
  async listQuestions(_req: Request, res: Response) {
    const questions = await skinQuizService.listQuestions();
    res.json({ success: true, data: questions });
  },

  async submit(req: Request, res: Response) {
    const result = await skinQuizService.submit(req.body.answers, req.user?.id);
    res.json({ success: true, data: result });
  },

  async createQuestion(req: Request, res: Response) {
    const question = await skinQuizService.createQuestion(req.body);
    res.status(201).json({ success: true, data: question });
  },

  async updateQuestion(req: Request, res: Response) {
    const question = await skinQuizService.updateQuestion(req.params.id as string, req.body);
    res.json({ success: true, data: question });
  },

  async deleteQuestion(req: Request, res: Response) {
    await skinQuizService.deleteQuestion(req.params.id as string);
    res.status(204).send();
  },

  async createOption(req: Request, res: Response) {
    const option = await skinQuizService.createOption(req.params.questionId as string, req.body);
    res.status(201).json({ success: true, data: option });
  },

  async updateOption(req: Request, res: Response) {
    const option = await skinQuizService.updateOption(req.params.id as string, req.body);
    res.json({ success: true, data: option });
  },

  async deleteOption(req: Request, res: Response) {
    await skinQuizService.deleteOption(req.params.id as string);
    res.status(204).send();
  },
};
