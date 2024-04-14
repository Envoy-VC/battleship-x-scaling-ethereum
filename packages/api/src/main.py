import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from classes import ComputeParams, StoreBoardParams, RetrieveSecretsParams, GetBoardParams, StoreSecretParams, UpdateSecretParams


from lib import compute, retrieve_secrets, get_board, store_board, store_secret, update_secret

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post('/test')
async def store_board_endpoint(props: StoreBoardParams):
    return {"store_id": props}


@app.post('/store-board')
async def store_board_endpoint(props: StoreBoardParams):
    result = await store_board.store_board(props)
    return {"store_id": result}


@app.post('/store-secret')
async def store_secret_endpoint(props: StoreSecretParams):
    result = await store_secret.store_secret(props)
    return {"store_id": result}


@app.post('/update-secret')
async def update_secret_endpoint(props: UpdateSecretParams):
    result = await update_secret.update_secret(props)
    return {"store_id": result}


@app.post('/compute')
async def compute_endpoint(props: ComputeParams):
    result = await compute.compute(props)
    return {"result": result}


@app.post('/retrieve-secrets')
async def retrieve_secret(props: RetrieveSecretsParams):
    result = await retrieve_secrets.retrieve_secrets(props)
    return {"result": result}


@app.post('/get-board')
async def get_board_endpoint(props: GetBoardParams):
    result = await get_board.get_board(props)
    return result


if __name__ == "__main__":

    config = uvicorn.Config(app, port=8000)
    server = uvicorn.Server(config)
    server.run()
