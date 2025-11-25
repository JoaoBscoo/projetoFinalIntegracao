import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000", // depois, se mudar, é só ajustar aqui
});

// chamada específica para a rota de simulações
export async function buscarSimulacoes({ base, usuario, senha, data }) {
    const response = await api.post("/api/simulacoes", {
        base,
        usuario,
        senha,
        data,
    });
    return response.data;
}

