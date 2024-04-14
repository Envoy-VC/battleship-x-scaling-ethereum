import os
import random
import py_nillion_client as nillion
from helpers.config import get_payments_config, getUserKeyFromString, getUserKeyFromFile, node_config


def create_client(userKey: str):
    bootnodes = [os.getenv("NILLION_BOOTNODE_MULTIADDRESS")]
    payments_config = get_payments_config()

    node_key = nillion.NodeKey.from_seed(str(random.getrandbits(128)))

    key = ""
    if userKey == "":
        key = getUserKeyFromFile(node_config["userkey_file"])
    else:
        key = getUserKeyFromString(userKey)

    return nillion.NillionClient(
        node_key,
        bootnodes,
        nillion.ConnectionMode.relay(),
        key,
        payments_config,
    )
