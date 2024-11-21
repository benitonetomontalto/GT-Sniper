document.addEventListener("DOMContentLoaded", () => {
  fetchSinaisAutomaticos();
});

async function fetchSinaisAutomaticos() {
  try {
      const response = await fetch("/api/sinais-automaticos");
      if (!response.ok) throw new Error("Erro ao buscar sinais automáticos");

      const sinais = await response.json();
      const signalList = document.getElementById("signal-list");
      signalList.innerHTML = "";

      sinais.forEach(sinal => {
          const li = document.createElement("li");
          li.textContent = `
              PAR DE MOEDA: ${sinal.paridade}
              ⚠️ INÍCIO DA OPERAÇÃO: ${sinal.horario}
              🕖 EXPIRAÇÃO: ${sinal.expiracao}
              🔔 ORDEM: ${sinal.ordem.toUpperCase()}
          `;
          signalList.appendChild(li);
      });
  } catch (error) {
      console.error("Erro ao buscar sinais automáticos:", error);
  }
}

function gerarSinalManual() {
  const manualOutput = document.getElementById("manual-signal-output");
  const sinais = ["Compra", "Venda"];
  const ordem = sinais[Math.floor(Math.random() * sinais.length)];
  manualOutput.textContent = `
      SINAL MANUAL GERADO:
      🔔 ORDEM: ${ordem.toUpperCase()}
  `;
}
