// Atualizar sinais automáticos constantemente
async function atualizarSinaisAutomaticos() {
  try {
      const response = await fetch('http://127.0.0.1:5000/sinais-automaticos');
      const data = await response.json();

      const display = document.getElementById('auto-signal-display');
      display.innerHTML = "";

      data.sinais.forEach((sinal) => {
          const sinalDiv = document.createElement('div');
          sinalDiv.classList.add('signal-item');
          sinalDiv.innerHTML = `
              <p>PAR DE MOEDA: ${sinal.paridade}</p>
              <p>⚠️INÍCIO DA OPERAÇÃO: ${sinal.horario}</p>
              <p>🕖EXPIRAÇÃO: ${sinal.timeframe}</p>
              <p>🔔ORDEM: PARA ${sinal.ordem}</p>
          `;
          display.appendChild(sinalDiv);
      });
  } catch (error) {
      console.error('Erro ao carregar sinais automáticos:', error);
  }
}

// Gerar sinal manual
async function gerarSinalManual() {
  try {
      const response = await fetch('http://127.0.0.1:5000/sinal-manual');
      const data = await response.json();

      const display = document.getElementById('manual-signal-display');
      const sinal = data.sinal;

      display.innerHTML = `
          <p>PAR DE MOEDA: ${sinal.paridade}</p>
          <p>⚠️INÍCIO DA OPERAÇÃO: ${sinal.horario}</p>
          <p>🕖EXPIRAÇÃO: ${sinal.timeframe}</p>
          <p>🔔ORDEM: PARA ${sinal.ordem}</p>
      `;
  } catch (error) {
      console.error('Erro ao gerar sinal manual:', error);
  }
}

// Configurar eventos
document.getElementById('gerar-sinal-manual').addEventListener('click', gerarSinalManual);

// Atualizar sinais automáticos periodicamente
setInterval(atualizarSinaisAutomaticos, 5000);
