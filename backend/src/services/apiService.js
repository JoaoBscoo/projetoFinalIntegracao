import axios from "axios";

export async function buscarSimulacoesExternas({ base, usuario, senha, data }) {
    if (!base) {
        throw new Error("Base não informada.");
    }

    // monta a URL dinâmica com a base do cliente
    const url = `https://routing.pathfindsistema.com.br/${base}/api/v1/simulacoes`;

    // o body que o Postman manda
    const payload = {
        date: data, // aqui mapeamos "data" do front para "date" da API
    };

    const response = await axios.post(url, payload, {
        headers: {
            "Content-Type": "application/json",
            usuario: usuario,
            senha: senha,
        },
        timeout: 30000,
    });

    return response.data;
}
