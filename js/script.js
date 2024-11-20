const pairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "EUR/JPY", "CAD/JPY", "AUD/CAD", "NZD/USD", "EUR/GBP"];
const API_KEY = "30d5acf592bd385b1e115a5d80549946";

// Atualiza o status de conexão
async function updateConnectionStatus() {
    const connectionMessage = document.getElementById("connection-message");
    try {
        const url = `https://api.exchangerate.host/latest?base=EUR&access_key=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`Status da API: ${response.status}`);

        const data = await response.json();
        if (!data.rates) throw new Error("Resposta inválida da API");

        // Conexão bem-sucedida
        connectionMessage.textContent = "Conectado e pronto para gerar sinais!";
        connectionMessage.className = "connected";
    } catch (error) {
        console.error("Erro de conexão:", error.message);
        // Conexão falhou
        connectionMessage.textContent = "Erro ao conectar com o servidor!";
        connectionMessage.className = "disconnected";
    }
}

// Atualiza status de conexão ao carregar a página
updateConnectionStatus();

// Função para buscar preços
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

// Converte preços
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

// Funções de geração de sinais
async function manualSignal() {
    const rates = await fetchForexPrices();
    if (!rates) {
        alert("Erro ao obter dados da API. Verifique sua conexão.");
        return;
    }

    const selectedPair = document.getElementById("pair-select").value;
    const priceData = convertPrices(rates);
    const currentPrice = priceData[selectedPair];

    const signal = generateSignal(currentPrice);

    const signalMessage = document.getElementById("manual-signal-message");
    if (signal) {
        signalMessage.textContent = `${signal.message} (${selectedPair})`;
        signalMessage.className = signal.action === "BUY" ? "signal-message buy" : "signal-message sell";
    } else {
        signalMessage.textContent = "Nenhum sinal gerado.";
        signalMessage.className = "signal-message";
    }
}

function generateSignal(currentPrice) {
    if (!currentPrice) {
        return { action: "WAIT", message: "Sem dados disponíveis." };
    }
    const randomDirection = Math.random() > 0.5 ? "BUY" : "SELL";
    const message = randomDirection === "BUY" ? "Compre agora!" : "Venda agora!";
    console.log(`Sinal gerado para preço ${currentPrice}:`, { action: randomDirection, message });
    return { action: randomDirection, message: message };
}

async function autoUpdateSignals() {
    console.log("Atualizando sinais automaticamente...");
    const rates = await fetchForexPrices();
    if (!rates) return;

    const priceData = convertPrices(rates);
    const signalList = document.getElementById("auto-signal-list");
    signalList.innerHTML = "";

    pairs.forEach(pair => {
        const currentPrice = priceData[pair];
        const signal = generateSignal(currentPrice);

        const listItem = document.createElement("li");
        listItem.className = signal.action === "BUY" ? "signal-message buy" : "signal-message sell";
        listItem.textContent = `${pair}: ${signal.message}`;
        signalList.appendChild(listItem);
    });
}

// Atualização automática a cada 15 segundos
setInterval(autoUpdateSignals, 15000);

// Botão para sinais manuais
document.querySelector(".get-signal").addEventListener("click", manualSignal);
