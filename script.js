document.getElementById("buscarForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const chave = document.getElementById("chave").value.trim();
  const resultadoDiv = document.getElementById("resultado");

  resultadoDiv.innerHTML = "🔄 Buscando...";

  try {
    const response = await fetch(`https://patronhost.online/api/buscar?key=${chave}`);
    const data = await response.json();

    if (data.status === false) {
      resultadoDiv.innerHTML = "❌ Chave inválida ou não encontrada.";
      return;
    }

    resultadoDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (error) {
    resultadoDiv.innerHTML = "⚠️ Erro ao buscar os dados.";
  }
});
