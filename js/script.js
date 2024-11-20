// Lista de paridades disponíveis
const pairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "EUR/JPY", "CAD/JPY", "AUD/CAD", "NZD/USD", "EUR/GBP"];
const timeFrames = ["M1", "M5", "M15", "M30"]; // Adicionando os tempos gráficos
const API_KEY = "30d5acf592bd385b1e115a5d80549946";

// Função para buscar preços Forex
async function fetchForexPrices() {
    const url = `https://api.exchangerate.host/latest?base=EUR&access_key=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro na API: Status ${response.status}`);
        }
        const data = await response.json();
        console.log("Dados da API:", data);
        return data.rates;
    } catch (error) {
        console.error("Erro ao buscar dados de Forex:", error.message);
        return null;
    }
}

// Converte preços para as paridades
function convertPrices(baseRates) {
    const priceData = {};
    pairs.forEach(pair => {
        const [base, quote] = pair.split("/");
        if (baseRates[base] && baseRates[quote]) {
            priceData[pair] = parseFloat((baseRates[quote] / baseRates[base]).toFixed(5));
        }
    });
    console.log("Dados processados para sinais:", priceData);
    return priceData;
}

// Estratégia de Geração de Sinais
function generateSignal(currentPrice, timeFrame) {
    if (!currentPrice) {
        return { action: "WAIT", message: "Sem dados disponíveis.", timeFrame: timeFrame || "N/A" };
    }
    const randomDirection = Math.random() > 0.5 ? "BUY" : "SELL";
    const message = randomDirection === "BUY" ? "Compre agora!" : "Venda agora!";
    console.log(`Sinal gerado para preço ${currentPrice}:`, { action: randomDirection, message, timeFrame });
    return { action: randomDirection, message, timeFrame };
}

// Geração Manual de Sinais
async function manualSignal() {
    const rates = await fetchForexPrices();
    if (!rates) {
        alert("Erro ao obter dados da API. Verifique sua conexão.");
        return;
    }

    const selectedPair = document.getElementById("pair-select").value;
    const selectedTime = document.getElementById("time-select").value;
    const priceData = convertPrices(rates);
    const currentPrice = priceData[selectedPair];

    const signal = generateSignal(currentPrice, selectedTime);

    const signalMessage = document.getElementById("manual-signal-message");
    if (signal) {
        signalMessage.textContent = `${signal.message} (${selectedPair}, Tempo: ${signal.timeFrame})`;
        signalMessage.className = signal.action === "BUY" ? "signal-message buy" : "signal-message sell";
    } else {
        signalMessage.textContent = "Nenhum sinal gerado.";
        signalMessage.className = "signal-message";
    }
}

// Geração Automática de Sinais
async function autoUpdateSignals() {
    console.log("Atualizando sinais automaticamente...");
    const rates = await fetchForexPrices();
    if (!rates) return;

    const priceData = convertPrices(rates);
    const signalList = document.getElementById("auto-signal-list");
    signalList.innerHTML = "";

    pairs.forEach(pair => {
        const currentPrice = priceData[pair];
        const randomTimeFrame = timeFrames[Math.floor(Math.random() * timeFrames.length)];
        const signal = generateSignal(currentPrice, randomTimeFrame);

        const listItem = document.createElement("li");
        listItem.className = signal.action === "BUY" ? "signal-message buy" : "signal-message sell";
        listItem.textContent = `${pair}: ${signal.message} (Tempo: ${signal.timeFrame})`;
        signalList.appendChild(listItem);
    });
}

// Atualização automática a cada 15 segundos
setInterval(autoUpdateSignals, 15000);

// Botão para Geração Manual
document.querySelector(".get-signal").addEventListener("click", manualSignal);
