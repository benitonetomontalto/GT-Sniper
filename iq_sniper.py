from iqoptionapi.stable_api import IQ_Option
import time

# Credenciais da IQ Option
email = "benitonetomontalto@gmail.com"
password = "benito200411"

# Conexão com a API
print("Conectando à IQ Option...")
iq = IQ_Option(email, password)
iq.connect()

if iq.check_connect():
    print("IA conectada e pronta para gerar sinais!")
else:
    print("Erro ao conectar à IQ Option. Verifique suas credenciais.")
    exit()

# Função para buscar velas e gerar sinais
def gerar_sinais(ativo, timeframe):
    try:
        velas = iq.get_candles(ativo, timeframe * 60, 10, time.time())
        print(f"\nVelas recebidas para {ativo} (Timeframe {timeframe} min):")
        for vela in velas:
            print(vela)

        # Lógica de exemplo para gerar sinais
        if velas[-1]['close'] > velas[-2]['close']:
            print(f"SINAL DE COMPRA para {ativo} no timeframe {timeframe}!")
        elif velas[-1]['close'] < velas[-2]['close']:
            print(f"SINAL DE VENDA para {ativo} no timeframe {timeframe}!")
        else:
            print(f"Nenhum sinal gerado para {ativo}.")
    except Exception as e:
        print(f"Erro ao buscar velas ou gerar sinais para {ativo}: {e}")

# Lista de ativos e configuração de timeframe
ativos = ["EURUSD", "GBPUSD", "USDJPY"]  # Adicione as paridades desejadas
timeframe = 1  # Timeframe em minutos

# Loop para geração contínua de sinais
while True:
    for ativo in ativos:
        gerar_sinais(ativo, timeframe)
    time.sleep(10)  # Aguarde 10 segundos antes de repetir o processo
