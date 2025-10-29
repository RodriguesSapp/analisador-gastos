document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("errorMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = form.username.value.trim();
    const password = form.password.value.trim();

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = "/index"; // 🔑 redirecionamento
      } else {
        errorMsg.textContent = data.message || "Usuário ou senha incorretos";
      }
    } catch (err) {
      console.error(err);
      errorMsg.textContent = "Erro de conexão com o servidor";
    }
  });
});
