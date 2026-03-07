"""
iantoo.dev Python backend — FastAPI microservice on port 4000.
Handles: AI/ML processing, automation, background tasks, utility services.
Proxied via nginx at /api/py/*
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from routers import ai_tasks, automation, utils

app = FastAPI(
    title="iantoo.dev Python API",
    version="1.0.0",
    docs_url="/api/py/docs",
    openapi_url="/api/py/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://iantoo.dev", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(ai_tasks.router, prefix="/api/py/ai", tags=["AI"])
app.include_router(automation.router, prefix="/api/py/automation", tags=["Automation"])
app.include_router(utils.router, prefix="/api/py/utils", tags=["Utils"])


@app.get("/api/py/health")
async def health():
    return {"status": "ok", "service": "iantoo-python"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=4000,
        reload=os.getenv("NODE_ENV") != "production",
    )
