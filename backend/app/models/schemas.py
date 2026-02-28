from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class AspectRatio(str, Enum):
    SQUARE = "1:1"
    THREE_FOUR = "3:4"
    FOUR_THREE = "4:3"
    PORTRAIT = "4:5"
    FIVE_FOUR = "5:4"
    STORY = "9:16"
    LANDSCAPE = "16:9"


class GenerateRequest(BaseModel):
    image_url: str = Field(..., min_length=1, description="URL o data URI de la imagen subida")
    style_id: str = Field(..., min_length=1, description="Identificador del estilo seleccionado")
    narrative: str = Field(default="none", description="Tipo de toque narrativo")
    aspect_ratio: AspectRatio = Field(default=AspectRatio.SQUARE)
    business_name: Optional[str] = Field(default=None, description="Nombre del negocio")
    location: Optional[str] = Field(default=None, description="Población y Provincia")
    post_context: Optional[str] = Field(default=None, description="Motivo de la publicación")


class GenerateResponse(BaseModel):
    job_id: str
    status: str = "processing"
    estimated_time_sec: int = 12
    poll_url: str


class JobResultData(BaseModel):
    generated_image_url: str
    generated_copy: str
    hashtags: list[str]
    headline: str = ""
    tagline: str = ""


class JobStatus(str, Enum):
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class JobResponse(BaseModel):
    status: JobStatus
    result: Optional[JobResultData] = None
    error: Optional[str] = None
