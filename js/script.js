const pairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "EUR/JPY", "CAD/JPY", "AUD/CAD", "NZD/USD", "EUR/GBP"];
const API_KEY = "30d5acf592bd385b1e115a5d80549946";

// Verificar conexão com a API
async function checkConnection() {
    const connectionStatus = document.getElementById("connection-status");
    try {
        const response = await fetch(`https://api.exchangerate.host/latest?access_key=${API_KEY}`);
        const data = await response.json();
        if (data.success) {
            connectionStatus.textContent = "Conectado e pronto para gerar sinais!";
            connectionStatus.style.color = "lime";
        } else {
            connectionStatus.textContent = "Erro de conexão com a API.";
            connectionStatus.style.color = "red";
            console.error("Erro da API:", data.error.info);
        }
    } catch (error) {
        connectionStatus.textContent = "Erro ao conectar à API.";
        connectionStatus.style.color = "red";
        console.error("Erro:", error);
    }
}

// Buscar dados de preços de Forex
async function fetchForexPrices() {
    try {
        const response = await fetch(`https://api.exchangerate.host/latest?access_key=${API_KEY}`);
        const data = await response.json();
        if (data.success) {
            console.log("Dados recebidos:", data.rates);
            return data.rates;
        } else {
            console.error("Erro da API:", data.error.info);
        }
    } catch (error) {
        console.error("Erro ao buscar dados de Forex:", error);
    }
    return null;
}

// Converter preços para as paridades
function convertPrices(baseRates) {
    const priceData = {};
    pairs.forEach(pair => {
        const [base, quote] = pair.split("/");
        if (baseRates[base] && baseRates[quote]) {
            priceData[pair] = Array.from({ length: 20 }, () =>
                parseFloat((baseRates[quote] / baseRates[base]).toFixed(5))
            );
        }
    });
    console.log("Dados convertidos:", priceData);
    return priceData;
}

// Calcular SMA (Média Móvel Simples)
function calculateSMA(data, period) {
    if (!data || data.length < period) return null;
    const slice = data.slice(-period);
    const sum = slice.reduce((acc, val) => acc + val, 0);
    return sum / period;
}

// Gerar sinal baseado na estratégia
function generateStrategySignal(data) {
    if (!data || data.length < 10) {
        console.warn("Dados insuficientes para gerar sinais:", data);
        return null;
    }

    const shortSMA = calculateSMA(data, 5);
    const longSMA = calculateSMA(data, 10);

    if (shortSMA && longSMA) {
        if (shortSMA > longSMA) {
            return { action: "BUY", message: "Compre agora!" };
        } else if (shortSMA < longSMA) {
            return { action: "SELL", message: "Venda agora!" };
        }
    }
    return null;
}

// Atualizar sinais automaticamente
async function autoUpdateSignals() {
    const rates = await fetchForexPrices();
    if (!rates) return;

    const priceData = convertPrices(rates);
    const signalList = document.getElementById("auto-signal-list");
    signalList.innerHTML = "";

    pairs.forEach(pair => {
        const data = priceData[pair];
        const signal = generateStrategySignal(data);
        const timeFrame = document.getElementById("time-select").value;

        const listItem = document.createElement("li");
        listItem.className = "signal-message";

        if (signal) {
            listItem.textContent = `${pair} (${timeFrame}): ${signal.message}`;
            listItem.className += signal.action === "BUY" ? " buy" : " sell";
        } else {
            listItem.textContent = `${pair}: Nenhum sinal gerado.`;
        }
        signalList.appendChild(listItem);
    });
}

// Gerar sinal manual
async function manualSignal() {
    const rates = await fetchForexPrices();
    if (!rates) return;

    const selectedPair = document.getElementById("pair-select").value;
    const timeFrame = document.getElementById("time-select").value;
    const priceData = convertPrices(rates);
    const data = priceData[selectedPair];
    const signal = generateStrategySignal(data);

    const signalMessage = document.getElementById("manual-signal-message");
    if (signal) {
        signalMessage.textContent = `${signal.message} (${selectedPair} - ${timeFrame})`;
        signalMessage.className = signal.action === "BUY" ? "signal-message buy" : "signal-message sell";
    } else {
        signalMessage.textContent = "Nenhum sinal gerado no momento.";
        signalMessage.className = "signal-message";
    }
}

// Inicializar ao carregar
document.addEventListener("DOMContentLoaded", () => {
    checkConnection();

    // Configurar botão de sinal manual
    document.querySelector(".get-signal").addEventListener("click", manualSignal);

    // Atualizar sinais automaticamente a cada 30 segundos
    setInterval(autoUpdateSignals, 30000);
});
