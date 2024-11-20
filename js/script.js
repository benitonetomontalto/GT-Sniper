const pairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "EUR/JPY", "CAD/JPY", "AUD/CAD", "NZD/USD", "EUR/GBP"];
const API_KEY = "30d5acf592bd385b1e115a5d80549946";

async function fetchForexPrices() {
    const url = `https://api.exchangerate.host/latest?base=EUR`;
    const connectionStatus = document.getElementById("connection-status");
    try {
        const response = await fetch(url);
        if (!response.ok) {
            connectionStatus.textContent = "Erro de conexão!";
            connectionStatus.style.color = "red";
            throw new Error(`Erro na API: Status ${response.status}`);
        }
        const data = await response.json();
        connectionStatus.textContent = "Conectado e pronto para gerar sinais!";
        connectionStatus.style.color = "lime";
        return data.rates;
    } catch (error) {
        console.error("Erro ao buscar dados:", error.message);
        return null;
    }
}

function calculateSMA(data, period) {
    if (data.length < period) return null;
    const sum = data.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
}

function generateStrategySignal(data) {
    if (!data || data.length === 0) return "Nenhum dado disponível.";
    const shortSMA = calculateSMA(data, 5);
    const longSMA = calculateSMA(data, 10);

    if (shortSMA > longSMA) {
        return "Compre agora!";
    } else if (shortSMA < longSMA) {
        return "Venda agora!";
    }
    return "Nenhum sinal gerado no momento.";
}
