from flask import Flask, jsonify
from iqoptionapi.stable_api import IQ_Option
import time

# Suas credenciais da IQ Option
LOGIN = "benitonetomontalto@gmail.com"
SENHA = "benito200411"

app = Flask(__name__)

# Configuração do CORS para evitar problemas de conexão
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,PUT,POST,DELETE,OPTIONS"
    return response

def conectar_iq_option():
    try:
        iq = IQ_Option(LOGIN, SENHA)
        check, reason = iq.connect()
        if check:
            print("Conexão com IQ Option realizada com sucesso!")
            return iq
        else:
            print(f"Erro ao conectar na IQ Option: {reason}")
            return None
    except Exception as e:
        print(f"Erro ao tentar conectar: {e}")
        return None

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

                sinal = "COMPRA" if ultimo_preco > penultimo_preco else "VENDA"
                sinais.append({"ativo": ativo, "sinal": sinal, "timeframe": f"{timeframe} min"})
            except Exception as e:
                print(f"Erro ao obter velas para {ativo}: {e}")
                continue

        return jsonify({"status": "success", "sinais": sinais})
    except Exception as e:
        print(f"Erro interno no servidor: {e}")
        return jsonify({"status": "error", "message": "Erro interno no servidor"}), 500

if __name__ == '__main__':
    app.run(debug=True)
