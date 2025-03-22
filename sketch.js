let port, reader, writer;
let pinsUsed = ["apin0", "apin1", "dpin2", "dpin4", "dpin6"]; // List of pins used in the Arduino
let sensorData = {}; // Object to store sensor readings
let connectButton;
let prevX, prevY;
let isConnected = false; // Flag to indicate if Arduino is connected

function setup() {
  createCanvas(windowWidth, windowHeight);
  connectButton = createButton("Connect to Arduino");
  connectButton.position(20, 20);
  connectButton.mousePressed(connectToArduino);

  prevX = 0+20;
  prevY = height-20;
}

// Connect to Arduino and set up serial communication
async function connectToArduino() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    const textDecoder = new TextDecoderStream();
    const textEncoder = new TextEncoderStream();
    port.readable.pipeTo(textDecoder.writable);
    textEncoder.readable.pipeTo(port.writable);

    reader = textDecoder.readable
      .pipeThrough(new TransformStream(new LineBreakTransformer()))
      .getReader();
    writer = textEncoder.writable.getWriter();

    console.log("Connected to Arduino!");
    connectButton.remove();
    isConnected = true; // Set flag to true when connected
    runSerial();
  } catch (error) {
    console.error("Failed to open serial port:", error);
  }
}

// Read serial data and process sensor values
async function runSerial() {
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        reader.releaseLock();
        break;
      }
      processSerialData(value);
    }
  } catch (error) {
    console.error("Error reading serial data:", error);
  }
}

// Parse and store sensor values
function processSerialData(data) {
  let values = data.split(",").map(parseFloat);

  if (values.length >= 18) {
    sensorData = {}; // Reset object

    // set analog pins to either the value or empty string
    for (let i = 0; i <= 5; i++) {
      let pinName = `apin${i}`;
      if (pinsUsed.includes(pinName)) {
        sensorData[`analog${i}`] = values[i];
      } else {
        sensorData[`analog${i}`] = null;
      }
    }
    // set digital pins to either the value or empty string
    for (let i = 2; i <= 13; i++) {
      let pinName = `dpin${i}`;
      let index = i + 4; //start from index 6 in values array
      if (pinsUsed.includes(pinName)) {
        sensorData[`digital${i}`] = values[index];
      } else {
        sensorData[`digital${i}`] = null;
      }
    }
  }
}

// Retrieve sensor data
function getSensorData(type) {
  return sensorData[type] ?? 0; // Return 0 if not available
}

// Draw sensor data on the canvas
function draw() {
  if (!isConnected) {
    return; // Only draw if connected to Arduino
  }

  joystickX = getSensorData("analog1");
  joystickY = getSensorData("analog0");
  joystickButton = getSensorData("digital6");
  button1 = getSensorData("digital4");
  button2 = getSensorData("digital2");
  background(220);
  textSize(14);
  // let yOffset = 100;
  // for (let i = 0; i <= 5; i++) {
  //   text(`A${i}: ${getSensorData(`analog${i}`)}`, 20, yOffset);
  //   yOffset += 30;
  // }

  // for (let i = 2; i <= 13; i++) {
  //   text(`D${i}: ${getSensorData(`digital${i}`)}`, 20, yOffset);
  //   yOffset += 30;
  // }
  console.log(joystickX, joystickY, joystickButton, button1, button2);

  let mappedX = map(joystickX, 0, 1023, -1, 1);
  let mappedY = map(joystickY, 0, 1023, -1, 1);

  const maxSpeed = 5;

  // Create a vector from the mapped joystick values
  let movement = createVector(mappedX, mappedY);

  // Scale the vector by maxSpeed to control the speed of the circle
  movement.mult(maxSpeed);

  // Update the previous positions
  prevX += movement.x;
  prevY += movement.y;

  // Constrain the circle within the canvas boundaries
  prevX = constrain(prevX, 0, width);
  prevY = constrain(prevY, 0, height);

  // Draw the circle at the new position
  circle(prevX, prevY, 20);
}

// Class to handle line breaks in serial data
class LineBreakTransformer {
  constructor() {
    this.chunks = "";
  }

  transform(chunk, controller) {
    this.chunks += chunk;
    const lines = this.chunks.split("\r\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) {
    controller.enqueue(this.chunks);
  }
}
