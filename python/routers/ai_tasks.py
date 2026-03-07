"""
AI/ML processing routes — heavy tasks offloaded from Node.js.
"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from anthropic import AsyncAnthropic
import os

router = APIRouter()
client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY", ""))


class AnalyzeRequest(BaseModel):
    text: str
    task: str = "summarize"  # summarize | classify | extract | sentiment


class GenerateRequest(BaseModel):
    prompt: str
    model: str = "claude-haiku-4-5-20251001"
    max_tokens: int = 1024


@router.post("/analyze")
async def analyze_text(req: AnalyzeRequest):
    """Analyze text: summarize, classify, extract entities, or sentiment."""
    task_prompts = {
        "summarize": f"Summarize this in 2-3 bullet points:\n\n{req.text}",
        "classify": f"Classify the following text into a category. Return just the category name:\n\n{req.text}",
        "extract": f"Extract key entities (names, dates, technologies, places) from:\n\n{req.text}\n\nReturn as JSON array.",
        "sentiment": f"Analyze sentiment (positive/neutral/negative) and confidence 0-1. Return JSON: {{\"sentiment\": str, \"confidence\": float}}\n\n{req.text}",
    }

    if req.task not in task_prompts:
        raise HTTPException(status_code=400, detail=f"Unknown task: {req.task}")

    message = await client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=512,
        messages=[{"role": "user", "content": task_prompts[req.task]}],
    )

    return {"result": message.content[0].text, "task": req.task}


@router.post("/generate")
async def generate_text(req: GenerateRequest):
    """General text generation with streaming."""
    async def stream():
        async with client.messages.stream(
            model=req.model,
            max_tokens=req.max_tokens,
            messages=[{"role": "user", "content": req.prompt}],
        ) as stream:
            async for text in stream.text_stream:
                yield text

    return StreamingResponse(stream(), media_type="text/plain")
