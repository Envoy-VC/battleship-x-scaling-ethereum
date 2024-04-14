from typing import List
from pydantic import BaseModel


class WithUserKey(BaseModel):
    user_key: str


class StoreBoardParams(WithUserKey):
    carrier: List[int]
    battleship: List[int]
    cruiser: List[int]
    submarine: List[int]
    destroyer: List[int]


class StoreSecretParams(WithUserKey):
    name: str
    value: int | List[int] | str


class UpdateSecretParams(StoreSecretParams):
    store_id: int


class RetrieveSecretsParams(WithUserKey):
    store_id: str
    secret_name: str
    type: str


class ComputeParams(StoreSecretParams):
    position: int


class GetBoardParams(BaseModel):
    store_id: str
