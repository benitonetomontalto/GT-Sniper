document.addEventListener("DOMContentLoaded", function () {
    async function fetchSignals() {
        try {
            const response = await fetch("http://127.0.0.1:5000/sinais");
            const data = await response.json();

            if (data.status === "success") {
                const sinais = data.sinais;
                const primeiroSinal = sinais[0];

                document.getElementById("asset-name").textContent = primeiroSinal.ativo;
                document.getElementById("signal-type").textContent = primeiroSinal.sinal.toUpperCase();
                document.getElementById("signal-type").className = primeiroSinal.sinal === "COMPRA" ? "signal-buy" : "signal-sell";
                document.getElementById("signal-timeframe").textContent = primeiroSinal.timeframe;
            } else {
                alert("Erro ao carregar sinais: " + data.message);
            }
        } catch (error) {
            console.error("Erro ao buscar sinais:", error);
        }
    }

    fetchSignals();

    document.getElementById("next-signal").addEventListener("click", fetchSignals);
});
