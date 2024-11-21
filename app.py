from flask import Flask, jsonify
from flask_cors import CORS
import time
from iqoptionapi.stable_api import IQ_Option

app = Flask(__name__)
CORS(app)  # Corrigindo o problema de CORS

EMAIL = "benitonetomontalto@gmail.com"  # Substitua pelo e-mail correto
PASSWORD = "benito200411"  # Substitua pela senha correta

# Conexão com a IQ Option
def conectar_iq_option():
    iq = IQ_Option(EMAIL, PASSWORD)
    check, reason = iq.connect()
    if not check:
        print("Erro ao conectar na IQ Option:", reason)
        return None
    return iq

@app.route('/sinais', methods=['GET'])
def gerar_sinais():
    try:
        iq = conectar_iq_option()
        if not iq:
            return jsonify({"status": "error", "message": "Erro ao conectar na API"}), 500

        # Paridades e lógica de geração de sinais
        paridades = ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "EURJPY", "USDCAD", "NZDUSD"]
        timeframe = 1  # Timeframe de 1 minuto
        sinais = []

        for ativo in paridades:
            try:
                velas = iq.get_candles(ativo, 60, 3, time.time())
                ultimo_preco = velas[-1]['close']
                penultimo_preco = velas[-2]['close']
                sinal = "compra" if ultimo_preco > penultimo_preco else "venda"
                sinais.append({"ativo": ativo, "sinal": sinal, "timeframe": timeframe})
            except Exception as e:
                print(f"Erro ao obter velas para {ativo}: {e}")
                continue

        return jsonify({"status": "success", "sinais": sinais})
    except Exception as e:
        print(f"Erro interno no servidor: {e}")
        return jsonify({"status": "error", "message": "Erro interno no servidor"}), 500

if __name__ == "__main__":
    app.run(debug=True)
