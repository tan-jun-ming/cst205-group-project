
/*
* Safari and Edge polyfill for createImageBitmap
* https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/createImageBitmap
*
* Support source image types Blob and ImageData.
*
* From: https://dev.to/nektro/createimagebitmap-polyfill-for-safari-and-edge-228
* Updated by Yoan Tournade <yoan@ytotech.com>
*/
if (!('createImageBitmap' in window)) {
window.createImageBitmap = async function (data) {
return new Promise((resolve,reject) => {
let dataURL;
if (data instanceof Blob) {
				dataURL = URL.createObjectURL(data);
			} else if (data instanceof ImageData) {
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = data.width;
canvas.height = data.height;
ctx.putImageData(data,0,0);
				dataURL = canvas.toDataURL();
			} else {
throw new Error('createImageBitmap does not handle the provided image source type');
			}
const img = document.createElement('img');
img.addEventListener('load',function () {
resolve(this);
			});
img.src = dataURL;
		});
	};
}


let circles = {
	10: calculate_circle(10),
	20: calculate_circle(20),
	40: calculate_circle(40),
}


function encode(text){
    return btoa(pako.deflate(text, {to:'string'}));
}
function decode(text){
    return pako.inflate(atob(text), {to:'string'});
}

function calculate_circle(width){
	let ret = []
	
	let x = 0;
	let y = 0;

	let r = Math.floor(width/2);
	let r2 = r * r;
	let area = r2 << 2;
	let rr = r << 1;
	
	for (let i = 0; i < area; i++)
	{
		let tx = (i % rr) - r;
		let ty = (i / rr) - r;
	
		if (tx * tx + ty * ty <= r2)
			ret.push([Math.floor(x + tx), Math.floor(y + ty)]);
	}

	return ret;
}

function calculate_line(x1, y1, x2, y2, width, color){
	// adapted from https://www.javascriptteacher.com/bresenham-line-drawing-algorithm.html
	
    let ret = {};
	
	function pixel(x, y){
		for (i of circles[width]){
			ret[`${i[0] + x},${i[1] + y}`] = color;
		}
	}
    // Iterators, counters required by algorithm
    let x, y, dx, dy, dx1, dy1, px, py, xe, ye, i;

    // Calculate line deltas
    dx = x2 - x1;
    dy = y2 - y1;

    // Create a positive copy of deltas (makes iterating easier)
    dx1 = Math.abs(dx);
    dy1 = Math.abs(dy);

    // Calculate error intervals for both axis
    px = 2 * dy1 - dx1;
    py = 2 * dx1 - dy1;

    // The line is X-axis dominant
    if (dy1 <= dx1) {

        // Line is drawn left to right
        if (dx >= 0) {
            x = x1; y = y1; xe = x2;
        } else { // Line is drawn right to left (swap ends)
            x = x2; y = y2; xe = x1;
        }

        pixel(x, y); // Draw first pixel

        // Rasterize the line
        for (i = 0; x < xe; i++) {
            x = x + 1;

            // Deal with octants...
            if (px < 0) {
                px = px + 2 * dy1;
            } else {
                if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
                    y = y + 1;
                } else {
                    y = y - 1;
                }
                px = px + 2 * (dy1 - dx1);
            }

            // Draw pixel from line span at currently rasterized position
            pixel(x, y);
        }

    } else { // The line is Y-axis dominant

        // Line is drawn bottom to top
        if (dy >= 0) {
            x = x1; y = y1; ye = y2;
        } else { // Line is drawn top to bottom
            x = x2; y = y2; ye = y1;
        }

        pixel(x, y); // Draw first pixel

        // Rasterize the line
        for (i = 0; y < ye; i++) {
            y = y + 1;

            // Deal with octants...
            if (py <= 0) {
                py = py + 2 * dx1;
            } else {
                if ((dx < 0 && dy<0) || (dx > 0 && dy > 0)) {
                    x = x + 1;
                } else {
                    x = x - 1;
                }
                py = py + 2 * (dx1 - dy1);
            }

            // Draw pixel from line span at currently rasterized position
            pixel(x, y);
        }
	}
	return ret
 }
 
let payload = {};
reset_payload();

function reset_payload(){
	payload = {x: null, y: null, pixels: [], color: null, nick: null, clear: null}
}

let colors = [
	[255, 255, 255],
	[0, 0, 0],
	[244, 67, 54],
	[103, 58, 183],
	[63, 81, 181],
	[33, 150, 243],
	[0, 150, 136],
	[76, 175, 80],
	[139, 195, 74],
	[255, 235, 59],
	[255, 152, 0],
	[96, 125, 139],
]

let entire_canvas = {}

animals = [
	"Alligator",
	"Anteater",
	"Armadillo",
	"Auroch",
	"Axolotl",
	"Badger",
	"Banana",
	"Bat",
	"Bear",
	"Beaver",
	"Buffalo",
	"Camel",
	"Capybara",
	"Chameleon",
	"Cheetah",
	"Chinchilla",
	"Chipmunk",
	"Chupacabra",
	"Cormorant",
	"Coyote",
	"Crow",
	"Dingo",
	"Dinosaur",
	"Dog",
	"Dolphin",
	"Duck",
	"Elephant",
	"Ferret",
	"Fox",
	"Frog",
	"Giraffe",
	"Gopher",
	"Grizzly",
	"Hedgehog",
	"Hippo",
	"Hyena",
	"Ibex",
	"Ifrit",
	"Iguana",
	"Jackal",
	"Kangaroo",
	"Koala",
	"Kiwi",
	"Kraken",
	"Lemur",
	"Leopard",
	"Liger",
	"Lion",
	"Llama",
	"Loris",
	"Manatee",
	"Mink",
	"Monkey",
	"Moose",
	"Narwhal",
	"Orangutan",
	"Otter",
	"Panda",
	"Penguin",
	"Platypus",
	"Pumpkin",
	"Python",
	"Quagga",
	"Rabbit",
	"Raccoon",
	"Rhino",
	"Sheep",
	"Shrew",
	"Skunk",
	"Squirrel",
	"Tiger",
	"Turtle",
	"Walrus",
	"Wolf",
	"Wolverine",
	"Wombat"
]

let nickname = "Anonymous " + animals[Math.floor(Math.random() * animals.length)]

window.onload = function() {
	let myCanvas = document.getElementById("myCanvas");
	let ctx = myCanvas.getContext("2d");

    let brush_size_1 = document.getElementById("brush_size_1");
    let brush_size_2 = document.getElementById("brush_size_2");
	let brush_size_3 = document.getElementById("brush_size_3");
	
	let uri = `${window.location.hostname}:${window.location.port}`

	let room_id = window.location.pathname.substr(1);

	if (room_id == ""){
		room_id = null;
	}

	if (room_id){
		let websocket = new WebSocket("wss://" + uri + "/" + room_id);

		websocket.onmessage = function(event){
			data = JSON.parse(decode(event.data));
	
			if (data.clear){
				clear_canvas();
			} else {
				new_pixels = {}
				for (c of Object.keys(data.pixels)){
					i = c.split(",").map(Number);
		
					let c2 = coords_to_corner(...i)
					let k = `${c2[0]},${c2[1]}`
		
					new_pixels[k] = data.pixels[c]
				}
				place_pixels(new_pixels, true);
			}
	
			$(".brush").remove()
	
			for (i of data.users){
				color = colors[i.color]
				brush = $("<i class='material-icons' style='font-size:5em;margin-right:-0.5em'>brush</i>"
				).css("color", `RGB(${color[0]}, ${color[1]}, ${color[2]})`);
				name_card = $("<span></span>").text(i.nick).css("padding-top", "3em");

				cc = coords_to_corner(i.x, i.y)
				userdiv = $("<div class='brush'></div>").append(brush).append(name_card).css("left", cc[0] + myCanvas.offsetLeft).css("top", cc[1] + myCanvas.offsetTop - 70);
				$("body").append(userdiv);
	
			}
		}
	
		websocket.onopen = function ws_push(event) {
			if (payload.x != null || payload.y != null || payload.pixels.size || payload.color != null || payload.nick != null || payload.clear != null) {
				websocket.send(encode(JSON.stringify(payload)));
				reset_payload()
			}
			setTimeout(ws_push, 50)
	
		}

	} else {
		$("#nickname-form").remove();
		$("#nickname-feedback").text("Nicknames are disabled in private rooms. Share this room to enable it!");
	}


    let line_width = 10;
	let stroke_style = 1;

	payload.nick = nickname

    brush_size_1.onclick = function(){ ctx.lineWidth = 10; };
    brush_size_2.onclick = function(){ ctx.lineWidth = 20; };
	brush_size_3.onclick = function(){ ctx.lineWidth = 40; };
	
    // Fill Window Width and Height
    myCanvas.width = window.innerWidth;
    myCanvas.height = window.innerHeight - $(".toolbar").height();
	
	function coords_to_center(x, y){
		return [Math.floor(x - myCanvas.width/2), Math.floor(y - myCanvas.height/2)]
	}
	
	function coords_to_corner(x, y){
		return [Math.floor(x + myCanvas.width/2), Math.floor(y + myCanvas.height/2)]
	}

	for (i = 0; i < colors.length; i++){
		color = colors[i]
		toolbar_item = $("<div></div>").addClass("toolbar-item").attr("data-color", i).css("background", `RGB(${color[0]}, ${color[1]}, ${color[2]})`);
		if (i == 1){
			toolbar_item.addClass("selected");
		}
		$("#colorToolbar").append(toolbar_item);
	}

    // Mouse Event Handlers
	if(myCanvas){
		let isDown = false;
		ctx.lineWidth = line_width;
		
		$(myCanvas)
		.mousedown(function(e){
			isDown = true;
			currX = e.pageX - myCanvas.offsetLeft;
			currY = e.pageY - myCanvas.offsetTop;

			c = coords_to_center(currX, currY)
			payload.x = c[0]
			payload.y = c[1]

			place_pixels(calculate_line(currX, currY, currX, currY, ctx.lineWidth, stroke_style), false)
		})
		.mousemove(function(e){
			currX = e.pageX - myCanvas.offsetLeft;
			currY = e.pageY - myCanvas.offsetTop;
			
			c = coords_to_center(currX, currY)
			payload.x = c[0]
			payload.y = c[1]

			if(isDown !== false) {

				prevX = currX - e.originalEvent.movementX
				prevY = currY - e.originalEvent.movementY
				
				place_pixels(calculate_line(prevX, prevY, currX, currY, ctx.lineWidth, stroke_style), false)

			}
		})
		.mouseup(function(e){
			isDown = false;
			//ctx.closePath();
		});
	

	}
	
	function place_pixels(pixels, incoming){
		if (!pixels){
			return;
		}

		let minX = null;
		let minY = null;
		let maxX = null;
		let maxY = null;

		for (c of Object.keys(pixels)){
			i = c.split(",").map(Number);

			let c2 = coords_to_center(...i)
			let k = `${c2[0]},${c2[1]}`

			entire_canvas[k] = pixels[c]

			if (!incoming && room_id){
				payload.pixels.push([k, pixels[c]])
			}

			if (i[0] < minX || minX == null){
				minX = i[0]
			}
			if (i[0] > maxX || maxX == null){
				maxX = i[0]
			}
			if (i[1] < minY || minY == null){
				minY = i[1]
			}
			if (i[1] > maxY || maxY == null){
				maxY = i[1]
			}
		}

		minX = Math.max(minX, 0);
		minY = Math.max(minY, 0);
		maxX = Math.min(maxX, myCanvas.width)
		maxY = Math.min(maxY, myCanvas.height)

		
		let width = maxX - minX;
		let height = maxY - minY;
		
		if (!width || !height){
			return;
		}

		let data = [];
		
		for (let y = minY; y < maxY; y++){
			for (let x = minX; x < maxX; x++){
				let k = `${x},${y}`;
				if (pixels.hasOwnProperty(k)){
					data.push(...[...colors[pixels[k]], 255]);
				} else {
					data.push(0, 0, 0, 0)
				}
			}
			
		}
		
		let arr = new Uint8ClampedArray();
		arr = Uint8ClampedArray.from(data);
		let imageData = new ImageData(arr, width, height);
		imageBitmapPromise = createImageBitmap(imageData);
		Promise.resolve(imageBitmapPromise).then(function(value){
			ctx.drawImage(value, minX, minY);
		});
	}


	// Touch Events Handlers
	draw = {
		started: false,
		lastX: null,
		lastY: null,
		start: function(e) {
			this.started = true;

			currX = Math.floor(e.touches[0].pageX - myCanvas.offsetLeft);
			currY = Math.floor(e.touches[0].pageY - myCanvas.offsetTop);
			
			this.lastX = currX;
			this.lastY = currY;

			c = coords_to_center(currX, currY)
			payload.x = c[0]
			payload.y = c[1]

			place_pixels(calculate_line(currX, currY, currX, currY, ctx.lineWidth, stroke_style), false)

		},
		move: function(e) {
			currX = Math.floor(e.touches[0].pageX - myCanvas.offsetLeft);
			currY = Math.floor(e.touches[0].pageY - myCanvas.offsetTop);
			
			c = coords_to_center(currX, currY)
			payload.x = c[0]
			payload.y = c[1]

			if(this.started !== false) {

				prevX = this.lastX
				prevY = this.lastY
				
				this.lastX = currX;
				this.lastY = currY;

				place_pixels(calculate_line(prevX, prevY, currX, currY, ctx.lineWidth, stroke_style), false)

			}
		},
		end: function(e) {
			this.started = false;
		}
	};

	function onColorClick(color) {
		stroke_style = Number(color.attr("data-color"));
		payload.color = stroke_style

		$("#colorToolbar div").removeClass("selected");
		color.addClass("selected");
    	
	}
	
	function clear_canvas(){
		ctx.fillStyle = "#fff"
		ctx.fillRect(0,0, myCanvas.width, myCanvas.height);
		entire_canvas = {};
		
	}
	
	// Touch Events
	myCanvas.addEventListener('touchstart', draw.start, false);
	myCanvas.addEventListener('touchend', draw.end, false);
	myCanvas.addEventListener('touchmove', draw.move, false);
	
	clear_canvas();

	// Color toolabar click
	$('#colorToolbar div').click(function(event) {
    	onColorClick($(event.target))});
	$('#eraser').click(function (e) {
		payload.clear = true;
		clear_canvas();
	});

	$("#save").click(function(event) {
		myCanvas.toBlob(function(blob) {
		saveAs(blob, "whiteboard.png");
	});
	
});

	$('#modalName').on('show.bs.modal', function (event) {
		if (room_id){
			$("#nickname-box").val("").attr("placeholder", nickname);
			$("#nickname-feedback").text("\u{200B}")
		}
	})
	$('#modalName').on('shown.bs.modal', function (event) {
		$("#nickname-box").focus();
	})

	$("#nickname-form").submit(function (event){
		event.preventDefault();
		n = $("#nickname-box").val();
		if (n){
			nickname = n
			payload.nick = n;

			$("#nickname-box").blur();
			$("#nickname-feedback").text("Your nickname has been set.")

			// I can't close it without bad things happening for whatever reason
			// so I'm sticking with this (ノಠ益ಠ)ノ
		}
	})

	$('#modalJoin').on('show.bs.modal', function (event) {
		$("#join-box").val("");
	})
	$('#modalName').on('shown.bs.modal', function (event) {
		$("#join-box").focus();
	})

	$("#join-form").submit(function (event){
		event.preventDefault();
		join_id = $("#join-box").val();
		if (join_id){
			window.location.replace("https://" + uri + "/" + join_id);
		}
	})

	$("#share-button2").click(async function(e){
		data = await fetch("https://" + uri + "/initialize", {method:"POST", body:encode(JSON.stringify(entire_canvas))});
		room_id = await data.text();

		window.location.replace("https://" + uri + "/" + room_id);
	})

	// Disable Page Move
	document.body.addEventListener('touchmove',function(evt){
		evt.preventDefault();
	}, {passive: false});

};