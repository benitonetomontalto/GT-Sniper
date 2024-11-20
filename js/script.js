document.addEventListener("DOMContentLoaded", () => {
    const sinaisList = document.getElementById("sinais-list");

    function fetchSinais() {
        fetch("http://127.0.0.1:5000/sinais")
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    sinaisList.innerHTML = ""; // Limpa a lista antes de atualizar
                    data.sinais.forEach(sinal => {
                        const sinalElement = document.createElement("div");
                        sinalElement.classList.add("signal-card");
                        sinalElement.innerHTML = `
                            <p><strong>Paridade:</strong> ${sinal.ativo}</p>
                            <p><strong>Sinal:</strong> ${sinal.sinal.toUpperCase()}</p>
                            <p><strong>Prazo:</strong> ${sinal.timeframe} min</p>
                        `;
                        sinaisList.appendChild(sinalElement);
                    });
                } else {
                    sinaisList.innerHTML = "<p>Erro ao obter os sinais. Tente novamente mais tarde.</p>";
                }
            })
            .catch(error => {
                console.error("Erro ao buscar sinais:", error);
                sinaisList.innerHTML = "<p>Erro ao conectar com o servidor.</p>";
            });
    }

    // Atualiza os sinais automaticamente a cada 10 segundos
    setInterval(fetchSinais, 10000);
    fetchSinais();
});
