import os
import py_nillion_client as nillion
from helpers.config import get_payments_config


def create_client(userkey, nodekey):
    bootnodes = [os.getenv("NILLION_BOOTNODE_MULTIADDRESS")]
    payments_config = get_payments_config()

    return nillion.NillionClient(
        nodekey,
        bootnodes,
        nillion.ConnectionMode.relay(),
        userkey,
        payments_config,
    )
