function writeMessage(canvas, message) {
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '18pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, 10, 25);
  }
  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');
  var canvasData = context.getImageData(0, 0, canvas.width, canvas.height);
  var websocket = new WebSocket('ws://localhost:5000/ws');

  canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
    // console.log(message);

    //This sends enough packets to bury an elephant
    //The packets also error for some reason
    var payload = {
        x: Math.floor(mousePos.x - canvas.width/2),
        y: Math.floor(mousePos.y - canvas.height/2)
    };

    websocket.send(JSON.stringify(payload));
    //console.log(canvasData.data);
    
  }, false);