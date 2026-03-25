from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.search import router as search_router  
from app.api.ohlc import router as ohlc_router
from app.api.stock import router as stock_router 

app = FastAPI()

origins=[
    "http://localhost:3000","http://localhost:3001",
    ]  

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

app.include_router(search_router)
app.include_router(ohlc_router)
app.include_router(stock_router)


