import uvicorn
from fastapi import FastAPI
import asyncio

from store import store_program


app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


if __name__ == "__main__":
    asyncio.run(store_program())
    uvicorn.run(app)
