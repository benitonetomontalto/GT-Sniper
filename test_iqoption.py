from iqoptionapi.stable_api import IQ_Option

email = "benitonetomontalto@gmail.com"
senha = "benito200411"

try:
    iq = IQ_Option(email, senha)
    status, reason = iq.connect()

    if status:
        print("Conexão estabelecida com sucesso!")
    else:
        print(f"Erro ao conectar: {reason}")
except Exception as e:
    print(f"Erro: {e}")
