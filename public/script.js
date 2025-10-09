const form = document.getElementById("gastoForm");
const tabela = document.querySelector("#tabelaGastos tbody");
const totalEl = document.getElementById("total");

async function carregarGastos() {
  const res = await fetch("/gastos");
  const gastos = await res.json();

  tabela.innerHTML = "";
  let total = 0;

  gastos.forEach(g => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${g.descricao}</td>
      <td>R$ ${g.valor.toFixed(2)}</td>
      <td>${g.categoria}</td>
      <td>${g.data}</td>
    `;
    tabela.appendChild(tr);
    total += g.valor;
  });

  totalEl.textContent = ` Total: R$ ${total.toFixed(2)}`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const novoGasto = {
    descricao: descricao.value,
    valor: parseFloat(valor.value),
    categoria: categoria.value,
    data: data.value,
  };

  await fetch("/gastos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoGasto),
  });

  form.reset();
  carregarGastos();
});

carregarGastos();
