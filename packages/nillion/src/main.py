import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from classes import ComputeParams, StoreBoardParams, RetrieveSecretsParams, GetBoardParams, StoreSecretParams, UpdateSecretParams


from lib import compute, retrieve_secrets, get_board, store_board, store_secret, update_secret

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post('/store-board')
async def store_board_endpoint(userKey: str, props: StoreBoardParams):
    result = await store_board.store_board(userKey, props)
    return {"store_id": result}


@app.post('/store-secret')
async def store_secret_endpoint(userKey: str, props: UpdateSecretParams):
    result = await u.store_secret(userKey, props)
    return {"store_id": result}


@app.post('/update-secret')
async def update_secret_endpoint(userKey: str, props: StoreSecretParams):
    result = await update_secret.update_secret(userKey, props)
    return {"store_id": result}


@app.post('/compute')
async def compute_endpoint(props: ComputeParams):
    result = await compute.compute(props)
    return {"result": result}


@app.post('/retrieve-secrets')
async def retrieve_secret(userKey: str, props: RetrieveSecretsParams):
    result = await retrieve_secrets.retrieve_secrets(userKey, props)
    return {"result": result}


@app.post('/get-board')
async def get_board_endpoint(userKey: str, props: GetBoardParams):
    result = await get_board.get_board(userKey, props)
    return {"result": result}


if __name__ == "__main__":
    uvicorn.run(app)
