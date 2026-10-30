from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import students


app = FastAPI(
    title="Дневник репетитора API",
    version="1.0.0",
    description="REST API для работы с учениками"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


Base.metadata.create_all(
    bind=engine
)


app.include_router(
    students.router,
    prefix="/api"
)


@app.get("/")
def root():
    return {
        "message": "Дневник репетитора API работает"
    }