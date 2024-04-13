from typing import List
from pydantic import BaseModel


class StoreSecretParams(BaseModel):
    carrier: List[int]
    battleship: List[int]
    cruiser: List[int]
    submarine: List[int]
    destroyer: List[int]


class RetrieveSecretsParams(BaseModel):
    store_id: str
    secret_name: str
    type: str


class ComputeParams(StoreSecretParams):
    position: int


class GetBoardParams(BaseModel):
    store_id: str
