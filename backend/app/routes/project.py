from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Project
from app.schemas import ProjectCreate

router = APIRouter(prefix="/projects")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    new_project = Project(name=project.name, owner_id=project.owner_id)
    db.add(new_project)
    db.commit()
    return {"message": "Project created"}

@router.get("/")
def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()
