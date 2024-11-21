from flask import Flask, jsonify, send_from_directory
import random
import datetime

app = Flask(__name__)

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

@app.route('/api/sinais-automaticos')
def sinais_automaticos():
    paridades = ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "ETHUSD"]
    sinais = []

    for paridade in paridades:
        sinal = {
            "paridade": paridade,
            "ordem": random.choice(["Compra", "Venda"]),
            "horario": datetime.datetime.now().strftime("%H:%M"),
            "expiracao": "M5"
        }
        sinais.append(sinal)

    return jsonify(sinais)

if __name__ == '__main__':
    app.run(debug=True)
