// Atualizado para buscar os sinais do servidor corretamente
const API_URL = "https://benitonetomontalto.github.io/GT-Sniper/";

async function fetchSinais() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    if (data.status === "success") {
      const sinaisContainer = document.getElementById("sinais-automaticos");
      sinaisContainer.innerHTML = ""; // Limpa sinais antigos
      data.sinais.forEach((sinal) => {
        const sinalElement = `
          <div class="sinal">
            <p>Paridade: <strong>${sinal.ativo}</strong></p>
            <p>Sinal: <strong>${sinal.sinal.toUpperCase()}</strong></p>
            <p>Prazo: <strong>${sinal.timeframe} min</strong></p>
          </div>
        `;
        sinaisContainer.innerHTML += sinalElement;
      });
    } else {
      console.error("Erro ao gerar sinais:", data.message);
    }
  } catch (error) {
    console.error("Erro ao buscar sinais automáticos:", error);
    // Adiciona eventos aos botões
document.getElementById("gerar-sinal-manual").addEventListener("click", fetchSinais);

  }
}

//
