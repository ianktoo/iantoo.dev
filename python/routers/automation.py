"""
Automation routes — background jobs, scheduled tasks, system utilities.
"""
from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
import subprocess
import os
import asyncio

router = APIRouter()


class ScriptRequest(BaseModel):
    script: str  # name of a whitelisted script to run
    args: dict = {}


# Whitelist of allowed scripts (prevent arbitrary execution)
ALLOWED_SCRIPTS = {
    "db_backup": "scripts/db_backup.sh",
    "clear_old_tickets": None,  # handled inline
}


@router.post("/run-script")
async def run_script(req: ScriptRequest, background_tasks: BackgroundTasks):
    """Run a whitelisted background script."""
    if req.script not in ALLOWED_SCRIPTS:
        return {"error": "Script not allowed", "allowed": list(ALLOWED_SCRIPTS.keys())}

    async def _run():
        if req.script == "db_backup":
            db_path = os.getenv("DATABASE_URL", "./db/iantoo.db")
            backup_path = f"{db_path}.backup"
            proc = await asyncio.create_subprocess_exec(
                "cp", db_path, backup_path,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            await proc.communicate()

        elif req.script == "clear_old_tickets":
            # Could add DB cleanup here using aiosqlite
            pass

    background_tasks.add_task(_run)
    return {"queued": req.script}


@router.get("/status")
async def automation_status():
    """Check system status for automation tasks."""
    db_path = os.getenv("DATABASE_URL", "./db/iantoo.db")
    db_exists = os.path.exists(db_path)
    db_size_kb = os.path.getsize(db_path) // 1024 if db_exists else 0

    return {
        "db_exists": db_exists,
        "db_size_kb": db_size_kb,
        "python_version": os.sys.version,
    }
