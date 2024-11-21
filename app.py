from flask import Flask, jsonify
from flask_cors import CORS
import random
import time

app = Flask(__name__)
CORS(app)

# Configurações de ativos e timeframes
ativos = ["EURUSD", "GBPUSD", "USDJPY", "ETHUSD"]
timeframes = ["1 MIN", "5 MIN", "15 MIN"]

# Histórico de sinais automáticos
sinais_automaticos = []
ultimo_sinal_manual = None
tempo_espera = 60  # Tempo mínimo entre sinais manuais, em segundos

# Função para gerar sinal
def gerar_sinal():
    ativo = random.choice(ativos)
    timeframe = random.choice(timeframes)
    ordem = "PUT" if random.choice([True, False]) else "CALL"
    hora = time.strftime("%H:%M", time.localtime())
    return {
        "par": ativo,
        "hora": hora,
        "timeframe": timeframe,
        "ordem": ordem
    }

# Rota para gerar sinais automáticos
@app.route('/sinais', methods=['GET'])
def sinais():
    global sinais_automaticos
    if len(sinais_automaticos) >= 10:
        sinais_automaticos.pop(0)
    novo_sinal = gerar_sinal()
    sinais_automaticos.append(novo_sinal)
    return jsonify({"status": "success", "sinais": sinais_automaticos})

# Rota para gerar sinal manual
@app.route('/sinal-manual', methods=['GET'])
def sinal_manual():
    global ultimo_sinal_manual
    if ultimo_sinal_manual and time.time() - ultimo_sinal_manual['timestamp'] < tempo_espera:
        return jsonify({"status": "error", "message": "Aguarde antes de gerar outro sinal manual."}), 429
    novo_sinal = gerar_sinal()
    ultimo_sinal_manual = novo_sinal
    ultimo_sinal_manual['timestamp'] = time.time()
    return jsonify({"status": "success", "sinal": novo_sinal})

if __name__ == '__main__':
    app.run(debug=True)
