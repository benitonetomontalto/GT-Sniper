from flask import Flask, jsonify
from flask_cors import CORS
from iqoptionapi.stable_api import IQ_Option
import time

app = Flask(__name__)
CORS(app)

# Configuração da IQ Option
EMAIL = "benitonetomontalto@gmail.com"
SENHA = "benito200411"

def conectar_iq_option():
    iq = IQ_Option(EMAIL, SENHA)
    conectado, _ = iq.connect()
    return iq if conectado else None

@app.route('/sinais', methods=['GET'])
def gerar_sinais():
    try:
        iq = conectar_iq_option()
        if not iq:
            return jsonify({"status": "error", "message": "Erro ao conectar na API"}), 500

        paridades = ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "EURJPY", "USDCAD", "NZDUSD"]
        timeframe = 1
        sinais = []

        for ativo in paridades:
            velas = iq.get_candles(ativo, 60, 3, time.time())
            ultimo_preco = velas[-1]['close']
            penultimo_preco = velas[-2]['close']
            sinal = "COMPRA" if ultimo_preco > penultimo_preco else "VENDA"
            sinais.append({"ativo": ativo, "sinal": sinal, "timeframe": timeframe})

        return jsonify({"status": "success", "sinais": sinais})
    except Exception as e:
        return jsonify({"status": "error", "message": f"Erro interno: {e}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
