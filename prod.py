import sys
from main import app, loop
from hypercorn.asyncio import serve
from hypercorn.config import Config

config = Config()
config.bind = [sys.argv[1]]

loop.run_until_complete(serve(app, config))