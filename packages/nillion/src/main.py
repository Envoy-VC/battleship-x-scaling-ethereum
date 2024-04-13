import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from classes import ComputeParams


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


@app.post('/compute')
async def compute_endpoint(props: ComputeParams):
    result = await compute(props)
    return {"result": result}


if __name__ == "__main__":
    uvicorn.run(app)
