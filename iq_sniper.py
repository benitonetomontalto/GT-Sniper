from flask import Flask, jsonify, request
from iqoptionapi.stable_api import IQ_Option
import time

app = Flask(__name__)

def conectar_iq_option():
    iq = IQ_Option("benitonetomontalto@gmail.com", "benito200411")
    iq.connect()
    if iq.check_connect():
        print("Conectado com sucesso!")
        return iq
    else:
        print("Falha ao conectar.")
        return None

@app.route('/sinais', methods=['GET'])
def gerar_sinais():
    try:
        iq = conectar_iq_option()
        if not iq:
            return jsonify({"status": "error", "message": "Erro ao conectar na API"}), 500

        paridades = ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD"]
        timeframe = 1
        sinais = []

        for ativo in paridades:
            velas = iq.get_candles(ativo, 60, 3, time.time())
            ultimo_preco = velas[-1]['close']
            penultimo_preco = velas[-2]['close']
            sinal = "compra" if ultimo_preco > penultimo_preco else "venda"
            sinais.append({"ativo": ativo, "sinal": sinal, "timeframe": timeframe})

        return jsonify({"status": "success", "sinais": sinais})
    except Exception as e:
        print(f"Erro interno no servidor: {e}")
        return jsonify({"status": "error", "message": "Erro interno no servidor"}), 500

if __name__ == '__main__':
    app.run(debug=True)
