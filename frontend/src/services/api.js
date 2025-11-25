import axios from "axios";

const baseURL =
    import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const api = axios.create({
    baseURL,
});

export async function buscarSimulacoes({ base, usuario, senha, data }) {
    const response = await api.post("/api/simulacoes", {
        base,
        usuario,
        senha,
        data,
    });
    return response.data;
}
