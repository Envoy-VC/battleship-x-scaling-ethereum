from typing import List
from pydantic import BaseModel


class StoreSecretParams(BaseModel):
    carrier: List[int]
    battleship: List[int]
    cruiser: List[int]
    submarine: List[int]
    destroyer: List[int]


class ComputeParams(StoreSecretParams):
    position: int
