import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { openDb, initDb } from "./db.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
await initDb();

app.use(express.static("../public"));

// Rotas básicas
app.get("/gastos", async (req, res) => {
  const db = await openDb();
  const gastos = await db.all("SELECT * FROM gastos");
  res.json(gastos);
});

app.post("/gastos", async (req, res) => {
  const { descricao, valor, categoria, data } = req.body;
  const db = await openDb();
  await db.run(
    "INSERT INTO gastos (descricao, valor, categoria, data) VALUES (?, ?, ?, ?)",
    [descricao, valor, categoria, data]
  );
  res.json({ status: "ok" });
});

app.get("/total", async (req, res) => {
  const db = await openDb();
  const result = await db.get("SELECT SUM(valor) as total FROM gastos");
  res.json(result);
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
