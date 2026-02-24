import { Request, Response, NextFunction } from "express";

export const onError = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const message = err instanceof Error ? err.message : "Erro interno do servidor";
  res.status(500).json({ error: message });
};
