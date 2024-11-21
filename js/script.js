// Gerar sinais automáticos
const gerarSinaisAutomaticos = () => {
  const sinaisDiv = document.getElementById('sinais');
  sinaisDiv.innerHTML = ''; // Limpa sinais anteriores

  const ativos = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'EUR/JPY'];
  const tempos = ['1 MIN', '5 MIN', '15 MIN'];

  ativos.forEach((ativo) => {
      const tempo = tempos[Math.floor(Math.random() * tempos.length)];
      const sinal = Math.random() > 0.5 ? 'Compra' : 'Venda';
      const hora = new Date().toLocaleTimeString();

      // Criar sinal
      const sinalElement = document.createElement('div');
      sinalElement.className = 'sinal';
      sinalElement.innerHTML = `
          <p><strong>Ativo:</strong> ${ativo}</p>
          <p><strong>Hora:</strong> ${hora}</p>
          <p><strong>Tempo:</strong> ${tempo}</p>
          <p><strong>Sinal:</strong> ${sinal}</p>
      `;
      sinaisDiv.appendChild(sinalElement);
  });
};

// Gerar sinal manual
const gerarSinalManual = () => {
  const ativo = document.getElementById('ativo').value;
  const tempo = document.getElementById('tempo').value;
  const sinal = Math.random() > 0.5 ? 'Compra' : 'Venda';

  const sinalManualDiv = document.getElementById('sinal-manual');
  sinalManualDiv.innerHTML = `
      <p><strong>${ativo}</strong></p>
      <p>Hora: ${new Date().toLocaleTimeString()}</p>
      <p><strong>${tempo}</strong></p>
      <button style="background-color: ${sinal === 'Compra' ? 'green' : 'red'}; color: white;">${sinal}</button>
  `;
};

// Atualizar sinais automáticos a cada 30 segundos
setInterval(gerarSinaisAutomaticos, 30000);
gerarSinaisAutomaticos();
