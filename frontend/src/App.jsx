import { Navigate, Route, Routes } from "react-router-dom";
import CadastroVeiculo from "./pages/CadastroVeiculo";
import Login from "./pages/Login";

export default function App() {
  return (
    <Routes>
      <Route path="/veiculos" element={<CadastroVeiculo />} />
      <Route path="/login" element={<Login />} />       
      {/* TODO (alunos): criem as telas que faltam e registrem as rotas aqui.
          <Route path="/login" element={<Login />} />                      entrega 4
          <Route path="/principal" element={<Principal />} />              entrega 5
          <Route path="/disponibilidade" element={<Disponibilidade />} />  entrega 7
      */}

      <Route path="*" element={<Navigate to="/veiculos" replace />} />
    </Routes>
  );
}
