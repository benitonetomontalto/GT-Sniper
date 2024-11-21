from flask import Flask, jsonify
from iqoptionapi.stable_api import IQ_Option
import time

app = Flask(__name__)

@app.route('/sinais', methods=['GET'])
def gerar_sinais():
    iq = IQ_Option('benitonetomontalto@gmail.com', 'benito200411')
    iq.connect()

    if not iq.check_connect():
        return jsonify({'error': 'Não foi possível conectar ao IQ Option'})

    paridades = ['EURUSD', 'GBPUSD', 'USDJPY']
    timeframe = 1
    sinais = []

    for par in paridades:
        velas = iq.get_candles(par, 60, 3, time.time())
        if velas[-1]['close'] > velas[-2]['close']:
            sinais.append({'ativo': par, 'sinal': 'compra', 'timeframe': timeframe})
        else:
            sinais.append({'ativo': par, 'sinal': 'venda', 'timeframe': timeframe})

    return jsonify({'sinais': sinais})

if __name__ == '__main__':
    app.run(debug=True)
