let signalInterval;

function getHoraAtualBrasilia() {
    const now = new Date();
    const utcNow = now.getTime() + now.getTimezoneOffset() * 60000; // Ajuste UTC
    const brasiliaTime = new Date(utcNow + 3600000 * -3); // UTC-3 para Brasília
    const horas = brasiliaTime.getHours().toString().padStart(2, "0");
    const minutos = brasiliaTime.getMinutes().toString().padStart(2, "0");
    return `${horas}:${minutos}`;
}

function gerarSinal() {
    if (signalInterval) {
        alert("Aguarde enquanto analisamos o próximo sinal!");
        return;
    }

    document.getElementById("asset").innerText = "ANALYSING...";
    document.getElementById("order").innerText = "WAITING...";
    document.getElementById("time").innerText = "WAITING...";

    signalInterval = setTimeout(() => {
        const assets = ["EUR/USD", "GBP/USD", "AUD/CAD", "ETH/USD"];
        const times = ["1 MIN", "5 MIN", "15 MIN"];
        const orders = ["BUY", "SELL"];

        const selectedAsset = assets[Math.floor(Math.random() * assets.length)];
        const selectedTime = times[Math.floor(Math.random() * times.length)];
        const selectedOrder = orders[Math.floor(Math.random() * orders.length)];
        const horaAtual = getHoraAtualBrasilia();

        document.getElementById("asset").innerText = selectedAsset;
        document.getElementById("order").innerText = selectedOrder === "BUY" ? "CALL" : "PUT";
        document.getElementById("time").innerText = `${horaAtual} (${selectedTime})`;

        clearTimeout(signalInterval);
        signalInterval = null;
    }, 30000); // Wait for 30 seconds
}
