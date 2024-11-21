from flask import Flask, jsonify
from flask_cors import CORS
import random
import time

app = Flask(__name__)
CORS(app)

# Função fictícia para gerar sinais
def gerar_sinal_ficticio():
    paridades = ["EUR/USD", "GBP/USD", "USD/JPY", "ETH/USD", "BTC/USD"]
    ordem = random.choice(["CALL", "PUT"])
    timeframe = random.choice(["M1", "M5", "M15"])
    horario = time.strftime("%H:%M", time.localtime())
    
    return {
        "paridade": random.choice(paridades),
        "ordem": ordem,
        "timeframe": timeframe,
        "horario": horario
    }

# Rota para sinais automáticos
@app.route('/sinais-automaticos', methods=['GET'])
def sinais_automaticos():
    sinais = [gerar_sinal_ficticio() for _ in range(5)]
    return jsonify({"status": "success", "sinais": sinais})

# Rota para sinal manual
@app.route('/sinal-manual', methods=['GET'])
def sinal_manual():
    sinal = gerar_sinal_ficticio()
    return jsonify({"status": "success", "sinal": sinal})

if __name__ == '__main__':
    app.run(debug=True)
