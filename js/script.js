let paridades = ["ETHUSD", "BTCUSD", "EURUSD", "GBPUSD"];
let sinais = ["PUT", "CALL"];
let tempos = ["1 MIN", "5 MIN", "15 MIN"];

// Atualizar sinal automaticamente
function gerarSinalAutomatico() {
    const asset = paridades[Math.floor(Math.random() * paridades.length)];
    const signal = sinais[Math.floor(Math.random() * sinais.length)];
    const time = tempos[Math.floor(Math.random() * tempos.length)];

    document.getElementById("asset").textContent = asset;
    document.getElementById("signal").textContent = signal;
    document.getElementById("time").textContent = time;

    alert(`PAR DE MOEDA: ${asset}\n⚠️INÍCIO DA OPERAÇÃO: ${new Date().toLocaleTimeString("pt-BR")}\n🕖EXPIRAÇÃO ${time}\n🔔ORDEM: PARA ${signal}`);
}

// Configurar botão
document.getElementById("next-signal").addEventListener("click", gerarSinalAutomatico);

// Iniciar automaticamente
setInterval(gerarSinalAutomatico, 60000); // Atualiza a cada 1 minuto
