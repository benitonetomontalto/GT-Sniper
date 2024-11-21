document.getElementById('generate-signal').addEventListener('click', () => {
    const pair = document.getElementById('pair-select').value;
    const timeframe = document.getElementById('time-select').value;

    fetch('http://127.0.0.1:5000/sinais')
        .then(response => response.json())
        .then(data => {
            const signal = data.sinais.find(s => s.ativo === pair && s.timeframe === parseInt(timeframe));
            document.getElementById('manual-signal-result').textContent = signal
                ? \Sinal para \: \ em M\\
                : 'Nenhum sinal gerado.';
        })
        .catch(error => console.error('Erro ao buscar sinais:', error));
});

setInterval(() => {
    fetch('http://127.0.0.1:5000/sinais')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('auto-signals-list');
            list.innerHTML = '';
            data.sinais.forEach(signal => {
                const li = document.createElement('li');
                li.textContent = \\: \ em M\\;
                list.appendChild(li);
            });
        })
        .catch(error => console.error('Erro ao atualizar sinais automáticos:', error));
}, 60000);
