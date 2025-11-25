import express from "express";
import cors from "cors";
import simulacoesRoutes from "./routes/simulacoes.js";

const app = express();

// permitir JSON no body
app.use(express.json());

// permitir o front em http://localhost:5173
app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

// prefixo /api para as rotas
app.use("/api", simulacoesRoutes);

export default app;
