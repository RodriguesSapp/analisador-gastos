// server.js
import express from "express";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import { openDb, initDb } from "./db.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Middlewares globais ---
app.use(cors());
app.use(bodyParser.json());
app.use(session({
  secret: "segredo123",
  resave: false,
  saveUninitialized: true,
}));

// --- Servir arquivos estáticos antes de tudo ---
app.use(express.static(path.join(__dirname, "public")));

// --- Inicializa banco ---
await initDb();

// --- Usuário fixo para login temporário ---
const USER = { username: "admin", password: "1234" };

// --- Middleware de autenticação ---
function checkLogin(req, res, next) {
  if (req.session && req.session.user) next();
  else res.redirect("/login");
}

// --- Rotas públicas ---

// Rota pública inicial
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "home.html"));
});


app.get("/", (req, res) => res.redirect("/home"));


app.get("/", (req, res) => res.redirect("/login"));

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "login.html"));
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    req.session.user = username;
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "Usuário ou senha incorretos" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

// --- Rotas protegidas ---
app.get("/index", checkLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "index.html"));
});

app.get("/gastos", checkLogin, async (req, res) => {
  const db = await openDb();
  const gastos = await db.all("SELECT * FROM gastos");
  res.json(gastos);
});

app.post("/gastos", checkLogin, async (req, res) => {
  const { descricao, valor, categoria, data } = req.body;
  const db = await openDb();
  await db.run(
    "INSERT INTO gastos (descricao, valor, categoria, data) VALUES (?, ?, ?, ?)",
    [descricao, valor, categoria, data]
  );
  res.json({ status: "ok" });
});

// --- Iniciar servidor ---
app.listen(5000, () => {
  console.log("✅ Servidor rodando em http://localhost:5000");
});
