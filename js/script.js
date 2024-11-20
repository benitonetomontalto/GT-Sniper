async function obterSinais() {
    try {
        const response = await fetch("http://127.0.0.1:5000/sinais");
        const data = await response.json();

        if (data.status === "success") {
            const sinais = data.sinais.map(sinal => `
                <div class="sinal">
                    <p>Paridade: ${sinal.ativo}</p>
                    <p>Sinal: ${sinal.sinal.toUpperCase()}</p>
                    <p>Timeframe: ${sinal.timeframe} min</p>
                </div>
            `).join("");

            document.getElementById("sinais").innerHTML = sinais;
        } else {
            document.getElementById("sinais").innerHTML = "<p class='erro'>Erro ao gerar sinais.</p>";
        }
    } catch (error) {
        document.getElementById("sinais").innerHTML = "<p class='erro'>Erro ao conectar ao servidor.</p>";
    }
}

// Atualiza os sinais a cada 10 segundos
setInterval(obterSinais, 10000);
