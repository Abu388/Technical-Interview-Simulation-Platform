"""Small reusable helpers."""
import uuid


def new_uuid() -> str:
    """Hex-formatted UUID without dashes, handy for shareable codes."""
    return uuid.uuid4().hex


def clean_code(value: str) -> str:
    """Normalize an alphanumeric share code to uppercase."""
    return value.strip().upper()
