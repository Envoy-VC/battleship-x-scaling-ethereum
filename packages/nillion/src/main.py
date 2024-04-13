import uvicorn
from fastapi import FastAPI
from typing import List
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


from lib.compute import compute


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


class ComputeParams(BaseModel):
    row: List[int]
    position: int


@app.post('/compute')
async def compute_endpoint(params: ComputeParams):
    result = await compute(params.row, params.position)
    return {"result": result}


if __name__ == "__main__":
    uvicorn.run(app)
