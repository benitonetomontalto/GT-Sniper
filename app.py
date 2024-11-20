from flask import Flask, jsonify
from flask_cors import CORS
from iqoptionapi.stable_api import IQ_Option
import time

# Credenciais da IQ Option
EMAIL = "benitonetomontalto@gmail.com"
SENHA = "benito200411"

# Configuração do Flask
app = Flask(__name__)
CORS(app)

# Função para conectar na IQ Option
def conectar_iq_option():
    iq = IQ_Option(EMAIL, SENHA)
    conectado, motivo = iq.connect()
    if conectado:
        print("Conectado com sucesso à IQ Option.")
        return iq
    else:
        print(f"Erro ao conectar: {motivo}")
        return None

# Rota para gerar sinais
@app.route('/sinais', methods=['GET'])
def gerar_sinais():
    try:
        iq = conectar_iq_option()
        if not iq:
            return jsonify({"status": "error", "message": "Erro ao conectar na API"}), 500

        # Lista de paridades fornecidas pela IQ Option
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

# Inicialização do servidor
if __name__ == '__main__':
    app.run(debug=True, port=5000)
