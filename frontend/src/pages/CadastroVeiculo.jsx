import { useEffect, useState } from "react";
import api from "../services/api";

const FORM_VAZIO = {
  modelo: "",
  marca: "",
  cor: "",
  tipo: "PASSEIO",
  capacidade: "",
  valorLocacao: "",
  quantidadeDisponivel: "",
  estoqueMinimo: "",
};

const TIPOS = [
  { valor: "PASSEIO", rotulo: "Carro de passeio" },
  { valor: "UTILITARIO", rotulo: "Utilitario" },
  { valor: "MOTO", rotulo: "Moto" },
];

export default function CadastroVeiculo() {
  const [veiculos, setVeiculos] = useState([]);
  const [busca, setBusca] = useState("");
  const [form, setForm] = useState(FORM_VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState(null);

  async function carregarVeiculos(termo = "") {
    setCarregando(true);
    try {
      const { data } = await api.get("/veiculos", {
        params: termo ? { busca: termo } : {},
      });
      setVeiculos(data);
    } catch (erro) {
      setMensagem({ tipo: "erro", texto: erro.message });
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarVeiculos();
  }, []);

  function handleBuscar(evento) {
    evento.preventDefault();
    carregarVeiculos(busca.trim());
  }

  function handleChange(evento) {
    const { name, value } = evento.target;
    setForm((anterior) => ({ ...anterior, [name]: value }));
  }

  function validarFormulario() {
    const erros = [];

    if (!form.modelo.trim()) erros.push("Informe o modelo.");
    if (!form.marca.trim()) erros.push("Informe a marca.");
    if (!form.cor.trim()) erros.push("Informe a cor.");

    const capacidade = Number(form.capacidade);
    if (!Number.isInteger(capacidade) || capacidade < 1) {
      erros.push("A capacidade deve ser um numero inteiro maior que zero.");
    }

    const valor = Number(form.valorLocacao);
    if (Number.isNaN(valor) || valor <= 0) {
      erros.push("O valor de locacao deve ser maior que zero.");
    }

    const disponivel = Number(form.quantidadeDisponivel);
    if (!Number.isInteger(disponivel) || disponivel < 0) {
      erros.push("A quantidade disponivel deve ser um inteiro maior ou igual a zero.");
    }

    const minimo = Number(form.estoqueMinimo);
    if (!Number.isInteger(minimo) || minimo < 0) {
      erros.push("O estoque minimo deve ser um inteiro maior ou igual a zero.");
    }

    return erros;
  }

  async function handleSubmit(evento) {
    evento.preventDefault();

    const erros = validarFormulario();
    if (erros.length > 0) {
      setMensagem({ tipo: "erro", texto: erros.join(" ") });
      return;
    }

    const dados = {
      modelo: form.modelo.trim(),
      marca: form.marca.trim(),
      cor: form.cor.trim(),
      tipo: form.tipo,
      capacidade: Number(form.capacidade),
      valorLocacao: Number(form.valorLocacao),
      quantidadeDisponivel: Number(form.quantidadeDisponivel),
      estoqueMinimo: Number(form.estoqueMinimo),
    };

    try {
      if (editandoId) {
        await api.put(`/veiculos/${editandoId}`, dados);
        setMensagem({ tipo: "sucesso", texto: "Veiculo atualizado com sucesso." });
      } else {
        await api.post("/veiculos", dados);
        setMensagem({ tipo: "sucesso", texto: "Veiculo cadastrado com sucesso." });
      }
      handleCancelar();
      carregarVeiculos(busca.trim());
    } catch (erro) {
      setMensagem({ tipo: "erro", texto: erro.message });
    }
  }

  function handleEditar(veiculo) {
    setEditandoId(veiculo.id);
    setForm({
      modelo: veiculo.modelo,
      marca: veiculo.marca,
      cor: veiculo.cor,
      tipo: veiculo.tipo,
      capacidade: String(veiculo.capacidade),
      valorLocacao: String(veiculo.valorLocacao),
      quantidadeDisponivel: String(veiculo.quantidadeDisponivel),
      estoqueMinimo: String(veiculo.estoqueMinimo),
    });
    setMensagem(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelar() {
    setEditandoId(null);
    setForm(FORM_VAZIO);
  }

  async function handleExcluir(veiculo) {
    const confirmado = window.confirm(
      `Deseja realmente excluir o veiculo ${veiculo.marca} ${veiculo.modelo}?`
    );
    if (!confirmado) return;

    try {
      await api.delete(`/veiculos/${veiculo.id}`);
      setMensagem({ tipo: "sucesso", texto: "Veiculo excluido com sucesso." });
      if (editandoId === veiculo.id) handleCancelar();
      carregarVeiculos(busca.trim());
    } catch (erro) {
      setMensagem({ tipo: "erro", texto: erro.message });
    }
  }

  return (
    <main className="container">
      <header className="cabecalho">
        <h1>Cadastro de Veiculos</h1>
        <p>Locadora - SAEP</p>
      </header>

      {mensagem && (
        <div className={`alerta alerta--${mensagem.tipo}`}>
          {mensagem.texto}
          <button type="button" onClick={() => setMensagem(null)}>
            fechar
          </button>
        </div>
      )}

      <section className="cartao">
        <h2>{editandoId ? "Editar veiculo" : "Novo veiculo"}</h2>

        <form className="formulario" onSubmit={handleSubmit}>
          <label>
            Modelo
            <input name="modelo" value={form.modelo} onChange={handleChange} />
          </label>

          <label>
            Marca
            <input name="marca" value={form.marca} onChange={handleChange} />
          </label>

          <label>
            Cor
            <input name="cor" value={form.cor} onChange={handleChange} />
          </label>

          <label>
            Tipo
            <select name="tipo" value={form.tipo} onChange={handleChange}>
              {TIPOS.map((tipo) => (
                <option key={tipo.valor} value={tipo.valor}>
                  {tipo.rotulo}
                </option>
              ))}
            </select>
          </label>

          <label>
            Capacidade
            <input
              name="capacidade"
              type="number"
              min="1"
              value={form.capacidade}
              onChange={handleChange}
            />
          </label>

          <label>
            Valor da locacao (R$)
            <input
              name="valorLocacao"
              type="number"
              step="0.01"
              min="0"
              value={form.valorLocacao}
              onChange={handleChange}
            />
          </label>

          <label>
            Quantidade disponivel
            <input
              name="quantidadeDisponivel"
              type="number"
              min="0"
              value={form.quantidadeDisponivel}
              onChange={handleChange}
            />
          </label>

          <label>
            Estoque minimo
            <input
              name="estoqueMinimo"
              type="number"
              min="0"
              value={form.estoqueMinimo}
              onChange={handleChange}
            />
          </label>

          <div className="acoes-formulario">
            <button type="submit" className="botao botao--primario">
              {editandoId ? "Salvar alteracoes" : "Cadastrar"}
            </button>
            {editandoId && (
              <button type="button" className="botao" onClick={handleCancelar}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="cartao">
        <div className="cabecalho-lista">
          <h2>Veiculos cadastrados</h2>

          <form className="busca" onSubmit={handleBuscar}>
            <input
              placeholder="Buscar por modelo, marca ou cor"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
            <button type="submit" className="botao">
              Buscar
            </button>
            {busca && (
              <button
                type="button"
                className="botao"
                onClick={() => {
                  setBusca("");
                  carregarVeiculos();
                }}
              >
                Limpar
              </button>
            )}
          </form>
        </div>

        {carregando ? (
          <p>Carregando...</p>
        ) : veiculos.length === 0 ? (
          <p>Nenhum veiculo encontrado.</p>
        ) : (
          <div className="tabela-wrapper">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Modelo</th>
                  <th>Marca</th>
                  <th>Cor</th>
                  <th>Tipo</th>
                  <th>Cap.</th>
                  <th>Valor</th>
                  <th>Disp.</th>
                  <th>Min.</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {veiculos.map((veiculo) => (
                  <tr key={veiculo.id}>
                    <td>{veiculo.modelo}</td>
                    <td>{veiculo.marca}</td>
                    <td>{veiculo.cor}</td>
                    <td>{veiculo.tipo}</td>
                    <td>{veiculo.capacidade}</td>
                    <td>R$ {Number(veiculo.valorLocacao).toFixed(2)}</td>
                    <td>{veiculo.quantidadeDisponivel}</td>
                    <td>{veiculo.estoqueMinimo}</td>
                    <td className="acoes-linha">
                      <button
                        type="button"
                        className="botao botao--pequeno"
                        onClick={() => handleEditar(veiculo)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="botao botao--pequeno botao--perigo"
                        onClick={() => handleExcluir(veiculo)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
