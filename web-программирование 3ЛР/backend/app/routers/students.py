from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db


router = APIRouter(
    prefix="/students",
    tags=["Students"]
)


@router.get(
    "",
    response_model=list[schemas.StudentResponse]
)
def read_students(
    db: Session = Depends(get_db)
):
    return crud.get_students(db)


@router.post(
    "",
    response_model=schemas.StudentResponse,
    status_code=status.HTTP_201_CREATED
)
def create_student(
    data: schemas.StudentCreate,
    db: Session = Depends(get_db)
):
    return crud.create_student(
        db,
        data
    )


@router.get(
    "/{student_id}",
    response_model=schemas.StudentResponse
)
def read_student(
    student_id: int,
    db: Session = Depends(get_db)
):
    student = crud.get_student(
        db,
        student_id
    )

    if student is None:
        raise HTTPException(
            status_code=404,
            detail="Ученик не найден"
        )

    return student


@router.patch(
    "/{student_id}",
    response_model=schemas.StudentResponse
)
def update_student(
    student_id: int,
    data: schemas.StudentUpdate,
    db: Session = Depends(get_db)
):
    student = crud.get_student(
        db,
        student_id
    )

    if student is None:
        raise HTTPException(
            status_code=404,
            detail="Ученик не найден"
        )

    return crud.update_student(
        db,
        student,
        data
    )


@router.delete(
    "/{student_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_student(
    student_id: int,
    db: Session = Depends(get_db)
):
    student = crud.get_student(
        db,
        student_id
    )

    if student is None:
        raise HTTPException(
            status_code=404,
            detail="Ученик не найден"
        )

    crud.delete_student(
        db,
        student
    )