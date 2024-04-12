from nada_dsl import *


def nada_main():
    party1 = Party(name="Party1")
    # Input the Battleship Game Row of the Opponent
    # In format of VX - where V is value(1,2) and X is co-ordinates(0,9)
    row = Array(SecretInteger(Input(name="row", party=party1)), size=10)

    # Input the attack x co-ordinates
    position = SecretInteger(Input(name="position", party=party1))

    # find if 2*10 + position is in row

    @nada_fn
    def check_exists(a: SecretInteger, b: SecretInteger) -> SecretInteger:
        return a * (position - b)

    result = row.reduce(check_exists, Integer(1))

    out = Output(result, "out", party1)

    return [out]
