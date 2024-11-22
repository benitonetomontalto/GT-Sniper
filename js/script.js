function gerarSinalManual() {
  if (intervalManual) {
      alert("Aguarde antes de gerar outro sinal.");
      return;
  }
  intervalManual = true;

  const ativo = document.getElementById("ativo-select").value;
  const tempo = document.getElementById("tempo-select").value;

  const ordem = Math.random() > 0.5 ? "PUT" : "CALL";

  fetch("https://worldtimeapi.org/api/timezone/America/Sao_Paulo")
      .then(response => response.json())
      .then(data => {
          const hora = data.datetime.split("T")[1].split(".")[0];
          const sinal = `
              PARIDADE: ${ativo}
              ⚠️ INÍCIO DA OPERAÇÃO: ${hora}
              🕖 EXPIRAÇÃO: ${tempo}
              🔔 ORDEM: PARA ${ordem}
          `;

          document.getElementById("manual-signal-display").innerHTML = sinal;
      });

  setTimeout(() => {
      intervalManual = false;
  }, 60000);
}

function fetchSinaisAutomaticos() {
  setInterval(() => {
      fetch("/sinais-automaticos")
          .then(response => response.json())
          .then(data => {
              const sinaisDiv = document.getElementById("sinais-automaticos");
              sinaisDiv.innerHTML = ""; // Limpa sinais antigos

              data.forEach(sinal => {
                  const sinalDiv = document.createElement("div");
                  sinalDiv.className = "sinal-automatico";
                  sinalDiv.textContent = `
                      PARIDADE: ${sinal.ativo}
                      ⚠️ INÍCIO DA OPERAÇÃO: ${sinal.horario}
                      🕖 EXPIRAÇÃO: ${sinal.tempo}
                      🔔 ORDEM: PARA ${sinal.ordem}
                  `;
                  sinaisDiv.appendChild(sinalDiv);
              });
          });
  }, 30000); // Atualiza sinais automáticos a cada 30 segundos
}

fetchSinaisAutomaticos();
