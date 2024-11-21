document.addEventListener('DOMContentLoaded', () => {
  // Função para gerar sinal manual
  document.getElementById('gerar-sinal').addEventListener('click', () => {
      const ativo = document.getElementById('ativo').value;
      const tempo = document.getElementById('tempo').value;
      const resultadoDiv = document.getElementById('sinal-manual-resultado');
      
      resultadoDiv.innerHTML = `Ativo Selecionado: ${ativo} | Tempo: ${tempo} MIN`;
  });
  
  // Função para buscar sinais automáticos
  function fetchSinais() {
      fetch('http://127.0.0.1:5000/sinais')
          .then(response => response.json())
          .then(data => {
              const sinaisDiv = document.getElementById('sinais-automaticos');
              if (data.status === 'success') {
                  sinaisDiv.innerHTML = '';
                  data.sinais.forEach(sinal => {
                      const sinalElement = document.createElement('div');
                      sinalElement.innerHTML = `
                          <p><strong>Paridade:</strong> ${sinal.ativo}</p>
                          <p><strong>Sinal:</strong> ${sinal.sinal.toUpperCase()}</p>
                          <p><strong>Prazo:</strong> ${sinal.timeframe} MIN</p>
                      `;
                      sinaisDiv.appendChild(sinalElement);
                  });
              } else {
                  sinaisDiv.innerHTML = 'Erro ao gerar sinais.';
              }
          })
          .catch(err => {
              console.error('Erro ao buscar sinais automáticos:', err);
              const sinaisDiv = document.getElementById('sinais-automaticos');
              sinaisDiv.innerHTML = 'Erro ao carregar sinais automáticos.';
          });
  }

  // Chama a função para buscar sinais ao carregar a página
  fetchSinais();

  // Atualiza os sinais automaticamente a cada 30 segundos
  setInterval(fetchSinais, 30000);
});
