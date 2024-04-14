import os
import py_nillion_client as nillion
from helpers.config import get_payments_config, getNodeKeyFromFile, getUserKeyFromString, getUserKeyFromFile, node_config


def create_client(userKey: str):
    bootnodes = [os.getenv("NILLION_BOOTNODE_MULTIADDRESS")]
    payments_config = get_payments_config()

    key
    if userKey == "":
        key = getUserKeyFromFile(node_config["userkey_file"])
    else:
        key = getUserKeyFromString(userKey)

    return nillion.NillionClient(
        getNodeKeyFromFile(node_config["nodekey_file"]),
        bootnodes,
        nillion.ConnectionMode.relay(),
        key,
        payments_config,
    )
