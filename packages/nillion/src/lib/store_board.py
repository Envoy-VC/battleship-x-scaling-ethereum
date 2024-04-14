import os
import py_nillion_client as nillion
from classes import StoreBoardParams

from helpers.client import create_client

from dotenv import load_dotenv
load_dotenv()


async def store_board(userKey: str, props: StoreBoardParams):
    cluster_id = os.getenv("NILLION_CLUSTER_ID")
    client = create_client(userKey)
    admin = create_client("")

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
    permissions.add_retrieve_permissions(set([admin.user_id()]))

    store_id = await client.store_secrets(
        cluster_id, None, secrets, None
    )

    print(f"The secret is stored at store_id: {store_id}")

    return store_id
