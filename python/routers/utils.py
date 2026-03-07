"""
Utility routes — general helpers too complex for Node.js.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import re
import json
from typing import Any

router = APIRouter()


class ParseRequest(BaseModel):
    text: str
    format: str = "json"  # json | markdown | plain


class ValidationRequest(BaseModel):
    value: str
    rule: str  # email | url | alphanum | nonempty


@router.post("/parse")
async def parse_text(req: ParseRequest):
    """Parse/convert text between formats."""
    if req.format == "json":
        try:
            parsed = json.loads(req.text)
            return {"ok": True, "data": parsed}
        except json.JSONDecodeError as e:
            return {"ok": False, "error": str(e)}

    elif req.format == "markdown":
        # Basic markdown -> plain text stripping
        text = re.sub(r"#+ ", "", req.text)
        text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)
        text = re.sub(r"\*(.*?)\*", r"\1", text)
        text = re.sub(r"`(.*?)`", r"\1", text)
        return {"ok": True, "data": text.strip()}

    return {"ok": True, "data": req.text}


@router.post("/validate")
async def validate_input(req: ValidationRequest):
    """Server-side input validation."""
    rules = {
        "email": r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$",
        "url": r"^https?://[^\s/$.?#].[^\s]*$",
        "alphanum": r"^[a-zA-Z0-9_\-]+$",
        "nonempty": r".+",
    }

    if req.rule not in rules:
        raise HTTPException(status_code=400, detail=f"Unknown rule: {req.rule}")

    valid = bool(re.match(rules[req.rule], req.value.strip()))
    return {"valid": valid, "rule": req.rule}


@router.get("/ping")
async def ping():
    return {"pong": True}
