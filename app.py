from flask import Flask, jsonify, request
from datetime import datetime, timedelta
import pytz
import random

app = Flask(__name__)

ativos = ["EUR/USD", "USD/JPY", "GBP/USD", "AUD/CAD"]
sinais = ["CALL", "PUT"]

def gerar_sinal():
    ativo = random.choice(ativos)
    sinal = random.choice(sinais)
    horario = datetime.now(pytz.timezone("America/Sao_Paulo")).strftime("%H:%M")
    tempo = f"{random.choice([1, 5, 15])} MIN"
    return {"ativo": ativo, "sinal": sinal, "horario": horario, "tempo": tempo}

@app.route("/sinal-manual", methods=["POST"])
def sinal_manual():
    data = request.get_json()
    ativo = data.get("ativo", "EUR/USD")
    tempo = data.get("tempo", "1 MIN")
    sinal = gerar_sinal()
    sinal["ativo"] = ativo
    sinal["tempo"] = tempo
    return jsonify(sinal)

@app.route("/sinais-automaticos", methods=["GET"])
def sinais_automaticos():
    return jsonify([gerar_sinal() for _ in range(3)])

if __name__ == "__main__":
    app.run(debug=True)
