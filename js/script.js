// Lista de paridades disponíveis na ferramenta
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
        if (!data.success) {
            throw new Error(`Erro da API: ${data.error.info}`);
        }
        return data.rates;
    } catch (error) {
        console.error("Erro ao buscar dados de Forex:", error.message);
        return null;
    }
}

// Converte os preços para as paridades
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
    return priceData;
}

// Estratégia para gerar sinais
function generateStrategySignal(data) {
    const shortSMA = calculateSMA(data, 5);
    const longSMA = calculateSMA(data, 10);
    if (shortSMA && longSMA) {
        if (shortSMA > longSMA) return { action: "BUY", message: "Compre Agora!" };
        else if (shortSMA < longSMA) return { action: "SELL", message: "Venda Agora!" };
    }
    return null;
}

// Busca Manual
async function manualSignal() {
    const rates = await fetchForexPrices();
    const selectedPair = document.getElementById("pair-select").value;
    const priceData = convertPrices(rates);
    const data = priceData[selectedPair];

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
    const rates = await fetchForexPrices();
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
