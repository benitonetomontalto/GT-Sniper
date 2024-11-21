from flask import Flask, jsonify
from flask_cors import CORS
import random
import time

app = Flask(__name__)
CORS(app)

@app.route('/sinais', methods=['GET'])
def gerar_sinais():
    try:
        # Paridades fictícias
        paridades = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "EUR/JPY"]
        timeframe = ["1 MIN", "5 MIN", "15 MIN"]
        sinais = []

        # Gerar sinais fictícios
        for _ in range(5):  # Gerar 5 sinais fictícios
            ativo = random.choice(paridades)
            tempo = random.choice(timeframe)
            sinal = random.choice(["Compra", "Venda"])
            hora = time.strftime('%H:%M:%S', time.localtime())

            sinais.append({
                "ativo": ativo,
                "tempo": tempo,
                "sinal": sinal,
                "hora": hora
            })

        return jsonify({"status": "success", "sinais": sinais})
    except Exception as e:
        print(f"Erro interno no servidor: {e}")
        return jsonify({"status": "error", "message": "Erro interno no servidor"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
