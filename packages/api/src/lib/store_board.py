import os
import py_nillion_client as nillion
from classes import StoreBoardParams

from helpers.client import create_client

from dotenv import load_dotenv
load_dotenv()


async def store_board(props: StoreBoardParams):
    cluster_id = os.getenv("NILLION_CLUSTER_ID")
    client = create_client(props.user_key)

    carrier, battleship, cruiser, submarine, destroyer = [], [], [], [], []

    for data in props.carrier:
        carrier.append(nillion.SecretInteger(data))

    for data in props.battleship:
        battleship.append(nillion.SecretInteger(data))

    for data in props.cruiser:
        cruiser.append(nillion.SecretInteger(data))

    for data in props.submarine:
        submarine.append(nillion.SecretInteger(data))

    for data in props.destroyer:
        destroyer.append(nillion.SecretInteger(data))

    secrets = nillion.Secrets({
        "carrier": nillion.SecretArray(carrier),
        "battleship": nillion.SecretArray(battleship),
        "cruiser": nillion.SecretArray(cruiser),
        "submarine": nillion.SecretArray(submarine),
        "destroyer": nillion.SecretArray(destroyer),
    })

    permissions = nillion.Permissions.default_for_user(client.user_id())
    permissions.add_retrieve_permissions(set(
        ["2a4jZD3Hj2VyMxRrNt9P2pX8S3SVfNgyXaqKjeQZUJfKXve4gRBA37stjrYqB3gS1jhDP5ejPZZns8ADpSDfWpDh"]))

    store_id = await client.store_secrets(
        cluster_id, None, secrets, permissions
    )

    print(f"The secret is stored at store_id: {store_id}")

    return store_id
