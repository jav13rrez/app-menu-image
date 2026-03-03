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
    context_photo_id: Optional[str] = Field(default=None, description="ID de foto de contexto guardada")


class GenerateResponse(BaseModel):
    job_id: str
    status: str = "processing"
    estimated_time_sec: int = 30
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


# --- Billing schemas ---

class BuyCreditRequest(BaseModel):
    pack_id: str = Field(..., description="ID del pack: 'pack_10', 'pack_20', 'pack_50'")


class BuyCreditResponse(BaseModel):
    checkout_url: str


class BalanceResponse(BaseModel):
    credits_remaining: int
    total_purchased: int
    total_consumed: int


class CreditTransactionItem(BaseModel):
    id: str
    amount: int
    balance_after: int
    type: str
    reference_id: Optional[str] = None
    description: Optional[str] = None
    created_at: str


class TransactionsResponse(BaseModel):
    transactions: list[CreditTransactionItem]
    has_more: bool


# --- Context photo schemas ---

class ContextPhotoItem(BaseModel):
    id: str
    image_url: str
    thumbnail_url: Optional[str] = None
    ai_description: Optional[str] = None
    label: str
    sort_order: int
    created_at: str


class ContextPhotoListResponse(BaseModel):
    photos: list[ContextPhotoItem]
    count: int
    max: int


class UploadContextPhotoRequest(BaseModel):
    image_url: str = Field(..., description="URL de la imagen subida a Supabase Storage")
    label: str = Field(default="Mi espacio", description="Etiqueta para identificar el espacio")


class UploadContextPhotoResponse(BaseModel):
    photo: ContextPhotoItem
    credits_used: int


class UpdateContextPhotoRequest(BaseModel):
    label: str = Field(..., min_length=1, max_length=100)
