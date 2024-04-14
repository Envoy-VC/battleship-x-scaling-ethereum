import os
import py_nillion_client as nillion
from classes import StoreSecretParams

from helpers.client import create_client

from dotenv import load_dotenv
load_dotenv()


async def store_secret(props: StoreSecretParams):
    cluster_id = os.getenv("NILLION_CLUSTER_ID")
    client = create_client(props.user_key)
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

    secrets = nillion.Secrets(data)
    permissions = nillion.Permissions.default_for_user(client.user_id())

    store_id = await client.store_secrets(
        cluster_id, None, secrets, permissions
    )

    print(f"The secret is stored at store_id: {store_id}")

    return store_id
