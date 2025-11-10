from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import docker
import asyncio
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="CodeBattle Code Execution Service")

docker_client = docker.from_env()


class CodeSubmission(BaseModel):
    code: str
    language: str
    test_cases: Optional[list] = None
    timeout: Optional[int] = 10


class ExecutionResult(BaseModel):
    success: bool
    output: Optional[str] = None
    error: Optional[str] = None
    execution_time: float
    passed_tests: Optional[int] = None
    total_tests: Optional[int] = None


LANGUAGE_IMAGES = {
    "python": "python:3.11-alpine",
    "javascript": "node:18-alpine",
    "typescript": "node:18-alpine",
    "java": "openjdk:11-alpine",
    "cpp": "gcc:latest",
}


async def run_code_in_container(language: str, code: str, timeout: int) -> ExecutionResult:
    """Execute code in a Docker container"""
    image = LANGUAGE_IMAGES.get(language, "python:3.11-alpine")
    start_time = time.time()
    
    try:
        # Create container
        container = docker_client.containers.create(
            image=image,
            command=_get_command_for_language(language),
            mem_limit="512m",
            network_disabled=True,
            remove=False,
        )
        
        # Put code into container
        container.put_archive(
            path="/app",
            data=_create_tar(code)
        )
        
        # Start and wait for container
        container.start()
        
        try:
            result = container.wait(timeout=timeout)
            exit_code = result['StatusCode']
            
            # Get output
            logs = container.logs(stdout=True, stderr=True).decode('utf-8')
            execution_time = time.time() - start_time
            
            # Cleanup
            container.remove()
            
            if exit_code == 0:
                return ExecutionResult(
                    success=True,
                    output=logs,
                    execution_time=execution_time,
                )
            else:
                return ExecutionResult(
                    success=False,
                    error=logs,
                    execution_time=execution_time,
                )
                
        except docker.errors.TimeoutError:
            container.kill()
            container.remove()
            return ExecutionResult(
                success=False,
                error="Execution timeout",
                execution_time=time.time() - start_time,
            )
            
    except Exception as e:
        logger.error(f"Execution error: {e}")
        return ExecutionResult(
            success=False,
            error=str(e),
            execution_time=time.time() - start_time,
        )


def _get_command_for_language(language: str) -> list:
    """Get command to run code for specific language"""
    commands = {
        "python": ["python", "/app/code.py"],
        "javascript": ["node", "/app/code.js"],
        "java": ["bash", "-c", "cd /app && javac code.java && java code"],
        "cpp": ["bash", "-c", "cd /app && g++ code.cpp -o code && ./code"],
    }
    return commands.get(language, commands["python"])


def _create_tar(code: str) -> bytes:
    """Create a tar archive with the code"""
    import tarfile
    import io
    
    tar_stream = io.BytesIO()
    with tarfile.open(fileobj=tar_stream, mode='w') as tar:
        info = tarfile.TarInfo(name="code.py")
        info.size = len(code.encode('utf-8'))
        tar.addfile(info, io.BytesIO(code.encode('utf-8')))
    
    tar_stream.seek(0)
    return tar_stream.getvalue()


@app.post("/execute", response_model=ExecutionResult)
async def execute_code(submission: CodeSubmission):
    """Execute code and return results"""
    try:
        result = await run_code_in_container(
            submission.language,
            submission.code,
            submission.timeout
        )
        return result
    except Exception as e:
        logger.error(f"Error executing code: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "code-execution"}


@app.get("/languages")
async def get_languages():
    """Get supported languages"""
    return {
        "languages": list(LANGUAGE_IMAGES.keys()),
        "images": LANGUAGE_IMAGES,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

