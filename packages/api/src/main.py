import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio

from classes import ComputeParams, StoreBoardParams, RetrieveSecretsParams, GetBoardParams, StoreSecretParams, UpdateSecretParams


from lib import compute, retrieve_secrets, get_board, store_board, store_secret, update_secret, store_program
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROGRAM_ID = ""


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
    result = await compute.compute(PROGRAM_ID, props)
    return {"result": result}


@app.post('/retrieve-secrets')
async def retrieve_secret(props: RetrieveSecretsParams):
    result = await retrieve_secrets.retrieve_secrets(props)
    return {"result": result}


@app.post('/get-board')
async def get_board_endpoint(props: GetBoardParams):
    print(props.store_id)
    try:
        result = await get_board.get_board(props)
        return result
    except Exception as e:
        print(e)
        return {"error": str(e)}


async def store():
    global PROGRAM_ID
    PROGRAM_ID = await store_program.store_program()


if __name__ == "__main__":
    asyncio.run(store())
    config = uvicorn.Config(app, port=8000, reload=True)
    server = uvicorn.Server(config)
    server.run()
