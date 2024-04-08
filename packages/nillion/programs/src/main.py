from nada_dsl import *


def nada_main():
    party1 = Party(name="Party1")
    int1 = SecretInteger(Input(name="int1", party=party1))
    int2 = SecretInteger(Input(name="int2", party=party1))

    # Computation
    result = int1 + int2

    return [Output(result, "result", party1)]
