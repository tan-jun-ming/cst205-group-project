from main import app
from hypercorn.asyncio import serve
from hypercorn.config import Config

loop = asyncio.get_event_loop()
loop.run_until_complete(serve(app, Config()))