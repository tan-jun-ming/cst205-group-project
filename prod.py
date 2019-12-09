import asyncio
from main import app, loop`
from hypercorn.asyncio import serve
from hypercorn.config import Config

loop.run_until_complete(serve(app, Config()))