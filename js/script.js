// Sua API Key
const API_KEY = "30d5acf592bd385b1e115a5d80549946";

// Verifica conexão com a API
async function checkApiConnection() {
    const apiStatus = document.getElementById("api-status");
    try {
        const response = await fetch(`https://api.exchangerate.host/latest?access_key=${API_KEY}`);
        if (response.ok) {
            apiStatus.textContent = "Conectado à API!";
            apiStatus.classList.add("connected");
            apiStatus.classList.remove("error");
        } else {
            throw new Error("Erro na conexão");
        }
    } catch (error) {
        apiStatus.textContent = "Erro ao conectar à API.";
        apiStatus.classList.add("error");
        apiStatus.classList.remove("connected");
    }
}

// Função para buscar preços de Forex
async function fetchForexPrices() {
    const url = `https://api.exchangerate.host/latest?access_key=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro na API: Status ${response.status}`);
        }
        const data = await response.json();
        return data.rates;
    } catch (error) {
        console.error("Erro ao buscar dados de Forex:", error.message);
        return null;
    }
}

// Estratégia para gerar sinais
function generateStrategySignal(data) {
    const shortSMA = calculateSMA(data, 5);
    const longSMA = calculateSMA(data, 10);
    if (shortSMA && longSMA) {
        if (shortSMA > longSMA) return { action: "BUY", message: "Compre agora!" };
        else if (shortSMA < longSMA) return { action: "SELL", message: "Venda agora!" };
    }
    return null;
}

// Calcula média móvel simples (SMA)
function calculateSMA(data, period) {
    if (!data || data.length < period) return null;
    const slice = data.slice(-period);
    const sum = slice.reduce((acc, val) => acc + val, 0);
    return sum / period;
}

// Busca manual de sinais
async function manualSignal() {
    const rates = await fetchForexPrices();
    const selectedPair = document.getElementById("pair-select").value;
    const timeFrame = document.getElementById("time-select").value; // Adicionado o time frame
    const priceData = convertPrices(rates);
    const data = priceData[selectedPair];

    const signal = generateStrategySignal(data);

    const signalMessage = document.getElementById("manual-signal-message");
    if (signal) {
        signalMessage.textContent = `${signal.message} (${selectedPair}, ${timeFrame})`;
        signalMessage.className = signal.action === "BUY" ? "signal-message buy" : "signal-message sell";
    } else {
        signalMessage.textContent = "Nenhum sinal gerado no momento.";
        signalMessage.className = "signal-message";
    }
}

// Converte os preços para as paridades disponíveis
function convertPrices(baseRates) {
    const pairs = [
        "EUR/USD",
        "GBP/USD",
        "USD/JPY",
        "AUD/USD",
        "EUR/JPY",
        "CAD/JPY",
        "AUD/CAD",
        "NZD/USD",
        "EUR/GBP"
    ];

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

// Busca automática de sinais
async function autoUpdateSignals() {
    const rates = await fetchForexPrices();
    const priceData = convertPrices(rates);
    const signalList = document.getElementById("auto-signal-list");
    signalList.innerHTML = ""; // Limpa a lista de sinais automáticos

    const timeFrame = document.getElementById("time-select").value; // Adicionado o time frame

    Object.keys(priceData).forEach(pair => {
        const data = priceData[pair];
        const signal = generateStrategySignal(data);
        const listItem = document.createElement("li");
        listItem.className = "signal-message";

        if (signal) {
            listItem.textContent = `${pair}: ${signal.message} (${timeFrame})`;
            listItem.className += signal.action === "BUY" ? " buy" : " sell";
        } else {
            listItem.textContent = `${pair}: Nenhum sinal gerado.`;
        }
        signalList.appendChild(listItem);
    });
}

// Atualiza sinais automaticamente a cada 30 segundos
setInterval(autoUpdateSignals, 30000);

// Evento no botão para busca manual
document.querySelector(".get-signal").addEventListener("click", manualSignal);

// Executa a verificação de conexão ao carregar a página
checkApiConnection();
