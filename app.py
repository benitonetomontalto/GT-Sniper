from flask import Flask, jsonify, request
from datetime import datetime
import pytz

app = Flask(__name__)

# Função para obter o horário de Brasília
def get_brasilia_time():
    brasilia_tz = pytz.timezone("America/Sao_Paulo")
    return datetime.now(brasilia_tz).strftime("%H:%M:%S")

# Rota para sinais automáticos
@app.route("/sinais-automaticos", methods=["GET"])
def sinais_automaticos():
    sinais = [
        {
            "ativo": "EUR/USD",
            "tempo": "1 MIN",
            "ordem": "CALL",
            "horario": get_brasilia_time()
        },
        {
            "ativo": "GBP/USD",
            "tempo": "5 MIN",
            "ordem": "PUT",
            "horario": get_brasilia_time()
        },
        {
            "ativo": "USD/JPY",
            "tempo": "1 MIN",
            "ordem": "CALL",
            "horario": get_brasilia_time()
        },
        {
            "ativo": "AUD/CAD",
            "tempo": "5 MIN",
            "ordem": "PUT",
            "horario": get_brasilia_time()
        }
    ]
    return jsonify(sinais)

# Rota para gerar sinal manual
@app.route("/sinal-manual", methods=["POST"])
def gerar_sinal_manual():
    data = request.get_json()
    ativo = data.get("ativo", "EUR/USD")
    tempo = data.get("tempo", "1 MIN")
    ordem = "CALL" if datetime.now().second % 2 == 0 else "PUT"  # Alterna entre CALL e PUT

    sinal = {
        "ativo": ativo,
        "tempo": tempo,
        "ordem": ordem,
        "horario": get_brasilia_time()
    }
    return jsonify(sinal)

# Página inicial para verificar se o servidor está rodando
@app.route("/")
def home():
    return "Servidor de sinais GT Sniper está rodando!"

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
