import os
import py_nillion_client as nillion
from dotenv import load_dotenv
load_dotenv()


def get_payments_config():
    return nillion.PaymentsConfig(
        os.getenv("NILLION_BLOCKCHAIN_RPC_ENDPOINT"),
        os.getenv("NILLION_WALLET_PRIVATE_KEY"),
        int(os.getenv("NILLION_CHAIN_ID")),
        os.getenv("NILLION_PAYMENTS_SC_ADDRESS"),
        os.getenv("NILLION_BLINDING_FACTORS_MANAGER_SC_ADDRESS"),
    )


def getUserKeyFromFile(userkey_filepath):
    return nillion.UserKey.from_file(userkey_filepath)


def getUserKeyFromString(key: str):
    return nillion.UserKey.from_base58(key)


def getNodeKeyFromFile(nodekey_filepath):
    return nillion.NodeKey.from_file(nodekey_filepath)


node_config = {
    "userkey_file": os.getenv("NILLION_USERKEY_PATH_PARTY_1"),
    "nodekey_file": os.getenv("NILLION_NODEKEY_PATH_PARTY_1"),
    "nodekey_alternate_file": os.getenv("NILLION_NODEKEY_PATH_PARTY_4"),
    "party_name": "Party1",
}
