import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
});

// Quando voces implementarem o login (entrega 4), basta salvar o token com
// localStorage.setItem("token", token) que ele passa a ser enviado em toda
// requisicao automaticamente.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A API responde os erros no formato { erro: "mensagem" }.
// Este interceptor transforma isso em um Error comum, entao no componente
// basta usar try/catch e ler erro.message.
api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    const mensagem =
      erro.response?.data?.erro ||
      erro.message ||
      "Nao foi possivel comunicar com a API.";
    return Promise.reject(new Error(mensagem));
  }
);

export default api;
