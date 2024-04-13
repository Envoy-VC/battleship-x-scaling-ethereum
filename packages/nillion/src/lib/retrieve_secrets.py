import os
from classes import RetrieveSecretsParams

from helpers.client import create_client

from dotenv import load_dotenv
load_dotenv()


async def retrieve_secrets(props: RetrieveSecretsParams):
    cluster_id = os.getenv("NILLION_CLUSTER_ID")
    client = create_client()

    result = await client.retrieve_secret(cluster_id, props.store_id, props.secret_name)
    secret_results = result[1].value

    if (props.type == "SecretInteger"):
        return secret_results
    elif (props.type == "SecretArray"):
        values = [secret_value.value for secret_value in secret_results]
        return values
    elif (props.type == "SecretBlob"):
        return secret_results.decode('utf-8')
    else:
        return secret_results
