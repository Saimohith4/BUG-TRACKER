from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Comment
from app.schemas import CommentCreate

router = APIRouter(prefix="/comments")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_comment(comment: CommentCreate, db: Session = Depends(get_db)):
    new_comment = Comment(
        text=comment.text,
        ticket_id=comment.ticket_id,
        user_id=comment.user_id
    )
    db.add(new_comment)
    db.commit()
    return {"message": "Comment added"}

@router.get("/{ticket_id}")
def get_comments(ticket_id: int, db: Session = Depends(get_db)):
    return db.query(Comment).filter(Comment.ticket_id == ticket_id).all()
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Comment
from app.schemas import CommentCreate

router = APIRouter(prefix="/comments")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_comment(comment: CommentCreate, db: Session = Depends(get_db)):
    new_comment = Comment(
        text=comment.text,
        ticket_id=comment.ticket_id,
        user_id=comment.user_id
    )
    db.add(new_comment)
    db.commit()
    return {"message": "Comment added"}

@router.get("/{ticket_id}")
def get_comments(ticket_id: int, db: Session = Depends(get_db)):
    return db.query(Comment).filter(Comment.ticket_id == ticket_id).all()
