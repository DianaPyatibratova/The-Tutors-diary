from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


Subject = Literal[
    "Математика",
    "Алгебра",
    "Информатика",
    "Физика"
]

Homework = Literal[
    "Задано",
    "Выполнено",
    "Не задано"
]


class StudentCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100
    )

    class_number: int = Field(
        ge=1,
        le=11
    )

    subject: Subject

    description: str = Field(
        min_length=5,
        max_length=500
    )

    homework: Homework


class StudentUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    class_number: int | None = Field(
        default=None,
        ge=1,
        le=11
    )

    subject: Subject | None = None

    description: str | None = Field(
        default=None,
        min_length=5,
        max_length=500
    )

    homework: Homework | None = None


class StudentResponse(BaseModel):
    id: int
    name: str
    class_number: int
    subject: str
    description: str
    homework: str
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )