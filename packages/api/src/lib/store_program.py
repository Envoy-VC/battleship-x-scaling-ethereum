from helpers.client import create_client
import os

from dotenv import load_dotenv
load_dotenv()


async def store_program():
    cluster_id = os.getenv("NILLION_CLUSTER_ID")
    client = create_client("")

    program_name = "main"
    program_mir_path = f"./programs/target/{program_name}.nada.bin"
    print(f"Storing program in the network: {program_name}")

    await client.store_program(
        cluster_id, program_name, program_mir_path
    )

    client_id = client.user_id()
    program_id = f"{client_id}/{program_name}"

    print(f"Program stored at program_id: {program_id}")

    return [
        program_id,
        client
    ]
