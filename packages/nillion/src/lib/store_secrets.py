import os
import py_nillion_client as nillion
from classes import StoreSecretParams

from helpers.client import create_client

from dotenv import load_dotenv
load_dotenv()


async def store_secrets(props: StoreSecretParams):
    cluster_id = os.getenv("NILLION_CLUSTER_ID")
    client = create_client()

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

    store_id = await client.store_secrets(
        cluster_id, None, secrets, None
    )

    print(f"The secret is stored at store_id: {store_id}")

    return store_id
