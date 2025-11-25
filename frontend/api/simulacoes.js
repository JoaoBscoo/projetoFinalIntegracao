import axios from "axios";

function safeNumber(val) {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
        const n = Number(val.replace(".", "").replace(",", "."));
        return isNaN(n) ? 0 : n;
    }
    return 0;
}

function calcularResumo(simulacoes) {
    if (!Array.isArray(simulacoes) || simulacoes.length === 0) {
        return {
            totalSimulacoes: 0,
            totalRotas: 0,
            totalPedidos: 0,
            totalVisitas: 0,
            totalVeiculos: 0,
            totalItens: 0,
            pesoTotal: 0,
            volumeTotal: 0,
            cubagemTotal: 0,
            kmTotal: 0,
            mediaKmPorEntrega: 0,
            utilizacaoMedia: 0,
            utilizacaoVolumeMedia: 0,
            utilizacaoCubagemMedia: 0,
            rotasResumo: [],
            porTipoVeiculo: [],
        };
    }

    const totalSimulacoes = simulacoes.length;

    let totalRotas = 0;
    let totalPedidos = 0;
    let totalVisitas = 0;
    let totalVeiculos = 0;
    let totalItens = 0;

    let pesoTotal = 0;
    let volumeTotal = 0;
    let cubagemTotal = 0;
    let kmTotal = 0;

    let somaMediaKm = 0;
    let somaUtilizacao = 0;
    let somaUtilizacaoVolume = 0;
    let somaUtilizacaoCubagem = 0;

    const rotasResumo = [];
    const mapTipoVeiculo = new Map();

    simulacoes.forEach((sim) => {
        const rotas = Array.isArray(sim.rotas) ? sim.rotas : [];

        totalRotas += rotas.length;
        totalPedidos += safeNumber(sim.numeroPedidos);
        totalVisitas += safeNumber(sim.numeroVisitas);
        totalVeiculos += safeNumber(sim.numeroVeiculos);

        pesoTotal += safeNumber(sim.pesoTotal);
        volumeTotal += safeNumber(sim.volumeTotal);
        cubagemTotal += safeNumber(sim.cubagemTotal);
        kmTotal += safeNumber(sim.quantidadeKM);

        somaMediaKm += safeNumber(sim.mediaKmPercorridaEntrega);
        somaUtilizacao += safeNumber(sim.percentagemUtilizacao);
        somaUtilizacaoVolume += safeNumber(sim.percentagemUtilizacaoVolume);
        somaUtilizacaoCubagem += safeNumber(sim.percentagemUtilizacaoCubagem);

        rotas.forEach((rota) => {
            const pedidos = Array.isArray(rota.pedidos) ? rota.pedidos : [];
            const qtdPedidosRota = pedidos.length;
            let itensRota = 0;

            pedidos.forEach((p) => {
                const itens = Array.isArray(p.itens) ? p.itens : [];
                itensRota += itens.length;
                totalItens += itens.length;
            });

            rotasResumo.push({
                simulacaoId: sim.id,
                data: sim.data,
                nomeRota: rota.nomeRota,
                routeId: rota.routeId,
                placa: rota.placa,
                tipoVeiculo: rota.tipoVeiculo,
                quantidadeEntregas: rota.quantidadeEntregas,
                quantidadePedidos: qtdPedidosRota,
                quantidadeItens: itensRota,
                quantidadeKM: safeNumber(rota.quantidadeKM),
                pesoCarga: safeNumber(rota.pesoCarga),
                taxaOcupacao: safeNumber(rota.taxaOcupacao),
            });

            const chaveTipo = rota.tipoVeiculo || "N/I";
            const atual = mapTipoVeiculo.get(chaveTipo) || {
                tipoVeiculo: chaveTipo,
                rotas: 0,
                pedidos: 0,
                itens: 0,
                kmTotal: 0,
                pesoTotal: 0,
            };

            atual.rotas += 1;
            atual.pedidos += qtdPedidosRota;
            atual.itens += itensRota;
            atual.kmTotal += safeNumber(rota.quantidadeKM);
            atual.pesoTotal += safeNumber(rota.pesoCarga);

            mapTipoVeiculo.set(chaveTipo, atual);
        });
    });

    const mediaKmPorEntrega = somaMediaKm / totalSimulacoes;
    const utilizacaoMedia = somaUtilizacao / totalSimulacoes;
    const utilizacaoVolumeMedia = somaUtilizacaoVolume / totalSimulacoes;
    const utilizacaoCubagemMedia = somaUtilizacaoCubagem / totalSimulacoes;

    const porTipoVeiculo = Array.from(mapTipoVeiculo.values());

    return {
        totalSimulacoes,
        totalRotas,
        totalPedidos,
        totalVisitas,
        totalVeiculos,
        totalItens,
        pesoTotal,
        volumeTotal,
        cubagemTotal,
        kmTotal,
        mediaKmPorEntrega,
        utilizacaoMedia,
        utilizacaoVolumeMedia,
        utilizacaoCubagemMedia,
        rotasResumo,
        porTipoVeiculo,
    };
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res
            .status(405)
            .json({ mensagem: "Método não permitido. Use POST." });
    }

    try {
        // Vercel às vezes não popula req.body, então garantimos parse manual
        let body = req.body;

        if (!body || Object.keys(body).length === 0) {
            let raw = "";
            await new Promise((resolve) => {
                req.on("data", (chunk) => {
                    raw += chunk;
                });
                req.on("end", resolve);
            });

            try {
                body = raw ? JSON.parse(raw) : {};
            } catch (e) {
                body = {};
            }
        }

        console.log("Body recebido na função:", body);

        const { base, usuario, senha, data } = body || {};

        if (!base || !usuario || !senha || !data) {
            return res.status(400).json({
                mensagem: "Informe base, usuario, senha e data.",
                bodyRecebido: body,
            });
        }

        const url = `https://routing.pathfindsistema.com.br/${base}/api/v1/simulacoes`;

        const payload = { date: data };

        console.log("Chamando URL:", url);

        const response = await axios.post(url, payload, {
            headers: {
                "Content-Type": "application/json",
                usuario,
                senha,
            },
            timeout: 30000,
        });

        const simulacoes = response.data;
        console.log(
            "Qtd registros retornados:",
            Array.isArray(simulacoes) ? simulacoes.length : "não é array"
        );

        const resumo = calcularResumo(simulacoes);

        return res.status(200).json(resumo);
    } catch (error) {
        console.error("Erro na função /api/simulacoes:", error);

        if (error.response) {
            return res.status(error.response.status || 500).json({
                mensagem: "Erro na API de simulações.",
                detalhe: error.response.data,
            });
        }

        return res.status(500).json({
            mensagem: "Erro interno ao processar simulações.",
            detalhe: error.message,
        });
    }
}
