import os
import py_nillion_client as nillion


from lib.store_program import store_program

from dotenv import load_dotenv
load_dotenv()


async def compute(row: list, position: int):
    cluster_id = os.getenv("NILLION_CLUSTER_ID")

    party_name = "Party1"

    [program_id, program_name, program_mir_path, client] = await store_program()
    party_id = client.party_id()
    party_id = client.party_id()
    PROGRAM_ID = program_id

    row_data = []
    for data in row:
        row_data.append(nillion.SecretInteger(data))

    secret1_name = "row"
    secret1_value = nillion.SecretArray(row_data)

    secret2_name = "position"
    secret2_value = nillion.SecretInteger(position)

    secrets = nillion.Secrets({
        secret1_name: secret1_value,
        secret2_name: secret2_value
    })

    secret_bindings = nillion.ProgramBindings(PROGRAM_ID)
    secret_bindings.add_input_party(party_name, party_id)

    store_id = await client.store_secrets(
        cluster_id, secret_bindings, secrets, None
    )

    compute_bindings = nillion.ProgramBindings(PROGRAM_ID)
    compute_bindings.add_input_party(party_name, party_id)
    compute_bindings.add_output_party(party_name, party_id)

    compute_id = await client.compute(
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
            return compute_event.result.value
