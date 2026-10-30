from sqlalchemy.orm import Session

from app import models, schemas


def get_students(db: Session):
    return db.query(models.Student).all()


def get_student(db: Session, student_id: int):
    return db.get(models.Student, student_id)


def create_student(
    db: Session,
    data: schemas.StudentCreate
):
    student = models.Student(
        **data.model_dump()
    )

    db.add(student)
    db.commit()
    db.refresh(student)

    return student


def update_student(
    db: Session,
    student: models.Student,
    data: schemas.StudentUpdate
):
    changes = data.model_dump(
        exclude_unset=True
    )

    for field, value in changes.items():
        setattr(student, field, value)

    db.commit()
    db.refresh(student)

    return student


def delete_student(
    db: Session,
    student: models.Student
):
    db.delete(student)
    db.commit()