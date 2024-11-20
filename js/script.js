// Lista de paridades disponíveis
const pairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "EUR/JPY", "CAD/JPY", "AUD/CAD", "NZD/USD", "EUR/GBP"];

// Chave da API
const API_KEY = "30d5acf592bd385b1e115a5d80549946";

// Função para buscar preços de Forex
async function fetchForexPrices() {
    const url = `https://api.exchangerate.host/latest?access_key=${API_KEY}&base=EUR`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro na API: Status ${response.status}`);
        }
        const data = await response.json();
        console.log("Dados recebidos da API:", data);
        return data.rates || null;
    } catch (error) {
        console.error("Erro ao buscar dados de Forex:", error.message);
        return null;
    }
}

// Converte os preços para as paridades
function convertPrices(baseRates) {
    if (!baseRates || Object.keys(baseRates).length === 0) {
        console.error("Dados da API incompletos ou inválidos.");
        return {};
    }

    const priceData = {};
    pairs.forEach(pair => {
        const [base, quote] = pair.split("/");
        if (baseRates[base] && baseRates[quote]) {
            priceData[pair] = Array.from({ length: 20 }, () =>
                parseFloat((baseRates[quote] / baseRates[base]).toFixed(5))
            );
        }
    });
    console.log("Preços convertidos para paridades:", priceData);
    return priceData;
}

// Função para calcular a SMA
function calculateSMA(data, period) {
    if (!data || data.length < period) return null;
    const sum = data.slice(0, period).reduce((a, b) => a + b, 0);
    return sum / period;
}

// Estratégia para gerar sinais
function generateStrategySignal(data) {
    if (!data) return null;
    const shortSMA = calculateSMA(data, 5);
    const longSMA = calculateSMA(data, 10);

    console.log("Short SMA:", shortSMA, "Long SMA:", longSMA);

    if (shortSMA && longSMA) {
        if (shortSMA > longSMA) return { action: "BUY", message: "Compre Agora!" };
        if (shortSMA < longSMA) return { action: "SELL", message: "Venda Agora!" };
    }
    return null;
}

// Busca Manual
async function manualSignal() {
    console.log("Função manualSignal chamada");
    const rates = await fetchForexPrices();
    if (!rates) {
        console.error("Erro ao buscar taxas. Verifique a API.");
        return;
    }

    const selectedPair = document.getElementById("pair-select").value;
    const priceData = convertPrices(rates);
    const data = priceData[selectedPair];

    console.log("Dados para SMA do par selecionado:", data);

    const signal = generateStrategySignal(data);

    const signalMessage = document.getElementById("manual-signal-message");
    if (signal) {
        signalMessage.textContent = signal.message;
        signalMessage.className = signal.action === "BUY" ? "signal-message buy" : "signal-message sell";
    } else {
        signalMessage.textContent = "Nenhum sinal gerado no momento.";
        signalMessage.className = "signal-message";
    }
}

// Busca Automática
async function autoUpdateSignals() {
    console.log("Atualizando sinais automáticos...");
    const rates = await fetchForexPrices();
    if (!rates) {
        console.error("Erro ao buscar taxas. Verifique a API.");
        return;
    }

    const priceData = convertPrices(rates);
    const signalList = document.getElementById("auto-signal-list");
    signalList.innerHTML = ""; // Limpa a lista

    pairs.forEach(pair => {
        const data = priceData[pair];
        const signal = generateStrategySignal(data);
        const listItem = document.createElement("li");
        listItem.className = "signal-message";

        if (signal) {
            listItem.textContent = `${pair}: ${signal.message}`;
            listItem.className += signal.action === "BUY" ? " buy" : " sell";
        } else {
            listItem.textContent = `${pair}: Nenhum sinal gerado.`;
        }
        signalList.appendChild(listItem);
    });
}

// Intervalo Automático
setInterval(autoUpdateSignals, 30000);

// Botão para busca manual
document.querySelector(".get-signal").addEventListener("click", manualSignal);
