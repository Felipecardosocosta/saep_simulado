import { Router } from "express";
import { TipoVeiculo } from "@prisma/client";
import { prisma } from "../prisma";
import { ErroHttp } from "../middlewares/erroHandler";

export const veiculoRouter = Router();

const TIPOS_VALIDOS = Object.values(TipoVeiculo);

type DadosVeiculo = {
  modelo: string;
  marca: string;
  cor: string;
  tipo: TipoVeiculo;
  capacidade: number;
  valorLocacao: number;
  quantidadeDisponivel: number;
  estoqueMinimo: number;
};

function validarVeiculo(corpo: any): DadosVeiculo {
  const erros: string[] = [];

  const texto = (valor: unknown) =>
    typeof valor === "string" ? valor.trim() : "";

  const modelo = texto(corpo.modelo);
  const marca = texto(corpo.marca);
  const cor = texto(corpo.cor);

  if (!modelo) erros.push("O campo 'modelo' e obrigatorio.");
  if (!marca) erros.push("O campo 'marca' e obrigatorio.");
  if (!cor) erros.push("O campo 'cor' e obrigatorio.");

  if (!TIPOS_VALIDOS.includes(corpo.tipo)) {
    erros.push(`O campo 'tipo' deve ser um de: ${TIPOS_VALIDOS.join(", ")}.`);
  }

  const capacidade = Number(corpo.capacidade);
  if (!Number.isInteger(capacidade) || capacidade < 1) {
    erros.push("O campo 'capacidade' deve ser um numero inteiro maior que zero.");
  }

  const valorLocacao = Number(corpo.valorLocacao);
  if (Number.isNaN(valorLocacao) || valorLocacao <= 0) {
    erros.push("O campo 'valorLocacao' deve ser um numero maior que zero.");
  }

  const quantidadeDisponivel = Number(corpo.quantidadeDisponivel ?? 0);
  if (!Number.isInteger(quantidadeDisponivel) || quantidadeDisponivel < 0) {
    erros.push("O campo 'quantidadeDisponivel' deve ser um inteiro maior ou igual a zero.");
  }

  const estoqueMinimo = Number(corpo.estoqueMinimo ?? 1);
  if (!Number.isInteger(estoqueMinimo) || estoqueMinimo < 0) {
    erros.push("O campo 'estoqueMinimo' deve ser um inteiro maior ou igual a zero.");
  }

  if (erros.length > 0) {
    throw new ErroHttp(400, erros.join(" "));
  }

  return {
    modelo,
    marca,
    cor,
    tipo: corpo.tipo,
    capacidade,
    valorLocacao,
    quantidadeDisponivel,
    estoqueMinimo,
  };
}

function lerId(valor: string): number {
  const id = Number(valor);
  if (!Number.isInteger(id) || id < 1) {
    throw new ErroHttp(400, "O id informado e invalido.");
  }
  return id;
}

// GET /veiculos            -> lista todos
// GET /veiculos?busca=gol  -> filtra por modelo, marca ou cor
veiculoRouter.get("/", async (req, res, next) => {
  try {
    const busca = typeof req.query.busca === "string" ? req.query.busca.trim() : "";

    const veiculos = await prisma.veiculo.findMany({
      where: busca
        ? {
            OR: [
              { modelo: { contains: busca, mode: "insensitive" } },
              { marca: { contains: busca, mode: "insensitive" } },
              { cor: { contains: busca, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { id: "asc" },
    });

    res.json(veiculos);
  } catch (erro) {
    next(erro);
  }
});

veiculoRouter.get("/:id", async (req, res, next) => {
  try {
    const id = lerId(req.params.id);
    const veiculo = await prisma.veiculo.findUnique({ where: { id } });

    if (!veiculo) {
      throw new ErroHttp(404, "Veiculo nao encontrado.");
    }

    res.json(veiculo);
  } catch (erro) {
    next(erro);
  }
});

veiculoRouter.post("/", async (req, res, next) => {
  try {
    const dados = validarVeiculo(req.body);
    const veiculo = await prisma.veiculo.create({ data: dados });
    res.status(201).json(veiculo);
  } catch (erro) {
    next(erro);
  }
});

veiculoRouter.put("/:id", async (req, res, next) => {
  try {
    const id = lerId(req.params.id);
    const dados = validarVeiculo(req.body);

    const existe = await prisma.veiculo.findUnique({ where: { id } });
    if (!existe) {
      throw new ErroHttp(404, "Veiculo nao encontrado.");
    }

    const veiculo = await prisma.veiculo.update({ where: { id }, data: dados });
    res.json(veiculo);
  } catch (erro) {
    next(erro);
  }
});

veiculoRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = lerId(req.params.id);

    const existe = await prisma.veiculo.findUnique({ where: { id } });
    if (!existe) {
      throw new ErroHttp(404, "Veiculo nao encontrado.");
    }

    await prisma.veiculo.delete({ where: { id } });
    res.status(204).send();
  } catch (erro) {
    next(erro);
  }
});
