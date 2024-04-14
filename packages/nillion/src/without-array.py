from nada_dsl import *


def initialize_arr(size: int, name: str, party):
    arr = []
    for i in range(size):
        arr.append(SecretInteger(Input(name=name + str(i), party=party)))

    return arr


def reduce(arr: list, accumulator, position):
    for i in range(len(arr)):
        accumulator = accumulator * (position - arr[i])

    return accumulator


def nada_main():
    party1 = Party(name="Party1")

    carrier = initialize_arr(5, "carrier", party1)
    battleship = initialize_arr(4, "battleship", party1)
    cruiser = initialize_arr(3, "cruiser", party1)
    submarine = initialize_arr(3, "submarine", party1)
    destroyer = initialize_arr(2, "destroyer", party1)

    position = SecretInteger(Input(name="position", party=party1))

    result1 = reduce(carrier, Integer(1), position)
    result2 = reduce(battleship, result1, position)
    result3 = reduce(cruiser, result2, position)
    result4 = reduce(submarine, result3, position)
    result = reduce(destroyer, result4, position)

    out = Output(result, "out", party1)

    return [out]


"""


---
program: alternate
inputs:
 secrets:
  destroyer0:
   SecretInteger: '3'
  destroyer1:
   SecretInteger: '3'
  carrier0:
    SecretInteger: '5'
    carrier1
    Secret
  position:
   SecretInteger: '3'
 public_variables: {}
expected_outputs:
 out:
  SecretInteger: '3'

"""
