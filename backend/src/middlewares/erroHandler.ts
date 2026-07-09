import { NextFunction, Request, Response } from "express";

export class ErroHttp extends Error {
  status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.status = status;
  }
}

export function erroHandler(
  erro: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (erro instanceof ErroHttp) {
    return res.status(erro.status).json({ erro: erro.message });
  }

  console.error(erro);
  return res.status(500).json({ erro: "Erro interno do servidor." });
}

export function rotaNaoEncontrada(_req: Request, res: Response) {
  res.status(404).json({ erro: "Rota nao encontrada." });
}
