from fastapi.middleware.cors import CORSMiddleware

from app.routes import project
from app.routes import ticket
from app.routes import comment
from fastapi import FastAPI
from app.database import Base, engine
from app.routes import user

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Bug Tracker API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(project.router)
app.include_router(ticket.router)
app.include_router(comment.router)

