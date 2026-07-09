import "dotenv/config";
import express from "express";
import cors from "cors";
import { veiculoRouter } from "./routes/veiculo.routes";
import { erroHandler, rotaNaoEncontrada } from "./middlewares/erroHandler";

const app = express();
const porta = Number(process.env.PORT ?? 3333);

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/veiculos", veiculoRouter);

// TODO (alunos): registrem aqui as rotas que voces criarem.
// app.use("/auth", authRouter);                  // entrega 4 - login
// app.use("/movimentacoes", movimentacaoRouter); // entrega 7 - entrada/saida

app.use(rotaNaoEncontrada);
app.use(erroHandler);

app.listen(porta, () => {
  console.log(`API rodando em http://localhost:${porta}`);
});
