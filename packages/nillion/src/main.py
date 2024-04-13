import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from classes import ComputeParams, StoreSecretParams, RetrieveSecretsParams, GetBoardParams


from lib import compute, store_secrets, retrieve_secrets, get_board


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


@app.post('/compute')
async def compute_endpoint(props: ComputeParams):
    result = await compute.compute(props)
    return {"result": result}


@app.post('/store-secrets')
async def store_endpoint(props: StoreSecretParams):
    result = await store_secrets.store_secrets(props)
    return {"store_id": result}


@app.post('/retrieve-secrets')
async def retrieve_endpoint(props: RetrieveSecretsParams):
    result = await retrieve_secrets.retrieve_secrets(props)
    return {"result": result}


@app.post('/get-board')
async def get_board_endpoint(props: GetBoardParams):
    result = await get_board.get_board(props)
    return {"result": result}


if __name__ == "__main__":
    uvicorn.run(app)
