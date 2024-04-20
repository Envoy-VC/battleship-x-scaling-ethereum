from nada_dsl import *


def nada_main():
    party1 = Party(name="Party1")
    """
    Input for Each Ship co-ordinates
    
    Coordinates for Carrier: 5
    Coordinates for Battleship: 4
    Coordinates for Cruiser: 3
    Coordinates for Submarine: 3
    Coordinates for Destroyer: 2
    
    Each co-ordinate is a SecretInteger of form 1XY where X is the row number and Y is the column number (0,9)
    
    Position is the attack co-ordinate of form 1XY where X is the row number and Y is the column number (0,9)
    
    
    How attack is determined:
    
    For each ship we run a reduce function with accumulator as Previous Result. The reduce function returns
    Previous Result * (position - current_value) for each value in the ship coordinates.
    
    So if the attack co-ordinate is present in the ship coordinates, the result will be 0 and further reduce will return 0.
    """
    carrier = Array(SecretInteger(Input(name="carrier", party=party1)), size=5)
    battleship = Array(SecretInteger(
        Input(name="battleship", party=party1)), size=4)
    cruiser = Array(SecretInteger(Input(name="cruiser", party=party1)), size=3)
    submarine = Array(SecretInteger(
        Input(name="submarine", party=party1)), size=3)
    destroyer = Array(SecretInteger(
        Input(name="destroyer", party=party1)), size=2)

    position = SecretInteger(Input(name="position", party=party1))

    @nada_fn
    def check_exists(a: SecretInteger, b: SecretInteger) -> SecretInteger:
        return a * (b - position)

    result1 = carrier.reduce(check_exists, Integer(1))
    result2 = battleship.reduce(check_exists, result1)
    result3 = cruiser.reduce(check_exists, result2)
    result4 = submarine.reduce(check_exists, result3)
    result5 = destroyer.reduce(check_exists, result4)

    result = result5 * result5

    out = Output(result, "out", party1)

    return [out]
