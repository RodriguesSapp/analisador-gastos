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
app.use(cors());
app.use(bodyParser.json());
app.use(session({
  secret: "segredo123",
  resave: false,
  saveUninitialized: true,
}));

await initDb();

const USER = { username: "admin", password: "1234" };

function checkLogin(req, res, next) {
  if (req.session && req.session.user) next();
  else res.redirect("/login");
}

//  Rota raiz → sempre vai para o login
app.get("/", (req, res) => {
  res.redirect("/login");
});

//  Página de login (acesso livre)
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

//  Fazer login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    req.session.user = username;
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "Usuário ou senha incorretos" });
  }
});

//  Página protegida
app.get("/index", checkLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//  Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

//  Rotas de gastos
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

//  Só aqui colocamos os arquivos estáticos!
app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => {
  console.log("✅ Servidor rodando em http://localhost:3000");
});
