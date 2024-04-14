import os
import py_nillion_client as nillion
from classes import UpdateSecretParams

from helpers.client import create_client

from dotenv import load_dotenv
load_dotenv()


async def update_secret(userKey: str, props: UpdateSecretParams):
    cluster_id = os.getenv("NILLION_CLUSTER_ID")
    client = create_client(userKey)
    name = props.name
    value = props.value

    data = {}
    if (type(value) == int):
        data[name] = nillion.SecretInteger(value)
    elif (type(value) == list):
        data[name] = nillion.SecretArray(
            [nillion.SecretInteger(data) for data in value])
    elif (type(value) == str):
        data[name] = nillion.SecretBlob(bytearray(value, "utf-8")),
    else:
        return

    updated_secrets = nillion.Secrets(data)

    store_id = await client.update_secrets(
        cluster_id, props.store_id, None, updated_secrets
    )

    print(f"The Updated secret is stored at store_id: {store_id}")

    return store_id
