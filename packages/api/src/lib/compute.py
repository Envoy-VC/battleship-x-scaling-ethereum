from helpers.client import create_client
import os
import py_nillion_client as nillion
from classes import ComputeParams


from dotenv import load_dotenv
load_dotenv()


async def compute(PROGRAM_ID: str, props: ComputeParams):
    cluster_id = os.getenv("NILLION_CLUSTER_ID")
    client = create_client(props.user_key)
    party_name = "Party1"
    print(PROGRAM_ID)

    party_id = client.party_id()
    party_id = client.party_id()

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
        "position": nillion.SecretInteger(props.position)
    })

    secret_bindings = nillion.ProgramBindings(PROGRAM_ID)
    secret_bindings.add_input_party(party_name, party_id)

    store_id = await client.store_secrets(
        cluster_id, secret_bindings, secrets, None
    )

    compute_bindings = nillion.ProgramBindings(PROGRAM_ID)
    compute_bindings.add_input_party(party_name, party_id)
    compute_bindings.add_output_party(party_name, party_id)

    await client.compute(
        cluster_id,
        compute_bindings,
        [store_id],
        nillion.Secrets({}),
        nillion.PublicVariables({}),
    )

    while True:
        compute_event = await client.next_compute_event()
        if isinstance(compute_event, nillion.ComputeFinishedEvent):
            print(f"✅  Compute complete for compute_id {compute_event.uuid}")
            print(f"🖥️  The result is {compute_event.result.value}")
            return compute_event.result.value["out"]
