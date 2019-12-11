# Quart needs Python 3.7 and a library called Hypercorn to deploy
from quart import Quart, websocket, copy_current_websocket_context, render_template, request, redirect, url_for
import asyncio
import random
import json

loop = asyncio.get_event_loop()
app = Quart(__name__)

# Define connection and room dicts.
connections = {}
rooms = {}

@app.route("/")
async def index():
    return await render_template("index.html")

@app.route("/favicon.ico")
async def favicon():
    return redirect(url_for("static", filename="img/favicon.ico"))

@app.route("/<room_id>")
async def custom_room(room_id):
    return await render_template("index.html")

room_chars = "23456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz"

@app.route("/initialize", methods=["POST"])
async def initialize_room():
    try:
        data = await request.get_data()
        data = decode_message(data)
        for i in data:
            i = i.split(",")
            i = [int(i[0]), int(i[1])]
    except:
        abort(400)


    new_room_id = None
    while not new_room_id or new_room_id in rooms:
        new_room_id = "".join(random.choices(room_chars, k=random.randint(5,7)))

    create_room(new_room_id, data)

    return new_room_id

def encode_message(msg):
    return json.dumps(msg)

def decode_message(msg):
    return json.loads(msg)

def create_room(room_id, pixel_data=None):
    pixel_data = pixel_data if pixel_data else {}
    if not room_id in rooms:
        rooms[room_id] = Room(room_id, pixel_data)
        loop.create_task(rooms[room_id].run_loop())
    
    return rooms[room_id]

class MemberState:
    def __init__(self):
        self.color = 1
        self.x = 0
        self.y = 0

        # Set nickname to Anonymous
        self.nickname = "Anonymous Banana"
    
    def to_dict(self):
        return {"x": self.x, "y": self.y, "color": self.color, "nick": self.nickname}


class Room:
    def __init__(self, room_id, pixels={}):
        self.name = room_id
        self.members = {}
        self.pixels = pixels

        self.changed_states = {}
    
    def push_new_state(self, new_data, ws):
        clear = False
        new_pixels = dict(new_data["pixels"])

        if new_data["clear"]:
            self.pixels = {}
            clear = True
        else:
            try:
                for i in new_pixels:
                    i = i.split(",")
                    i = [int(i[0]), int(i[1])]
            except:
                return

            self.pixels.update(new_pixels)

        modified = False
        if new_data["x"] != None:
            self.members[ws].x = new_data["x"]
            modified = True
        if new_data["y"] != None:
            self.members[ws].y = new_data["y"]
            modified = True
        if new_data["color"] != None:
            self.members[ws].color = new_data["color"]
            modified = True
        if new_data["nick"] != None:
            self.members[ws].nickname = new_data["nick"]
            modified = True
        
        if modified or new_pixels or clear:
            self.changed_states[ws] = {
                "pixels":{**self.changed_states.get(ws, {}).get("pixels", {}), **new_pixels},
                "clear": clear,
                **self.members[ws].to_dict()
                }

    async def run_loop(self):
        while True:
            interval = 5

            member_count = len(self.members)
            if member_count == 0:
                await asyncio.sleep(5) # wait 5 seconds to see if anyone joins
                if len(self.members) == 0:
                    self.close_room()
                    return

            elif member_count >= 2:
                interval = min(0.5, member_count * 0.025)

            await self.broadcast()
            await asyncio.sleep(interval)

    async def broadcast(self):
        sent2 = False
        for member in self.members:
            pixels = {}
            users = []
            clear = False

            send = False
            for m in self.members:
                if m != member:
                    pixels.update(self.changed_states.get(m, {}).get("pixels", {}))
                    users.append(self.members[m].to_dict())
                    if self.changed_states.get(m, {}).get("clear", False):
                        clear = True

                    if m in self.changed_states:
                        send = True

            if pixels or send or clear:
                sent2 = True
                data = {
                    "users": users,
                    "pixels": pixels,
                    "clear": clear
                }
                data = encode_message(data)
                await member.send(data)

        if sent2:
            self.changed_states = {}

    async def new_member(self, ws):
        self.members[ws] = MemberState()
        self.changed_states[ws] = {
            "pixels":{},
            "clear": False,
            **self.members[ws].to_dict()
        }
        payload = {
            "users": [self.members[m].to_dict() for m in self.members if m != ws],
            "pixels": self.pixels,
            "clear": False
        }

        await ws.send(encode_message(payload))
    
    def member_leave(self, member):
        self.members.pop(member)
        
        for m in self.members:
            self.changed_states[m] = {
                "pixels":{},
                "clear": False,
                **self.members[m].to_dict()
            }

    def close_room(self):
        self.pixels = {}
        for m in self.members.keys():
            self.members.pop(m)
            connections.pop(m)

            m.close()
        
        rooms.pop(self.name)
        


async def receiving():
    while True:
        # Receives data from each websocket and does nothing with it (for now)
        data = await websocket.receive()
        try:
            data = decode_message(data)
        except:
            continue

        obj = websocket._get_current_object()
        if obj in connections:
            room = rooms[connections[obj]]
            room.push_new_state(data, obj)

@app.websocket('/<room_id>')
async def ws(room_id):
    obj = websocket._get_current_object()

    # Put connection in a dict
    connections[obj] = room_id

    room = create_room(room_id)

    await room.new_member(obj)

    # Tie sending loop to the connection
    consumer = asyncio.ensure_future(copy_current_websocket_context(receiving)(),)
    try:
        await asyncio.gather(consumer)
    finally:
        consumer.cancel()
        room.member_leave(obj)

if __name__ == '__main__':
    app.run(loop=loop)
