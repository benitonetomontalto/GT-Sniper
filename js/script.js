const urlBase = "http://127.0.0.1:5000";

// Atualizar sinais automáticos
const atualizarSinaisAutomaticos = () => {
    fetch(`${urlBase}/sinais`)
        .then(response => response.json())
        .then(data => {
            const lista = document.getElementById("sinais-automaticos");
            lista.innerHTML = ""; // Limpa a lista antes de atualizar
            data.sinais.forEach(sinal => {
                const item = document.createElement("li");
                item.textContent = `PAR: ${sinal.par} | INÍCIO: ${sinal.hora} | EXPIRAÇÃO: ${sinal.timeframe} | ORDEM: ${sinal.ordem}`;
                lista.appendChild(item);
            });
        })
        .catch(err => console.error("Erro ao buscar sinais automáticos:", err));
};

// Gerar sinal manual
const gerarSinalManual = () => {
    fetch(`${urlBase}/sinal-manual`)
        .then(response => response.json())
        .then(data => {
            if (data.status === "error") {
                alert(data.message);
                return;
            }
            const sinal = data.sinal;
            const texto = `PAR: ${sinal.par} | INÍCIO: ${sinal.hora} | EXPIRAÇÃO: ${sinal.timeframe} | ORDEM: ${sinal.ordem}`;
            document.getElementById("manual-sinal").textContent = texto;
        })
        .catch(err => console.error("Erro ao gerar sinal manual:", err));
};

document.getElementById("gerar-sinal-manual").addEventListener("click", gerarSinalManual);

// Atualizar sinais automáticos a cada 5 segundos
setInterval(atualizarSinaisAutomaticos, 5000);
