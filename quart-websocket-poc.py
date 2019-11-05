"""
Proof of concept for running websockets using Quart.
Also includes progenitor room code.
"""

# Quart needs Python 3.7 and a library called Hypercorn to deploy btw
from quart import Quart, websocket, copy_current_websocket_context
import asyncio

app = Quart(__name__)

@app.route("/")
async def hello():
    return "despacito"

# Define connection and room dicts.
# Should we make it persistent and store it in a seperate db?
# Do we even need the connection dict when we already have one for rooms that should also store every connection?
# Guess we can remove it in a future version.
connections = {}
rooms = {}


class Connection:
    def __init__(self, ws, room):
        self.ws = ws
        self.room = room

        # Set color (Allow up to 16 perhaps?)
        self.color = 0

        # Set nickname to Anonymous
        # (Maybe follow google and add animal names as well? Would have to make sure they are unique per room.)
        self.nickname = "Anonymous"

class Room:
    def __init__(self, room_id):
        self.name = room_id
        self.members = set()
        self.size = (400, 300) # Configurable size in the future, perhaps?
        self.pixels = [] # A list of pixels will take up a ton of memory, it might be best to figure out some method of compressing it for storage purposes.
    
    # This should broadcast the given data to every member in the room.
    # I haven't actually tested this though
    async def broadcast(self, data):
        for member in self.members:
            await member.ws.send(data)

async def sending():
    while True:
        await asyncio.sleep(0) # Required to not get stuck in event loop
        # Dunno what to do here

async def receiving():
    while True:
        # Receives data from each websocket and does nothing with it (for now)
        data = await websocket.receive()
        obj = websocket._get_current_object()
        if obj in connections:
            ...

@app.websocket('/room/<room_id>')
async def ws(room_id):
    obj = websocket._get_current_object()

    # Put connection in a dict
    connections[obj] = Connection(obj, room_id)

    # Create rooms in a dict and add the member
    # Perhaps find some way to do this more elegantly?
    if not room_id in rooms:
        rooms[room_id] = Room(room_id)

    rooms[room_id].members.add(connections[obj])

    # Tie receiving/sending loops to the connection
    # Not sure if we need both of these if we only want to receive from these objects.
    producer = asyncio.ensure_future(copy_current_websocket_context(sending)(),)
    consumer = asyncio.ensure_future(copy_current_websocket_context(receiving)(),)
    try:
        await asyncio.gather(consumer, producer)
    finally:
        producer.cancel()
        consumer.cancel()
        connections.pop(obj)


app.run()