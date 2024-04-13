import os
from classes import GetBoardParams

from helpers.client import create_client

from dotenv import load_dotenv
load_dotenv()


async def get_board(props: GetBoardParams):
    cluster_id = os.getenv("NILLION_CLUSTER_ID")
    client = create_client()

    secret_names = ["carrier", "battleship",
                    "cruiser", "submarine", "destroyer"]
    values = {}

    for secret_name in secret_names:
        result = await client.retrieve_secret(cluster_id, props.store_id, secret_name)
        secret_results = result[1].value
        elements = [secret_value.value for secret_value in secret_results]
        values[secret_name] = elements

    return values
