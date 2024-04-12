from helpers.client import create_client
from helpers.config import getNodeKeyFromFile, getUserKeyFromFile, node_config
import os


from dotenv import load_dotenv
load_dotenv()


async def store_program():
    cluster_id = os.getenv("NILLION_CLUSTER_ID")
    client = create_client(
        getUserKeyFromFile(node_config["userkey_file"]), getNodeKeyFromFile(
            node_config["nodekey_file"])
    )

    program_name = "main"
    program_mir_path = "./programs/target/main.nada.bin"
    print(f"Storing program in the network: {program_name}")

    await client.store_program(
        cluster_id, program_name, program_mir_path
    )

    client_id = client.user_id()
    program_id = f"{client_id}/{program_name}"

    print(f"Program stored at program_id: {program_id}")
