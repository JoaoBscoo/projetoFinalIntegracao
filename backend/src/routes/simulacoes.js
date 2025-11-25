import { Router } from "express";
import { obterSimulacoes } from "../controllers/simulacoesController.js";

const router = Router();

// POST /api/simulacoes
router.post("/simulacoes", obterSimulacoes);

export default router;
